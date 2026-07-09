"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { joinCradleSession, setRecordingStatus, endCradleSession } from "@/features/cradle/actions";

export function CradleRoom({
  sessionId,
  isHost,
  peerAnonymityEnabled,
  initialRecordingStatus,
}: {
  sessionId: string;
  isHost: boolean;
  peerAnonymityEnabled: boolean;
  initialRecordingStatus: "not_recording" | "recording" | "recorded";
}) {
  const [status, setStatus] = useState<"connecting" | "connected" | "error" | "not_configured">("connecting");
  const [error, setError] = useState<string | null>(null);
  const [recordingStatus, setRecordingLocal] = useState(initialRecordingStatus);
  const [cameraOn, setCameraOn] = useState(!peerAnonymityEnabled);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomRef = useRef<import("twilio-video").Room | null>(null);
  const dataTrackRef = useRef<import("twilio-video").LocalDataTrack | null>(null);
  const localVideoTrackRef = useRef<import("twilio-video").LocalVideoTrack | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      const result = await joinCradleSession({ sessionId });
      if (cancelled) return;
      if (!result.ok) {
        if (result.error === "cradle_video_not_configured") {
          setStatus("not_configured");
        } else {
          setStatus("error");
          setError(result.error);
        }
        return;
      }

      const Video = await import("twilio-video");
      try {
        // Always create the video track, even in peer-anonymity mode — we
        // disable it locally rather than omit it, so a child can switch
        // their camera on mid-session if they change their mind, without
        // needing to renegotiate the whole connection.
        const local = await Video.createLocalTracks({ audio: true, video: { width: 640 } });
        const videoTrack = local.find((t) => t.kind === "video") as import("twilio-video").LocalVideoTrack | undefined;
        if (videoTrack) {
          localVideoTrackRef.current = videoTrack;
          if (!cameraOn) videoTrack.disable();
        }
        const tracks: import("twilio-video").LocalTrack[] = [...local];
        const dataTrack = new Video.LocalDataTrack();
        dataTrackRef.current = dataTrack;
        tracks.push(dataTrack);

        const room = await Video.connect(result.data.token, {
          name: result.data.roomName,
          tracks,
        });
        if (cancelled) {
          room.disconnect();
          return;
        }
        roomRef.current = room;
        setStatus("connected");

        room.localParticipant.videoTracks.forEach((pub) => {
          if (localVideoRef.current && pub.track.kind === "video") {
            localVideoRef.current.appendChild(pub.track.attach());
          }
        });

        const attachTrack = (track: import("twilio-video").RemoteTrack) => {
          if (track.kind === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.appendChild(track.attach());
          } else if (track.kind === "data") {
            (track as import("twilio-video").RemoteDataTrack).on("message", (message: string) => {
              try {
                const stroke = JSON.parse(message);
                drawRemoteStroke(stroke);
              } catch {
                /* ignore malformed whiteboard messages */
              }
            });
          }
        };

        const attachParticipant = (participant: import("twilio-video").RemoteParticipant) => {
          participant.tracks.forEach((pub) => {
            if (pub.isSubscribed && pub.track) attachTrack(pub.track);
          });
          participant.on("trackSubscribed", attachTrack);
        };

        room.participants.forEach((p) => attachParticipant(p));
        room.on("participantConnected", attachParticipant);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "connect_failed");
      }
    }

    function drawRemoteStroke(stroke: { x0: number; y0: number; x1: number; y1: number }) {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.strokeStyle = "#146B6B";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(stroke.x0, stroke.y0);
      ctx.lineTo(stroke.x1, stroke.y1);
      ctx.stroke();
    }

    connect();
    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shared whiteboard: local strokes drawn on canvas are broadcast over the
  // Twilio DataTrack so every participant's canvas stays in sync — a real
  // shared whiteboard, not a per-user scratchpad.
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const rect = canvasRef.current!.getBoundingClientRect();
    lastPoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !lastPoint.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#146B6B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    dataTrackRef.current?.send(JSON.stringify({ x0: lastPoint.current.x, y0: lastPoint.current.y, x1: x, y1: y }));
    lastPoint.current = { x, y };
  };

  const toggleRecording = async () => {
    const next = recordingStatus === "recording" ? "not_recording" : "recording";
    setRecordingLocal(next);
    await setRecordingStatus(sessionId, next);
  };

  const toggleCamera = () => {
    setCameraOn((on) => {
      const next = !on;
      if (localVideoTrackRef.current) {
        if (next) localVideoTrackRef.current.enable();
        else localVideoTrackRef.current.disable();
      }
      return next;
    });
  };

  if (status === "not_configured") {
    return (
      <Card tint="teal">
        <p className="font-display font-bold text-xl mb-2">The Cradle isn&apos;t switched on yet</p>
        <p className="text-charcoal-teal/80">
          Live video needs TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, and TWILIO_API_KEY_SECRET added
          to Vercel&apos;s environment variables. Everything else here — session records, chat,
          recording status, peer anonymity — is fully wired and ready.
        </p>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card tint="coral">
        <p className="font-display font-bold text-xl mb-2">Couldn&apos;t connect</p>
        <p className="text-charcoal-teal/80">{error}</p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            recordingStatus === "recording" ? "bg-brick-600 text-white" : "bg-teal-100 text-teal-900"
          }`}
        >
          {recordingStatus === "recording" ? "🔴 Recording" : recordingStatus === "recorded" ? "Recorded" : "Not recording"}
        </span>
        {peerAnonymityEnabled && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-plum-700/10 text-plum-700">
            Peer anonymity on — parent visibility unaffected
          </span>
        )}
        <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={toggleCamera}>
          {cameraOn ? "Turn camera off" : "Turn camera on"}
        </Button>
        {isHost && (
          <div className="flex gap-2">
            <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={toggleRecording}>
              {recordingStatus === "recording" ? "Stop recording" : "Start recording"}
            </Button>
            <Button
              variant="ghost"
              className="px-3 py-1.5 text-xs"
              onClick={async () => {
                await endCradleSession(sessionId);
                roomRef.current?.disconnect();
              }}
            >
              End session
            </Button>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl bg-charcoal-teal overflow-hidden aspect-video flex items-center justify-center">
          {cameraOn ? (
            <div ref={localVideoRef} className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />
          ) : (
            <span className="text-white text-sm">🧑 You (camera off)</span>
          )}
        </div>
        <div className="rounded-2xl bg-charcoal-teal overflow-hidden aspect-video flex items-center justify-center">
          <div ref={remoteVideoRef} className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />
          {status === "connecting" && <span className="text-white text-sm absolute">Connecting…</span>}
        </div>
      </div>

      <Card>
        <p className="text-xs font-bold text-charcoal-teal/60 mb-2">SHARED WHITEBOARD</p>
        <canvas
          ref={canvasRef}
          width={640}
          height={300}
          className="w-full rounded-2xl bg-white border-2 border-teal-100 touch-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerMove={onPointerMove}
        />
      </Card>
    </>
  );
}

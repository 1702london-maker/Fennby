"use server";

import { z } from "zod";
import twilio from "twilio";
import { withRole } from "@/lib/auth/withRole";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

function getTwilioEnv() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  if (!accountSid || !apiKeySid || !apiKeySecret) return null;
  return { accountSid, apiKeySid, apiKeySecret };
}

const createSessionSchema = z.object({
  lessonSessionId: z.string().uuid().optional(),
  sessionType: z.enum(["academic", "vocational"]),
  peerAnonymityEnabled: z.boolean().default(false),
});

// Only a tutor can start a Cradle session — a family joins one that's
// already been created, never the reverse.
export const createCradleSession = withRole(
  ["tutor"],
  async (session, input: z.infer<typeof createSessionSchema>): Promise<ActionResult<{ sessionId: string; roomName: string }>> => {
    const parsed = createSessionSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const roomName = `cradle-${crypto.randomUUID()}`;

    const twilioEnv = getTwilioEnv();
    if (twilioEnv) {
      const client = twilio(twilioEnv.apiKeySid, twilioEnv.apiKeySecret, { accountSid: twilioEnv.accountSid });
      try {
        await client.video.v1.rooms.create({ uniqueName: roomName, type: "group" });
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "twilio_room_create_failed" };
      }
    }

    // A message thread is created alongside the session so Cradle chat
    // feeds the same parent-visible transparency layer as everything else
    // (Part 2.3) — not a side channel that only exists inside the video UI.
    const { data: thread } = await supabase.from("message_threads").insert({}).select("id").single();

    const { data: cradleSession, error } = await supabase
      .from("cradle_sessions")
      .insert({
        lesson_session_id: parsed.data.lessonSessionId ?? null,
        session_type: parsed.data.sessionType,
        host_id: session.id,
        video_provider: "twilio",
        video_room_sid: roomName,
        peer_anonymity_enabled: parsed.data.peerAnonymityEnabled,
        recording_status: "not_recording",
      })
      .select("id")
      .single();
    if (error || !cradleSession) return { ok: false, error: error?.message ?? "create_failed" };

    if (thread) {
      await supabase.from("message_threads").update({ cradle_session_id: cradleSession.id }).eq("id", thread.id);
    }

    await supabase.from("cradle_participants").insert({
      session_id: cradleSession.id,
      profile_id: session.id,
      role_in_session: "host",
    });

    return { ok: true, data: { sessionId: cradleSession.id, roomName } };
  }
);

const joinSchema = z.object({
  sessionId: z.string().uuid(),
  anonymizedDisplayName: z.string().optional(),
});

export async function joinCradleSession(input: z.infer<typeof joinSchema>): Promise<ActionResult<{ token: string; roomName: string }>> {
  const session = await getSessionProfile();
  if (!session) return { ok: false, error: "unauthenticated" };

  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation_failed" };

  const supabase = await createClient();
  const { data: cradleSession } = await supabase
    .from("cradle_sessions")
    .select("id, video_room_sid, ended_at")
    .eq("id", parsed.data.sessionId)
    .maybeSingle();
  if (!cradleSession || cradleSession.ended_at) return { ok: false, error: "not_found" };

  await supabase.from("cradle_participants").insert({
    session_id: cradleSession.id,
    profile_id: session.id,
    role_in_session: "participant",
    anonymized_display_name: parsed.data.anonymizedDisplayName ?? null,
  });

  const twilioEnv = getTwilioEnv();
  if (!twilioEnv) return { ok: false, error: "cradle_video_not_configured" };

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const token = new AccessToken(twilioEnv.accountSid, twilioEnv.apiKeySid, twilioEnv.apiKeySecret, {
    identity: `${session.fullName}-${session.id.slice(0, 8)}`,
  });
  token.addGrant(new VideoGrant({ room: cradleSession.video_room_sid ?? undefined }));

  return { ok: true, data: { token: token.toJwt(), roomName: cradleSession.video_room_sid ?? "" } };
}

// Recording status must always be visible to every participant — this
// action is what changes it, and every participant's UI polls/reads the
// same cradle_sessions row, so there's no silent recording state only the
// host can see.
export const setRecordingStatus = withRole(
  ["tutor"],
  async (session, sessionId: string, status: "not_recording" | "recording" | "recorded"): Promise<ActionResult> => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("cradle_sessions")
      .update({ recording_status: status })
      .eq("id", sessionId)
      .eq("host_id", session.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

export const endCradleSession = withRole(
  ["tutor"],
  async (session, sessionId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("cradle_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("host_id", session.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

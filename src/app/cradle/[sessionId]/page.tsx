import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { CradleRoom } from "./CradleRoom";

export default async function CradleSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSessionProfile();
  if (!session) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🔒" title="Sign in required" description="" />
        </main>
      </PageShell>
    );
  }

  const supabase = await createClient();
  const { data: cradleSession } = await supabase
    .from("cradle_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (!cradleSession) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🎥" title="Session not found" description="This Cradle session may have ended or the link is incorrect." />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl">
            The Cradle — {cradleSession.session_type === "vocational" ? "Craft session" : "Tutor session"}
          </h1>
          <Link href="/trust#report" className="text-sm font-semibold text-brick-600 hover:underline">
            Report a concern
          </Link>
        </div>
        <CradleRoom
          sessionId={cradleSession.id}
          isHost={cradleSession.host_id === session.id}
          peerAnonymityEnabled={cradleSession.peer_anonymity_enabled}
          initialRecordingStatus={cradleSession.recording_status as "not_recording" | "recording" | "recorded"}
        />
      </main>
    </PageShell>
  );
}

"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { tutorProfiles as initialTutors } from "@/lib/seed-data";
import { TutorStatus } from "@/lib/types";

const statusColor: Record<TutorStatus, string> = {
  submitted: "bg-teal-100 text-teal-900",
  under_review: "bg-teal-100 text-teal-900",
  dbs_pending: "bg-coral-100 text-coral-600",
  contract_pending: "bg-coral-100 text-coral-600",
  training_pending: "bg-coral-100 text-coral-600",
  approved: "bg-sage-600/15 text-sage-600",
  rejected: "bg-brick-600/10 text-brick-600",
  suspended: "bg-brick-600/10 text-brick-600",
};

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState(initialTutors);

  const updateStatus = (id: string, status: TutorStatus) => {
    setTutors((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Tutor applications</h1>
        <div className="space-y-4">
          {tutors.map((t) => (
            <Card key={t.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <p className="font-display font-bold text-lg">{t.name}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[t.status]}`}>
                  {t.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-charcoal-teal/70">{t.subjects.join(" · ")}</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <p className="text-charcoal-teal/60 text-xs">DBS status</p>
                  <p className="font-semibold">{t.dbsStatus}</p>
                </div>
                <div>
                  <p className="text-charcoal-teal/60 text-xs">Training</p>
                  <p className="font-semibold">{t.trainingCompleted ? "Completed" : "Pending"}</p>
                </div>
                <div>
                  <p className="text-charcoal-teal/60 text-xs">Experience</p>
                  <p className="font-semibold">{t.experienceYears} years</p>
                </div>
              </div>
              {t.status !== "approved" && t.status !== "rejected" && (
                <div className="flex gap-2 mt-4">
                  <Button variant="primary" className="px-4 py-2 text-sm" onClick={() => updateStatus(t.id, "approved")}>
                    Approve
                  </Button>
                  <Button variant="outline" className="px-4 py-2 text-sm" onClick={() => updateStatus(t.id, "rejected")}>
                    Reject
                  </Button>
                  <Button variant="ghost" className="px-4 py-2 text-sm" onClick={() => updateStatus(t.id, "suspended")}>
                    Suspend
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}

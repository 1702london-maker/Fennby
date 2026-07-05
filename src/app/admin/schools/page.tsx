"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { schools as initialSchools } from "@/lib/seed-data";

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState(initialSchools);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Schools</h1>
        <div className="space-y-4">
          {schools.map((s) => (
            <Card key={s.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-lg">{s.name}</p>
                  <p className="text-sm text-charcoal-teal/70">URN {s.urn} · {s.localAuthority} · {s.pupilCount} pupils</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.approved ? "bg-sage-600/15 text-sage-600" : "bg-coral-100 text-coral-600"}`}>
                  {s.approved ? "APPROVED" : "PENDING"}
                </span>
              </div>
              {!s.approved && (
                <Button
                  variant="primary"
                  className="mt-4 px-4 py-2 text-sm"
                  onClick={() => setSchools((ss) => ss.map((x) => (x.id === s.id ? { ...x, approved: true } : x)))}
                >
                  Approve school
                </Button>
              )}
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}

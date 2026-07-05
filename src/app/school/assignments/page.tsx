"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { schoolClasses } from "@/lib/seed-data";

const types = ["Homework", "Topic quiz", "Mock assessment", "Reading task", "Revision task"];

export default function SchoolAssignmentsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Assignments</h1>
        <Card>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <div>
              <label className="block text-sm font-semibold mb-1">Type</label>
              <select className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Codes practice sheet" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Assign to</label>
              <select className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
                <option>Individual pupil</option>
                {schoolClasses.map((c) => <option key={c.id}>{c.name} (class)</option>)}
                <option>Whole year group</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="justify-center">Assign</Button>
            {saved && <p className="text-sm text-sage-600 font-semibold">Assigned successfully.</p>}
          </form>
        </Card>
      </main>
    </PageShell>
  );
}

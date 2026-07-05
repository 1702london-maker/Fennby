"use client";

import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function ApplyTutorPage() {
  const router = useRouter();

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-4xl mb-2">Apply to become a Fennby tutor</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-8">
          Every applicant completes identity verification, an enhanced DBS check, and signs our
          conduct agreement before ever meeting a child.
        </p>
        <Card>
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/apply-tutor/confirmation");
            }}
          >
            <div>
              <label htmlFor="full-name" className="block text-sm font-semibold mb-1">Full name</label>
              <input id="full-name" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Jane Reece" />
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold mb-1">Years of tutoring / teaching experience</label>
              <input id="experience" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. 6" />
            </div>
            <div>
              <label htmlFor="subjects" className="block text-sm font-semibold mb-1">Subjects / specialisms</label>
              <input id="subjects" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Verbal Reasoning, Maths" />
            </div>
            <div>
              <label htmlFor="dbs-upload" className="block text-sm font-semibold mb-1">Enhanced DBS certificate (or reference number)</label>
              <div className="rounded-2xl border-2 border-dashed border-teal-100 px-4 py-6 text-center text-charcoal-teal/70 text-sm">
                📎 Upload placeholder — attach your DBS certificate or reference number
              </div>
            </div>
            <Button type="submit" variant="primary" className="justify-center mt-2">
              Submit application
            </Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}

import { SimplePage } from "@/components/SimplePage";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function SchoolDemoPage() {
  return (
    <SimplePage
      eyebrow="For Schools"
      title="Book a demo"
      body="See the cohort dashboard, Pupil Premium reporting, and homework tools with your own school's data — no obligation."
    >
      <Card>
        <div className="grid gap-4 max-w-md">
          <label className="text-sm font-semibold" htmlFor="school-name">School name</label>
          <input id="school-name" className="rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Trafford Grammar Prep" />
          <label className="text-sm font-semibold" htmlFor="school-email">Email</label>
          <input id="school-email" type="email" className="rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@school.org.uk" />
          <Button variant="primary" className="mt-2 justify-center">Request a demo</Button>
        </div>
      </Card>
    </SimplePage>
  );
}

import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { SchoolDemoForm } from "./SchoolDemoForm";

export default function SchoolDemoPage() {
  return (
    <SimplePage
      eyebrow="For Schools"
      title="Book a demo"
      body="See the cohort dashboard, Pupil Premium reporting, and homework tools with your own school's data — no obligation."
    >
      <Card>
        <SchoolDemoForm />
      </Card>
    </SimplePage>
  );
}

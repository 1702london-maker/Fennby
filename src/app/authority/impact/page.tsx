import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AuthorityImpactPage() {
  return (
    <SimplePage
      eyebrow="Local Authority"
      title="Impact reports"
      body="Anonymised, aggregated regional attainment data — offered free to local authorities as a trust-building step, independent of any commercial relationship."
    >
      <Card className="flex items-center justify-between">
        <span className="font-semibold">Annual regional impact report (2026)</span>
        <Button variant="outline">Export PDF</Button>
      </Card>
    </SimplePage>
  );
}

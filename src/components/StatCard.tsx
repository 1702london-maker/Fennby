import { Card } from "@/components/Card";

export function StatCard({
  label,
  value,
  sublabel,
  tint = "white",
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  tint?: "white" | "teal" | "coral";
}) {
  return (
    <Card tint={tint}>
      <p className="text-sm font-semibold text-charcoal-teal/70">{label}</p>
      <p className="font-display font-bold text-3xl mt-1">{value}</p>
      {sublabel && <p className="text-xs text-charcoal-teal/60 mt-1">{sublabel}</p>}
    </Card>
  );
}

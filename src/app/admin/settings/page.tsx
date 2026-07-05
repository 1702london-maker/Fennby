import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";

export default function AdminSettingsPage() {
  return (
    <SimplePage eyebrow="Admin" title="Platform settings" body="System-wide configuration for the Fennby platform.">
      <Card>
        <p className="text-sm text-charcoal-teal/80">
          Environment configuration, feature flags, and integration settings will live here once
          the platform moves off local mock data.
        </p>
      </Card>
    </SimplePage>
  );
}

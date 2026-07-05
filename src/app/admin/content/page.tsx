import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { subjects, topics, activities, achievements } from "@/lib/seed-data";

export default function AdminContentPage() {
  return (
    <SimplePage eyebrow="Admin" title="Content management" body="Manage subjects, topics, activities, and achievements available across the platform.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <p className="font-display font-bold mb-2">Subjects &amp; topics</p>
          <p className="text-sm text-charcoal-teal/70">{subjects.length} subjects, {topics.length} topics</p>
        </Card>
        <Card>
          <p className="font-display font-bold mb-2">Activities</p>
          <p className="text-sm text-charcoal-teal/70">{activities.length} activities configured</p>
        </Card>
        <Card>
          <p className="font-display font-bold mb-2">Achievements</p>
          <p className="text-sm text-charcoal-teal/70">{achievements.length} achievement types</p>
        </Card>
      </div>
    </SimplePage>
  );
}

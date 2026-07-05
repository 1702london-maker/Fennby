import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const [subjects, topics, activities, achievements] = await Promise.all([
    supabase.from("subjects").select("key", { count: "exact", head: true }),
    supabase.from("topics").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
  ]);

  return (
    <SimplePage eyebrow="Admin" title="Content management" body="Manage subjects, topics, activities, and achievements available across the platform.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <p className="font-display font-bold mb-2">Subjects &amp; topics</p>
          <p className="text-sm text-charcoal-teal/70">{subjects.count ?? 0} subjects, {topics.count ?? 0} topics</p>
        </Card>
        <Card>
          <p className="font-display font-bold mb-2">Activities</p>
          <p className="text-sm text-charcoal-teal/70">{activities.count ?? 0} activities configured</p>
        </Card>
        <Card>
          <p className="font-display font-bold mb-2">Achievements</p>
          <p className="text-sm text-charcoal-teal/70">{achievements.count ?? 0} achievement types</p>
        </Card>
      </div>
    </SimplePage>
  );
}

import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/Card";
import { getMySchool, getClasses } from "@/features/schools/queries";
import { AssignmentForm } from "./AssignmentForm";

export default async function SchoolAssignmentsPage() {
  const school = await getMySchool();
  if (!school) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <EmptyState emoji="🏫" title="No school account found" description="" />
        </main>
      </PageShell>
    );
  }

  const classes = await getClasses(school.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Assignments</h1>
        {classes.length ? (
          <AssignmentForm classes={classes.map((c) => ({ id: c.id, name: c.name }))} />
        ) : (
          <Card>
            <EmptyState emoji="📚" title="No classes to assign to yet" description="Ask a Fennby admin to add your school's classes first." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}

import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getAllUsers } from "@/features/admin/queries";
import { SuspendButton } from "./SuspendButton";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const { q = "", role = "all" } = await searchParams;
  const users = await getAllUsers();

  const filtered = users.filter(
    (p) =>
      (role === "all" || p.role === role) &&
      (p.full_name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Users</h1>
        <form className="flex flex-wrap gap-3 mb-6" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search users..."
            className="flex-1 min-w-[200px] rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          />
          <select name="role" defaultValue={role} className="rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
            <option value="all">All roles</option>
            <option value="parent">Parent</option>
            <option value="tutor">Tutor</option>
            <option value="teacher">Teacher</option>
            <option value="school_admin">School Admin</option>
            <option value="admin">Admin</option>
            <option value="safeguarding">Safeguarding</option>
            <option value="authority">Local Authority</option>
          </select>
          <button type="submit" className="rounded-2xl bg-teal-900 text-white px-6 font-semibold min-h-[44px]">Filter</button>
        </form>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4 font-semibold">{p.full_name}</td>
                  <td className="py-2 pr-4">{p.email}</td>
                  <td className="py-2 pr-4 capitalize">{p.role.replace("_", " ")}</td>
                  <td className="py-2 pr-4 capitalize">{p.status}</td>
                  <td className="py-2">
                    <SuspendButton userId={p.id} disabled={p.status === "suspended"} />
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={5} className="py-6 text-center text-charcoal-teal/60">No users match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}

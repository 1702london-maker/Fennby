"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { profiles } from "@/lib/seed-data";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = profiles.filter(
    (p) =>
      (roleFilter === "all" || p.role === roleFilter) &&
      (p.fullName.toLowerCase().includes(query.toLowerCase()) || p.email.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Users</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-1 min-w-[200px] rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          >
            <option value="all">All roles</option>
            <option value="parent">Parent</option>
            <option value="tutor">Tutor</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
            <option value="safeguarding">Safeguarding</option>
            <option value="authority">Local Authority</option>
          </select>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4 font-semibold">{p.fullName}</td>
                  <td className="py-2 pr-4">{p.email}</td>
                  <td className="py-2 pr-4 capitalize">{p.role.replace("_", " ")}</td>
                  <td className="py-2">
                    <button className="text-brick-600 font-semibold hover:underline">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { completeForcedPasswordReset } from "@/features/tutors/applicationActions";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const result = await completeForcedPasswordReset({ newPassword: password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/apply-tutor/agreement");
    router.refresh();
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-semibold mb-1">New password</label>
        <input
          type="password"
          required
          minLength={12}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        />
        <p className="text-xs text-charcoal-teal/60 mt-1">At least 12 characters.</p>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Confirm new password</label>
        <input
          type="password"
          required
          minLength={12}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        />
      </div>
      {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
      <Button type="submit" variant="primary" className="justify-center" disabled={loading}>
        {loading ? "Saving…" : "Set password & continue"}
      </Button>
    </form>
  );
}

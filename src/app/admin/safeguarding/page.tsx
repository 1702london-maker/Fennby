import { redirect } from "next/navigation";

export default function AdminSafeguardingRedirect() {
  redirect("/safeguarding/dashboard");
}

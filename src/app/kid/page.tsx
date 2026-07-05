import { redirect } from "next/navigation";

export default function KidRedirect() {
  redirect("/child/today");
}

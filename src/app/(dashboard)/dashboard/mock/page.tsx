import { redirect } from "next/navigation";

// Redirect /dashboard/mock to a sample active session for demo purposes
export default function MockIndexPage() {
  redirect("/dashboard/mock/session_001");
}

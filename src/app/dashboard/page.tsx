import { getRequiredUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  await getRequiredUser();

  return <main className="min-h-screen bg-[#f3f4f6]" />;
}

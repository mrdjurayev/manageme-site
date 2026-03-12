import { getRequiredUser } from "@/lib/auth/get-user";
import { DashboardShell } from "./internal-shell";

export default async function DashboardPage() {
  await getRequiredUser();

  return (
    <DashboardShell
      initialServerTimeIso={new Date().toISOString()}
      serverTimeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
    />
  );
}

import type { Metadata } from "next";

import { getRequiredUser } from "@/lib/auth/get-user";

export const metadata: Metadata = {
  title: "ManageMe Documentation",
  description: "Internal documentation route.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DocumentationPage() {
  await getRequiredUser();

  return <main className="min-h-screen bg-[var(--ui-page-bg)]" />;
}

import type { ReactNode } from "react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import packageInfo from "@/../package.json";
import { Header } from "@/components/layout/header";
import { getAuth } from "@/lib/auth/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/?auth=required");
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">{children}</main>
      <footer className="text-muted-foreground/50 border-t px-4 py-6 text-center text-xs">
        {packageInfo.version}
      </footer>
    </div>
  );
}

import type { ReactNode } from "react";

import packageInfo from "@/../package.json";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: ReactNode }) {
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

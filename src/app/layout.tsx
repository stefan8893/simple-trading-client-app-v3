import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import packageInfo from "@/../package.json";
import { Header } from "@/app/_components/Header";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Trading",
  description: "Simple Trading is one louder",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <div
          className={cn(
            "flex min-h-screen flex-col lg:grid",
            "text-foreground",
            "grid-cols-1",
          )}
        >
          <div className={cn("relative flex flex-1 flex-col flex-nowrap")}>
            <Header />

            <main className="flex-1 px-2 pt-4 pb-20 sm:px-4 sm:pt-6 md:px-6 md:pt-8 lg:pt-10">
              <div className="mx-auto w-full max-w-4xl">{children}</div>
            </main>

            <footer className="border-t px-4 py-6 text-center text-muted-foreground/50 text-xs">
              {packageInfo.version}
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

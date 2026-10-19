import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import packageInfo from "@/../package.json";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";

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
  description: "Simple Trading - Track and Analyse Trades",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-screen flex-col font-sans">
        <div className={"relative flex flex-1 flex-col flex-nowrap"}>
          <Header />

          <main className="flex-1 px-4 py-8">{children}</main>

          <footer className="text-muted-foreground/50 border-t px-4 py-6 text-center text-xs">
            {packageInfo.version}
          </footer>
        </div>
      </body>
    </html>
  );
}

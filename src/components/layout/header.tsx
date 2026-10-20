"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SmartHeaderPosition,
  useSmartHeaderPosition,
} from "@/hooks/useSmartHeaderPosition";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function Header() {
  const HEADER_HEIGHT = 72;

  const { position, isAtTop, scrollY } = useSmartHeaderPosition(HEADER_HEIGHT);
  const pathname = usePathname();

  return (
    <>
      {/* Keep h-18 in sync with HEADER_HEIGHT  */}
      <header
        style={getHeaderStyle(position, scrollY)}
        className={cn(
          "sticky top-0 z-50 flex h-18 shrink-0 flex-row flex-nowrap items-center justify-between gap-4",
          "bg-background/50 border-b px-4 backdrop-blur-sm",
          !isAtTop && "transition-transform duration-300 ease-in-out",
        )}
      >
        <Link
          href="/home"
          className="text-foreground text-xl font-bold tracking-tight"
        >
          Simple Trading
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label="Main Navigation" className="flex items-center gap-4">
            {[
              { href: "/home", label: "Home" },
              { href: "/profile", label: "Profil" },
              { href: "/settings", label: "Einstellungen" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                {label}
              </Link>
            ))}
          </nav>
          <SignOutButton />
        </div>
      </header>
    </>
  );
}

function getHeaderStyle(position: SmartHeaderPosition, scrollY: number) {
  switch (position) {
    case "fixed-top":
      return { transform: `translateY(${-scrollY}px)`, transition: "none" };
    case "floating-hidden":
      return { transform: "translateY(-100%)" };
    case "floating-visible":
      return { transform: "translateY(0%)" };
  }
}

"use client";

import {
  SmartHeaderPosition,
  useSmartHeaderPosition,
} from "@/app/_hooks/useSmartHeaderPosition";
import { cn } from "@/lib/utils";

export function Header() {
  const HEADER_HEIGHT = 72;

  const { position, isAtTop, scrollY } = useSmartHeaderPosition(HEADER_HEIGHT);

  return (
    <>
      {/* Keep h-18 in sync with HEADER_HEIGHT  */}
      <header
        style={getHeaderStyle(position, scrollY)}
        className={cn(
          "sticky top-0 z-50 flex h-18 shrink-0 flex-col flex-nowrap items-start justify-center",
          "border-b bg-background/50 px-4 backdrop-blur-sm",
          !isAtTop && "transition-transform duration-300 ease-in-out",
        )}
      >
        <div>Header</div>
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

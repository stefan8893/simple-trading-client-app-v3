"use client";

import { useEffect, useRef, useState } from "react";

export type SmartHeaderPosition =
  "fixed-top" | "floating-hidden" | "floating-visible";

export type SmartHeader = {
  position: SmartHeaderPosition;
  isAtTop: boolean;
  scrollY: number;
};

export function useSmartHeaderPosition(
  headerHeight: number,
  threshold: number = 15,
) {
  const [scrollData, setScrollData] = useState<SmartHeader>({
    position: "fixed-top",
    isAtTop: true,
    scrollY: 0,
  });

  const lastScrollY = useRef(0);
  const lock = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!lock.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);
          const delta = currentScrollY - lastScrollY.current;

          setScrollData((previous) =>
            getSmartHeader(
              previous,
              currentScrollY,
              headerHeight,
              delta,
              threshold,
            ),
          );

          lastScrollY.current = currentScrollY;
          lock.current = false;
        });

        lock.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight, threshold]);

  return scrollData;
}

export function getSmartHeader(
  previous: SmartHeader,
  currentScrollY: number,
  headerHeight: number,
  delta: number,
  threshold: number,
): SmartHeader {
  const isInTopArea = currentScrollY <= headerHeight;
  const isScrolling = delta > 0;
  const isLeavingTop = !isInTopArea && previous.isAtTop && isScrolling;

  if (isInTopArea) {
    return getSmartHeaderForTopArea(previous, currentScrollY);
  } else if (isLeavingTop) {
    return {
      position: "floating-hidden",
      isAtTop: false,
      scrollY: currentScrollY,
    };
  } else {
    return getSmartHeaderForContentArea(
      previous,
      currentScrollY,
      delta,
      threshold,
    );
  }
}

export function getSmartHeaderForTopArea(
  previous: SmartHeader,
  currentScrollY: number,
): SmartHeader {
  const isEnteringFromBelow = !previous.isAtTop;
  const headerWasVisible = previous.position === "floating-visible";

  // if the user scrolls quite fast to the top
  if (currentScrollY <= 0) {
    return {
      position: "fixed-top",
      isAtTop: true,
      scrollY: currentScrollY,
    };
  }

  return {
    position: isEnteringFromBelow
      ? headerWasVisible
        ? "floating-visible"
        : "fixed-top"
      : previous.position,
    isAtTop: true,
    scrollY: currentScrollY,
  };
}

export function getSmartHeaderForContentArea(
  previous: SmartHeader,
  currentScrollY: number,
  delta: number,
  threshold: number,
) {
  const isFastScrolling = Math.abs(delta) > threshold;
  const isScrollingDown = delta > 0;
  return {
    position: isFastScrolling
      ? isScrollingDown
        ? "floating-hidden"
        : "floating-visible"
      : previous.position,
    isAtTop: false,
    scrollY: currentScrollY,
  };
}

"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// A scrolling area with no scrollbar. When there is more content below,
// a small glass arrow button appears at the bottom to scroll down.
export function ScrollableList({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateArrow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  // Re-check whenever the visible area or the content changes size
  useEffect(() => {
    const observer = new ResizeObserver(updateArrow);
    if (scrollRef.current) observer.observe(scrollRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [updateArrow]);

  function scrollDown() {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      top: el.clientHeight * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={updateArrow}
        className="-mx-1 h-full overflow-y-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={contentRef}>{children}</div>
      </div>

      <button
        type="button"
        onClick={scrollDown}
        aria-label="Scroll down"
        tabIndex={canScrollDown ? 0 : -1}
        aria-hidden={!canScrollDown}
        className={`absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/60 bg-white/40 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none dark:border-white/15 dark:bg-black/30 dark:hover:bg-black/50 ${
          canScrollDown
            ? "opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ChevronDown className="size-5" />
      </button>
    </div>
  );
}

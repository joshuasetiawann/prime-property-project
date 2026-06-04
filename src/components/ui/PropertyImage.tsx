"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Display-only property visual with a shimmer skeleton and graceful fallback.
 * Uses a plain <img> so bundled/remote sources render without optimisation
 * round-trips. If `src` fails, it swaps to `fallback` (a bundled visual).
 *
 * The ref callback clears the skeleton for images that finished loading before
 * hydration (otherwise `onLoad` never fires and the skeleton sticks).
 */
export function PropertyImage({
  src,
  fallback,
  alt,
  className,
  imgClassName,
  sizes,
  eager = false,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(src);

  const measureRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-mist-deep", className)}>
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={measureRef}
        src={current}
        alt={alt}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallback && current !== fallback) setCurrent(fallback);
          else setLoaded(true);
        }}
        className={cn(
          "h-full w-full object-cover transition-all duration-700 ease-out",
          loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm",
          imgClassName
        )}
      />
    </div>
  );
}

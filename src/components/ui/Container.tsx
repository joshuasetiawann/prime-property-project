import { cn } from "@/lib/cn";

/** Centered page container with consistent responsive gutters. */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  const max =
    size === "wide"
      ? "max-w-7xl"
      : size === "narrow"
        ? "max-w-3xl"
        : "max-w-6xl";
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", max, className)}>
      {children}
    </div>
  );
}

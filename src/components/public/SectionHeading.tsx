import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 flex items-center gap-3",
            align === "center" && "justify-center"
          )}
        >
          <span className="gold-rule-left" aria-hidden />
          <span className={cn("eyebrow", isLight && "eyebrow-light")}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "font-display text-3xl leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.6rem]",
          isLight ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed sm:text-base",
            isLight ? "text-paper/65" : "text-muted"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary" // gold CTA, ink text
  | "dark" // ink fill
  | "outline" // gold outline (e.g. "Login Agent")
  | "outline-light" // for dark backgrounds
  | "ghost"
  | "subtle"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-55 disabled:pointer-events-none select-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink shadow-sm hover:bg-gold-bright hover:shadow-gold active:translate-y-px focus-visible:outline-gold-deep",
  dark: "bg-ink text-paper hover:bg-ink-soft active:translate-y-px focus-visible:outline-ink",
  outline:
    "border border-gold/70 text-ink hover:border-gold hover:bg-gold-wash active:translate-y-px focus-visible:outline-gold",
  "outline-light":
    "border border-gold/60 text-paper hover:bg-gold hover:text-ink active:translate-y-px focus-visible:outline-gold",
  ghost:
    "text-ink hover:bg-mist active:translate-y-px focus-visible:outline-gold",
  subtle:
    "bg-mist text-ink border border-line hover:bg-mist-deep active:translate-y-px focus-visible:outline-gold",
  danger:
    "bg-crimson text-paper hover:bg-crimson-deep active:translate-y-px focus-visible:outline-crimson",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}

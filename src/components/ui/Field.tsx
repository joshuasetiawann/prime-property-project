import { cn } from "@/lib/cn";

const CONTROL_BASE =
  "w-full rounded-md border bg-paper text-sm text-ink placeholder:text-muted-soft transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/35 focus:border-gold disabled:bg-mist disabled:text-muted";

function controlBorder(invalid?: boolean) {
  return invalid ? "border-crimson focus:ring-crimson/25 focus:border-crimson" : "border-line";
}

export function Label({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-[13px] font-medium text-ink-soft", className)}
    >
      {children}
      {required && <span className="ml-0.5 text-crimson">*</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson" role="alert">
      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0">
        <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      <FieldError>{error}</FieldError>
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(CONTROL_BASE, controlBorder(invalid), "h-11 px-3.5", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(CONTROL_BASE, controlBorder(invalid), "px-3.5 py-2.5 leading-relaxed", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function NativeSelect({ className, invalid, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          CONTROL_BASE,
          controlBorder(invalid),
          "h-11 appearance-none pl-3.5 pr-10 cursor-pointer",
          className
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      >
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

import { cn } from "@/lib/cn";

type IconProps = { className?: string };

function Svg({
  className,
  children,
  fill = false,
}: IconProps & { children: React.ReactNode; fill?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Sparkle: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </Svg>
  ),
  MapPin: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  ),
  ShieldCheck: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  ),
  Handshake: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M11 7 8 9.5a2 2 0 0 0 0 3l.5.5a2 2 0 0 0 3 0L13 11" />
      <path d="m13 8 2-1.5a2 2 0 0 1 2.4.2L21 9v5l-3 2-3.5-3" />
      <path d="M3 9v5l3 2 3-3" />
    </Svg>
  ),
  Building: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 21V5l8-2v18M20 21V9l-8-2" />
      <path d="M8 8v0M8 12v0M8 16v0M16 12v0M16 16v0" />
      <path d="M2 21h20" />
    </Svg>
  ),
  Search: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Svg>
  ),
  Filter: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 5h16l-6.4 8v5l-3.2 1.6V13L4 5Z" />
    </Svg>
  ),
  Dashboard: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="6" rx="1.5" />
      <rect x="13.5" y="12" width="7.5" height="9" rx="1.5" />
      <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
    </Svg>
  ),
  Users: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.7-4.7" />
    </Svg>
  ),
  Scroll: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M5 6a2 2 0 0 0 2-2M9 9h7M9 13h7M9 17h4" />
    </Svg>
  ),
  Plus: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  Edit: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M14 7l3 3" />
    </Svg>
  ),
  Trash: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </Svg>
  ),
  Logout: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 12H3m0 0 3.5-3.5M3 12l3.5 3.5" />
    </Svg>
  ),
  ChevronLeft: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M14 6l-6 6 6 6" />
    </Svg>
  ),
  ChevronRight: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M10 6l6 6-6 6" />
    </Svg>
  ),
  ChevronDown: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  ),
  Sort: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />
    </Svg>
  ),
  Close: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
  Check: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M5 12.5 9.5 17 19 7" />
    </Svg>
  ),
  External: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M14 5h5v5M19 5l-8 8M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
    </Svg>
  ),
  Crown: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8Z" />
    </Svg>
  ),
  Shield: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
    </Svg>
  ),
  Phone: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L19 16l1 4v0a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2Z" />
    </Svg>
  ),
  Mail: ({ className }: IconProps) => (
    <Svg className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  ),
  WhatsApp: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3.5 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path d="M9 8.5c-.3 0-.6.1-.8.4-.3.4-.8 1.1-.8 2.3s.8 2.3 2.2 3.6 2.9 1.8 4.1 1.6c.7-.1 1.3-.7 1.5-1.3.1-.4.1-.7 0-.9l-1.5-.7c-.2-.1-.4 0-.6.2l-.5.6c-.8-.4-1.7-1.1-2.1-2l.5-.5c.2-.2.2-.4.1-.6l-.7-1.6c-.1-.3-.4-.4-.6-.4Z" />
    </Svg>
  ),
  Clock: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  ),
  ArrowRight: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  ),
  Car: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M5 16v2M19 16v2M4 16h16v-3l-2-5H6L4 13v3Z" />
      <path d="M4 13h16" />
      <circle cx="8" cy="16" r="0.4" />
      <circle cx="16" cy="16" r="0.4" />
    </Svg>
  ),
  Ruler: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="M4 14 14 4l6 6L10 20 4 14Z" />
      <path d="M8 10l1.5 1.5M11 7l1.5 1.5M14 10l1.5 1.5" />
    </Svg>
  ),
  Compass: ({ className }: IconProps) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 5-4 1 2-5 4-1Z" />
    </Svg>
  ),
  Layers: ({ className }: IconProps) => (
    <Svg className={className}>
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icon;

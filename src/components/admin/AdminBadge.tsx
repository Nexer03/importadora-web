type AdminBadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "muted" | "danger";
};

const tones: Record<NonNullable<AdminBadgeProps["tone"]>, string> = {
  default: "border-zinc-300 bg-white text-zinc-950",
  success: "border-zinc-950 bg-zinc-950 text-white",
  warning: "border-zinc-300 bg-zinc-100 text-zinc-950",
  muted: "border-zinc-200 bg-zinc-100 text-zinc-500",
  danger: "border-zinc-950 bg-white text-zinc-950",
};

export function AdminBadge({ children, tone = "default" }: AdminBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

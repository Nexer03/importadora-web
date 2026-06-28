import Link from "next/link";

type CategoryPill = {
  href: string;
  label: string;
  description?: string;
};

type CategoryPillsProps = {
  items: CategoryPill[];
};

export function CategoryPills({ items }: CategoryPillsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-950"
        >
          <span className="text-sm font-black uppercase tracking-wide text-zinc-950">
            {item.label}
          </span>
          {item.description ? (
            <span className="mt-2 block text-sm leading-6 text-zinc-600">
              {item.description}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

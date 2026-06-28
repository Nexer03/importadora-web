type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

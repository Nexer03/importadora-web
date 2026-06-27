type AdminCardProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function AdminCard({ children, title, description }: AdminCardProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      {title ? (
        <div className="mb-5">
          <h2 className="text-base font-black text-zinc-950">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

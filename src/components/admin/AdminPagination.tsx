import Link from "next/link";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
};

export function AdminPagination({
  page,
  totalPages,
  makeHref,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const linkClass =
    "inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950";

  return (
    <nav
      aria-label="Paginacion"
      className="mt-6 flex items-center justify-between"
    >
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={linkClass}>
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-zinc-600">
        Pagina {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={linkClass}>
          Siguiente
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

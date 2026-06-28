import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        Error 404
      </p>
      <h1 className="text-4xl font-black tracking-normal text-zinc-950 sm:text-5xl">
        Pagina no encontrada
      </h1>
      <p className="max-w-md text-sm leading-6 text-zinc-600">
        La pagina que buscas no existe o fue movida. Revisa el catalogo o vuelve
        al inicio.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          Ir al inicio
        </Link>
        <Link
          href="/productos"
          className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-5 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
        >
          Ver productos
        </Link>
      </div>
    </main>
  );
}

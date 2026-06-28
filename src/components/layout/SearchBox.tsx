"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : "/productos");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full gap-2">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar productos…"
        aria-label="Buscar productos"
        className="h-10 flex-1 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-zinc-800"
      >
        Buscar
      </button>
    </form>
  );
}

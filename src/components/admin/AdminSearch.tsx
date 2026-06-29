type AdminSearchProps = {
  action: string;
  placeholder?: string;
  defaultValue?: string;
};

export function AdminSearch({
  action,
  placeholder = "Buscar…",
  defaultValue,
}: AdminSearchProps) {
  return (
    <form method="GET" action={action} className="mb-4 flex max-w-md gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 flex-1 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
      />
      <button
        type="submit"
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
      >
        Buscar
      </button>
    </form>
  );
}

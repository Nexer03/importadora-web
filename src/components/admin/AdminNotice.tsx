type AdminNoticeProps = {
  error?: string;
  saved?: string;
};

export function AdminNotice({ error, saved }: AdminNoticeProps) {
  if (!error && !saved) {
    return null;
  }

  return (
    <div
      className={`mb-5 rounded-lg border px-4 py-3 text-sm font-semibold ${
        error
          ? "border-zinc-950 bg-white text-zinc-950"
          : "border-zinc-200 bg-zinc-100 text-zinc-700"
      }`}
    >
      {error ? decodeURIComponent(error) : "Cambios guardados."}
    </div>
  );
}

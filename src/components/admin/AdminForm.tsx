import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function AdminFormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function AdminField({
  label,
  children,
  full = false,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  hint?: string;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? (
        <span className="mt-1 block text-xs font-normal normal-case leading-5 text-zinc-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 ${
        props.className ?? ""
      }`}
    />
  );
}

export function AdminTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-md border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 ${
        props.className ?? ""
      }`}
    />
  );
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 ${
        props.className ?? ""
      }`}
    />
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold text-zinc-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-zinc-950"
      />
      <span>
        {label}
        {hint ? (
          <span className="mt-0.5 block text-xs font-normal text-zinc-500">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function AdminSubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}

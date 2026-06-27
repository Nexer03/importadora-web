type AdminTableProps = {
  children: React.ReactNode;
};

export function AdminTable({ children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function AdminTh({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
      {children}
    </th>
  );
}

export function AdminTd({ children }: { children: React.ReactNode }) {
  return <td className="whitespace-nowrap px-4 py-3">{children}</td>;
}

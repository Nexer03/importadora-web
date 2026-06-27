import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/publicos", label: "Publicos" },
  { href: "/admin/colecciones", label: "Colecciones" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-zinc-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-4 py-5 lg:px-6">
        <Link
          href="/admin"
          className="text-lg font-black uppercase tracking-normal text-zinc-950"
        >
          Admin
        </Link>
        <p className="mt-2 text-xs font-medium text-zinc-500">
          Importadora Web
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 text-sm font-semibold text-zinc-700 lg:flex-col lg:overflow-visible lg:px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  adminUser: {
    name: string | null;
    email: string;
  };
};

export function AdminShell({ children, adminUser }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader adminUser={adminUser} />
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

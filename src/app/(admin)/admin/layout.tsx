import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  isAdminAccessError,
  requireAdminAccess,
} from "@/services/admin.guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Admin | Importadora",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let adminUser: Awaited<ReturnType<typeof requireAdminAccess>> | null = null;
  let redirectTarget: string | null = null;

  try {
    adminUser = await requireAdminAccess();
  } catch (error) {
    if (isAdminAccessError(error)) {
      redirectTarget =
        error.reason === "UNAUTHENTICATED"
          ? "/login?callbackUrl=/admin"
          : "/access-denied";
    } else {
      throw error;
    }
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  if (!adminUser) {
    redirect("/login?callbackUrl=/admin");
  }

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}

import { prisma } from "@/lib/prisma";

export const ADMIN_AUDIT_PAGE_SIZE = 30;

export function createAuditLog(data: {
  userId: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  detail?: string | null;
}) {
  return prisma.auditLog.create({ data });
}

export function getAuditLogsPage(params: { page?: number } = {}) {
  const page = Math.max(1, Math.trunc(params.page ?? 1));

  return Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
      skip: (page - 1) * ADMIN_AUDIT_PAGE_SIZE,
      take: ADMIN_AUDIT_PAGE_SIZE,
    }),
    prisma.auditLog.count(),
  ]);
}

export type AdminAuditRow = Awaited<
  ReturnType<typeof getAuditLogsPage>
>[0][number];

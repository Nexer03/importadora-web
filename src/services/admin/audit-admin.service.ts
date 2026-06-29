import {
  ADMIN_AUDIT_PAGE_SIZE,
  createAuditLog,
  getAuditLogsPage,
  type AdminAuditRow,
} from "@/repositories/admin/audit-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

/**
 * Registra una accion del admin. Nunca lanza: la auditoria no debe romper la
 * accion principal si falla.
 */
export async function logAdminAction(
  userId: string | null,
  action: string,
  opts?: { entity?: string; entityId?: string; detail?: string }
): Promise<void> {
  try {
    await createAuditLog({
      userId,
      action,
      entity: opts?.entity ?? null,
      entityId: opts?.entityId ?? null,
      detail: opts?.detail ?? null,
    });
  } catch {
    // ignorado a proposito
  }
}

export type AdminAuditLogDTO = {
  id: string;
  action: string;
  entity: string | null;
  detail: string | null;
  by: string | null;
  createdAt: Date;
};

function mapLog(row: AdminAuditRow): AdminAuditLogDTO {
  return {
    id: row.id,
    action: row.action,
    entity: row.entity,
    detail: row.detail,
    by: row.user?.name ?? row.user?.email ?? null,
    createdAt: row.createdAt,
  };
}

export async function getAdminAuditLogs(params: { page?: number } = {}) {
  await requireAdminAccess();
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const [rows, total] = await getAuditLogsPage({ page });
  return {
    logs: rows.map(mapLog),
    total,
    page,
    pageSize: ADMIN_AUDIT_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_AUDIT_PAGE_SIZE)),
  };
}

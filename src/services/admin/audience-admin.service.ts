import type { AudienceInput } from "@/validators/admin/audience.validator";
import { audienceInputSchema } from "@/validators/admin/audience.validator";
import {
  createAudience,
  deleteOrDeactivateAudience,
  getAdminAudienceById,
  getAdminAudiences,
  updateAudience,
} from "@/repositories/admin/audience-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

import { normalizeSlug, validateAdminInput } from "./admin-service-utils";

export type AdminAudienceDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  productsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type AudienceWithCount = Awaited<ReturnType<typeof getAdminAudiences>>[number];

function mapAudience(audience: AudienceWithCount): AdminAudienceDTO {
  return {
    id: audience.id,
    name: audience.name,
    slug: audience.slug,
    description: audience.description,
    isActive: audience.isActive,
    sortOrder: audience.sortOrder,
    productsCount: audience._count.products,
    createdAt: audience.createdAt,
    updatedAt: audience.updatedAt,
  };
}

function mapAudienceData(data: AudienceInput) {
  return {
    ...data,
    slug: normalizeSlug(data.slug),
  };
}

export async function getAdminAudiencesList() {
  await requireAdminAccess();
  const audiences = await getAdminAudiences();
  return audiences.map(mapAudience);
}

export async function getAdminAudienceDetail(id: string) {
  await requireAdminAccess();
  const audience = await getAdminAudienceById(id);
  return audience ? mapAudience(audience) : null;
}

export async function createAdminAudience(rawAudience: unknown) {
  await requireAdminAccess();
  const audience = validateAdminInput(audienceInputSchema, rawAudience);
  return createAudience(mapAudienceData(audience));
}

export async function updateAdminAudience(id: string, rawAudience: unknown) {
  await requireAdminAccess();
  const audience = validateAdminInput(audienceInputSchema, rawAudience);
  return updateAudience(id, mapAudienceData(audience));
}

export async function deleteOrDeactivateAdminAudience(id: string) {
  await requireAdminAccess();
  return deleteOrDeactivateAudience(id);
}

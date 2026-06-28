import { HomeSectionType } from "@prisma/client";

import type { HomeSectionInput } from "@/validators/admin/home-section.validator";
import { homeSectionInputSchema } from "@/validators/admin/home-section.validator";
import {
  createHomeSection,
  deleteHomeSection,
  getAdminHomeSectionById,
  getAdminHomeSections,
  updateHomeSection,
} from "@/repositories/admin/home-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

import { validateAdminInput } from "./admin-service-utils";

export type AdminHomeSectionDTO = {
  id: string;
  type: HomeSectionType;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type HomeSectionRecord = Awaited<
  ReturnType<typeof getAdminHomeSections>
>[number];

function mapHomeSection(section: HomeSectionRecord): AdminHomeSectionDTO {
  return {
    id: section.id,
    type: section.type,
    title: section.title,
    subtitle: section.subtitle,
    imageUrl: section.imageUrl,
    buttonText: section.buttonText,
    buttonUrl: section.buttonUrl,
    sortOrder: section.sortOrder,
    isActive: section.isActive,
    startsAt: section.startsAt,
    endsAt: section.endsAt,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

function mapHomeSectionData(data: HomeSectionInput) {
  return {
    type: data.type as HomeSectionType,
    title: data.title,
    subtitle: data.subtitle,
    imageUrl: data.imageUrl,
    buttonText: data.buttonText,
    buttonUrl: data.buttonUrl,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
  };
}

export async function getAdminHomeSectionsList() {
  await requireAdminAccess();
  const sections = await getAdminHomeSections();
  return sections.map(mapHomeSection);
}

export async function getAdminHomeSectionDetail(id: string) {
  await requireAdminAccess();
  const section = await getAdminHomeSectionById(id);
  return section ? mapHomeSection(section) : null;
}

export async function createAdminHomeSection(rawSection: unknown) {
  await requireAdminAccess();
  const section = validateAdminInput(homeSectionInputSchema, rawSection);
  return createHomeSection(mapHomeSectionData(section));
}

export async function updateAdminHomeSection(id: string, rawSection: unknown) {
  await requireAdminAccess();
  const section = validateAdminInput(homeSectionInputSchema, rawSection);
  return updateHomeSection(id, mapHomeSectionData(section));
}

export async function deleteAdminHomeSection(id: string) {
  await requireAdminAccess();
  return deleteHomeSection(id);
}

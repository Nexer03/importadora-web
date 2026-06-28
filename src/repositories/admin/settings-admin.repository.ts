import { prisma } from "@/lib/prisma";

export function getAdminStoreSettings() {
  return prisma.storeSetting.findMany({
    orderBy: {
      key: "asc",
    },
  });
}

export function updateStoreSetting(key: string, value: string) {
  return prisma.storeSetting.update({
    where: { key },
    data: { value },
  });
}

export function createStoreSetting(key: string, value: string) {
  return prisma.storeSetting.create({
    data: {
      key,
      value,
    },
  });
}

export function upsertStoreSetting(key: string, value: string) {
  return prisma.storeSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

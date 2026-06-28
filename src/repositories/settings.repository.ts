import { prisma } from "@/lib/prisma";

export function getStoreSettings() {
  return prisma.storeSetting.findMany({
    orderBy: {
      key: "asc",
    },
  });
}

export function getStoreSettingByKey(key: string) {
  return prisma.storeSetting.findUnique({
    where: {
      key,
    },
  });
}

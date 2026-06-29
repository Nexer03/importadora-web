import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAddressesByUser(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export function getAddressById(userId: string, id: string) {
  return prisma.address.findFirst({ where: { id, userId } });
}

export function getDefaultAddress(userId: string) {
  return prisma.address.findFirst({
    where: { userId, isDefault: true },
    orderBy: { createdAt: "desc" },
  });
}

export function clearDefaultAddresses(userId: string) {
  return prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });
}

export function createAddress(
  userId: string,
  data: Omit<Prisma.AddressCreateInput, "user">
) {
  return prisma.address.create({
    data: { ...data, user: { connect: { id: userId } } },
  });
}

export function updateAddress(id: string, data: Prisma.AddressUpdateInput) {
  return prisma.address.update({ where: { id }, data });
}

export function deleteAddress(id: string) {
  return prisma.address.delete({ where: { id } });
}

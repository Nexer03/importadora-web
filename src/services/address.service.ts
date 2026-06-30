import { auth } from "@/lib/auth";
import {
  clearDefaultAddresses,
  createAddress,
  deleteAddress,
  getAddressById,
  getAddressesByUser,
  getDefaultAddress,
  updateAddress,
} from "@/repositories/address.repository";
import { addressSchema } from "@/validators/address.validator";

export class AddressError extends Error {}

export type AddressDTO = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  reference: string | null;
  isDefault: boolean;
};

type AddressEntity = Awaited<ReturnType<typeof getAddressesByUser>>[number];

function mapAddress(address: AddressEntity): AddressDTO {
  return {
    id: address.id,
    label: address.label,
    fullName: address.fullName,
    phone: address.phone,
    address: address.address,
    postalCode: address.postalCode,
    city: address.city,
    state: address.state,
    reference: address.reference,
    isDefault: address.isDefault,
  };
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new AddressError("Necesitas iniciar sesion.");
  }
  return userId;
}

function parseInput(input: unknown) {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    throw new AddressError(parsed.error.issues[0]?.message ?? "Datos invalidos.");
  }
  return parsed.data;
}

export async function getCustomerAddresses(): Promise<AddressDTO[]> {
  const userId = await requireUserId();
  const addresses = await getAddressesByUser(userId);
  return addresses.map(mapAddress);
}

export async function getCustomerAddress(id: string): Promise<AddressDTO | null> {
  const userId = await requireUserId();
  const address = await getAddressById(userId, id);
  return address ? mapAddress(address) : null;
}

/** Direccion predeterminada para precargar el checkout (o null). */
export async function getDefaultAddressForCheckout(): Promise<AddressDTO | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const address = await getDefaultAddress(userId);
  return address ? mapAddress(address) : null;
}

export async function createCustomerAddress(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const data = parseInput(input);

  if (data.isDefault) {
    await clearDefaultAddresses(userId);
  }

  await createAddress(userId, {
    label: data.label?.trim() ? data.label.trim() : null,
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    postalCode: data.postalCode,
    city: data.city,
    state: data.state,
    reference: data.reference?.trim() ? data.reference.trim() : null,
    isDefault: data.isDefault,
  });
}

export async function updateCustomerAddress(
  id: string,
  input: unknown
): Promise<void> {
  const userId = await requireUserId();
  const existing = await getAddressById(userId, id);
  if (!existing) {
    throw new AddressError("Direccion no encontrada.");
  }
  const data = parseInput(input);

  if (data.isDefault) {
    await clearDefaultAddresses(userId);
  }

  await updateAddress(id, {
    label: data.label?.trim() ? data.label.trim() : null,
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    postalCode: data.postalCode,
    city: data.city,
    state: data.state,
    reference: data.reference?.trim() ? data.reference.trim() : null,
    isDefault: data.isDefault,
  });
}

export async function deleteCustomerAddress(id: string): Promise<void> {
  const userId = await requireUserId();
  const existing = await getAddressById(userId, id);
  if (existing) {
    await deleteAddress(id);
  }
}

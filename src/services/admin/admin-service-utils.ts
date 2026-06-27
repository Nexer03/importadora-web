import { z } from "zod";

export class AdminServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminServiceError";
  }
}

export function validateAdminInput<T>(
  schema: z.ZodType<T>,
  input: unknown
): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Datos invalidos para el panel admin.";
    throw new AdminServiceError(message);
  }

  return result.data;
}

export function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getActionErrorMessage(error: unknown) {
  if (error instanceof AdminServiceError) {
    return error.message;
  }

  if (error instanceof Error && error.message.includes("Unique constraint")) {
    return "Ya existe un registro con esos datos unicos.";
  }

  return "No se pudo completar la accion.";
}

export function decimalToNumber(value: { toString(): string }) {
  return Number(value.toString());
}

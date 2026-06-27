import { z } from "zod";

export const requiredStringSchema = z.string().trim().min(1, "Campo requerido");

export const optionalTextSchema = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().nullable().optional()
  )
  .transform((value) => value ?? null);

export const optionalUrlSchema = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().url("URL invalida").nullable().optional()
  )
  .transform((value) => value ?? null);

export const booleanSchema = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "on" || value === "true" || value === "1";
}, z.boolean());

export const nonNegativeNumberSchema = z.coerce
  .number()
  .min(0, "Debe ser mayor o igual a 0");

export const positiveNumberSchema = z.coerce
  .number()
  .positive("Debe ser mayor a 0");

export const optionalPositiveNumberSchema = z
  .preprocess(
    (value) =>
      value === undefined || value === null || value === "" ? null : value,
    z.coerce.number().positive("Debe ser mayor a 0").nullable().optional()
  )
  .transform((value) => value ?? null);

export const integerSchema = z.coerce.number().int();

export const optionalDateSchema = z
  .preprocess(
    (value) =>
      value === undefined || value === null || value === "" ? null : value,
    z.coerce.date().nullable().optional()
  )
  .transform((value) => value ?? null);

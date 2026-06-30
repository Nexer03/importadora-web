import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/**
 * Carpeta local donde se guardan las imagenes subidas. Al estar bajo /public,
 * Next las sirve directamente (en Hostinger es una carpeta del proyecto).
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

/**
 * Convierte una imagen a WebP (optimizada y redimensionada) y la guarda en la
 * carpeta local de productos. Devuelve la ruta publica (p.ej. /uploads/...).
 */
export async function saveProductImageWebp(input: Buffer): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const webp = await sharp(input)
    .rotate() // respeta orientacion EXIF
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(UPLOAD_DIR, filename), webp);

  return `/uploads/products/${filename}`;
}

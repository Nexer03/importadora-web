import { getStoreSettings } from "@/repositories/settings.repository";
import type { DeliveryMethodDTO, ShippingOption } from "@/types/order";

const DEFAULT_NATIONAL_COST = 129;
const DEFAULT_LOCAL_DELIVERY_COST = 80;

function parseMoneySetting(
  settings: Record<string, string>,
  key: string,
  fallback: number
): number {
  const raw = settings[key];
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parseOptionalThreshold(
  settings: Record<string, string>,
  key: string
): number | null {
  const raw = settings[key];
  if (raw === undefined || raw.trim() === "") {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

async function getSettingsRecord(): Promise<Record<string, string>> {
  const settings = await getStoreSettings();
  return settings.reduce<Record<string, string>>((record, setting) => {
    record[setting.key] = setting.value;
    return record;
  }, {});
}

/**
 * Calcula el costo de envio para un metodo y subtotal. La logica vive en
 * backend; el frontend nunca define el costo. Los costos y umbrales de envio
 * gratis se leen de store_settings (editables desde admin).
 */
export async function calculateShippingCost(
  method: DeliveryMethodDTO,
  subtotal: number
): Promise<number> {
  if (method === "LOCAL_PICKUP") {
    return 0;
  }

  const settings = await getSettingsRecord();

  if (method === "NATIONAL_SHIPPING") {
    const cost = parseMoneySetting(
      settings,
      "national_shipping_cost",
      DEFAULT_NATIONAL_COST
    );
    const freeMin = parseOptionalThreshold(settings, "national_free_shipping_min");
    if (freeMin !== null && subtotal >= freeMin) {
      return 0;
    }
    return cost;
  }

  // LOCAL_DELIVERY
  const cost = parseMoneySetting(
    settings,
    "local_delivery_cost",
    DEFAULT_LOCAL_DELIVERY_COST
  );
  const freeMin = parseOptionalThreshold(settings, "local_free_delivery_min");
  if (freeMin !== null && subtotal >= freeMin) {
    return 0;
  }
  return cost;
}

/**
 * Opciones de entrega para mostrar en el checkout (costos calculados en
 * backend). Tambien reutilizable por la futura app movil.
 */
export async function getShippingOptions(
  subtotal: number
): Promise<ShippingOption[]> {
  const [national, local] = await Promise.all([
    calculateShippingCost("NATIONAL_SHIPPING", subtotal),
    calculateShippingCost("LOCAL_DELIVERY", subtotal),
  ]);

  return [
    {
      method: "NATIONAL_SHIPPING",
      label: "Envio nacional",
      description: "Entrega por paqueteria a tu domicilio.",
      cost: national,
    },
    {
      method: "LOCAL_DELIVERY",
      label: "Entrega local",
      description: "Entrega en zonas cercanas definidas por la tienda.",
      cost: local,
    },
    {
      method: "LOCAL_PICKUP",
      label: "Recoleccion local",
      description: "Recoge tu pedido sin costo de envio.",
      cost: 0,
    },
  ];
}

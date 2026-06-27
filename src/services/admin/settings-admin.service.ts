import {
  createStoreSetting,
  getAdminStoreSettings,
  updateStoreSetting,
  upsertStoreSetting,
} from "@/repositories/admin/settings-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";
import { storeSettingInputSchema } from "@/validators/admin/store-setting.validator";

import { validateAdminInput } from "./admin-service-utils";

export type AdminStoreSettingDTO = {
  key: string;
  value: string;
  exists: boolean;
};

const COMMON_SETTING_KEYS = [
  "store_name",
  "free_shipping_min_amount",
  "national_shipping_cost",
  "local_delivery_cost",
  "announcement_bar",
];

export async function getAdminStoreSettingsList() {
  await requireAdminAccess();
  const settings = await getAdminStoreSettings();
  const settingsMap = new Map(
    settings.map((setting) => [setting.key, setting.value])
  );
  const keys = Array.from(
    new Set([...COMMON_SETTING_KEYS, ...settings.map((setting) => setting.key)])
  ).sort();

  return keys.map<AdminStoreSettingDTO>((key) => ({
    key,
    value: settingsMap.get(key) ?? "",
    exists: settingsMap.has(key),
  }));
}

export async function createAdminStoreSetting(rawSetting: unknown) {
  await requireAdminAccess();
  const setting = validateAdminInput(storeSettingInputSchema, rawSetting);
  return createStoreSetting(setting.key, setting.value);
}

export async function updateAdminStoreSetting(rawSetting: unknown) {
  await requireAdminAccess();
  const setting = validateAdminInput(storeSettingInputSchema, rawSetting);
  return updateStoreSetting(setting.key, setting.value);
}

export async function upsertAdminStoreSetting(rawSetting: unknown) {
  await requireAdminAccess();
  const setting = validateAdminInput(storeSettingInputSchema, rawSetting);
  return upsertStoreSetting(setting.key, setting.value);
}

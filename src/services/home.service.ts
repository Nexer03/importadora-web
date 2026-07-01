import { getActiveHomeSections } from "@/repositories/home.repository";
import { getStoreSettings } from "@/repositories/settings.repository";
import type { HomePageData } from "@/types/catalog";

import {
  getCatalogHomeData,
  settingsToRecord,
  toHomeSectionDTO,
  toStoreSettingDTO,
} from "./catalog.service";

export async function getPublicLayoutData() {
  try {
    const settings = await getStoreSettings();
    return {
      settings: settingsToRecord(settings.map(toStoreSettingDTO)),
    };
  } catch {
    // Si la BD no esta disponible (p.ej. durante el build en el host), se usan
    // valores por defecto para no romper el render del layout.
    return { settings: {} as Record<string, string> };
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const [catalog, sections, settings] = await Promise.all([
    getCatalogHomeData(),
    getActiveHomeSections(),
    getStoreSettings(),
  ]);

  return {
    ...catalog,
    sections: sections.map(toHomeSectionDTO),
    settings: settingsToRecord(settings.map(toStoreSettingDTO)),
  };
}

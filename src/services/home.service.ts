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
  const settings = await getStoreSettings();

  return {
    settings: settingsToRecord(settings.map(toStoreSettingDTO)),
  };
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

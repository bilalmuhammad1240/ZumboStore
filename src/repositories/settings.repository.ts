import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type {
  Setting, SettingKey, Company, UpdateCompanyInput,
  SeoSettings, UpdateSeoInput,
} from "@/types/settings.types";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export const settingsRepository = {
  async getAll(): Promise<Setting[]> {
    const db = await serverDB();
    const { data, error } = await db.from("settings").select("*").order("key");
    if (error) { logger.error("settingsRepository.getAll", { error: error.message }); return []; }
    return (data ?? []) as Setting[];
  },

  async get<T = unknown>(key: SettingKey): Promise<T | null> {
    const db = await serverDB();
    const { data, error } = await db.from("settings").select("value").eq("key", key).single();
    if (error) { logger.warn("settingsRepository.get: chave não encontrada", { key }); return null; }
    return data.value as T;
  },

  async set(key: SettingKey, value: unknown): Promise<boolean> {
    const { error } = await adminDB()
      .from("settings")
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) { logger.error("settingsRepository.set", { key, error: error.message }); return false; }
    logger.info("settingsRepository.set", { key });
    return true;
  },
};

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------
export const companyRepository = {
  async get(): Promise<Company | null> {
    const db = await serverDB();
    const { data, error } = await db.from("company").select("*").limit(1).single();
    if (error) { logger.error("companyRepository.get", { error: error.message }); return null; }
    return data as Company;
  },

  async update(input: Partial<UpdateCompanyInput>): Promise<Company | null> {
    const { data: existing } = await adminDB().from("company").select("id").limit(1).single();
    if (!existing) { logger.error("companyRepository.update: linha não encontrada"); return null; }
    const { data, error } = await adminDB()
      .from("company")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", existing.id).select().single();
    if (error) { logger.error("companyRepository.update", { error: error.message }); return null; }
    return data as Company;
  },
};

// ---------------------------------------------------------------------------
// SEO Settings
// ---------------------------------------------------------------------------
export const seoRepository = {
  async get(): Promise<SeoSettings | null> {
    const db = await serverDB();
    const { data, error } = await db.from("seo_settings").select("*").limit(1).single();
    if (error) { logger.error("seoRepository.get", { error: error.message }); return null; }
    return data as SeoSettings;
  },

  async update(input: Partial<UpdateSeoInput>): Promise<SeoSettings | null> {
    const { data: existing } = await adminDB().from("seo_settings").select("id").limit(1).single();
    if (!existing) { logger.error("seoRepository.update: linha não encontrada"); return null; }
    const { data, error } = await adminDB()
      .from("seo_settings")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", existing.id).select().single();
    if (error) { logger.error("seoRepository.update", { error: error.message }); return null; }
    return data as SeoSettings;
  },
};

import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type { Banner, BannerPosition } from "@/types/cart.types";

export const bannerRepository = {

  async findByPosition(position: BannerPosition): Promise<Banner[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("banners")
      .select("*")
      .eq("position", position)
      .eq("is_active", true)
      .order("sort_order");
    if (error) { logger.error("bannerRepository.findByPosition", { position, error: error.message }); return []; }
    return (data ?? []) as Banner[];
  },

  async findAll(): Promise<Banner[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("banners")
      .select("*")
      .order("position")
      .order("sort_order");
    if (error) { logger.error("bannerRepository.findAll", { error: error.message }); return []; }
    return (data ?? []) as Banner[];
  },

  async create(input: Omit<Banner, "id" | "created_at" | "updated_at">): Promise<Banner | null> {
    const { data, error } = await adminDB().from("banners").insert(input).select().single();
    if (error) { logger.error("bannerRepository.create", { error: error.message }); return null; }
    return data as Banner;
  },

  async update(id: string, input: Partial<Banner>): Promise<Banner | null> {
    const { data, error } = await adminDB()
      .from("banners")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) { logger.error("bannerRepository.update", { id, error: error.message }); return null; }
    return data as Banner;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await adminDB().from("banners").delete().eq("id", id);
    if (error) { logger.error("bannerRepository.delete", { id, error: error.message }); return false; }
    return true;
  },
};

import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type {
  Category, CreateCategoryInput, UpdateCategoryInput,
  Brand, CreateBrandInput, UpdateBrandInput,
  Attribute,
} from "@/types/catalog.types";

// =============================================================================
// Category Repository
// =============================================================================

export const categoryRepository = {

  /** Lista todas as categorias (admin — inclui inactivas). */
  async findAll(): Promise<Category[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("categories")
      .select("*, parent:categories!parent_id(id,name,slug)")
      .order("sort_order", { ascending: true });
    if (error) { logger.error("categoryRepository.findAll", { error: error.message }); return []; }
    return (data ?? []) as unknown as Category[];
  },

  /** Lista categorias activas para a loja pública. */
  async findActive(parentId?: string | null): Promise<Category[]> {
    const db = await serverDB();
    let query = db
      .from("categories")
      .select("id,name,slug,icon,image_url,sort_order,parent_id")
      .eq("is_active", true)
      .order("sort_order");

    if (parentId === null) {
      query = query.is("parent_id", null);
    } else if (parentId) {
      query = query.eq("parent_id", parentId);
    }

    const { data, error } = await query;
    if (error) { logger.error("categoryRepository.findActive", { error: error.message }); return []; }
    return (data ?? []) as Category[];
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const db = await serverDB();
    const { data, error } = await db
      .from("categories")
      .select("*, parent:categories!parent_id(id,name,slug), children:categories(id,name,slug,sort_order)")
      .eq("slug", slug)
      .single();
    if (error) { logger.warn("categoryRepository.findBySlug: não encontrada", { slug }); return null; }
    return data as unknown as Category;
  },

  async findById(id: string): Promise<Category | null> {
    const db = await serverDB();
    const { data, error } = await db.from("categories").select("*").eq("id", id).single();
    if (error) { logger.warn("categoryRepository.findById: não encontrada", { id }); return null; }
    return data as Category;
  },

  async create(input: CreateCategoryInput): Promise<Category | null> {
    const { data, error } = await adminDB()
      .from("categories")
      .insert(input)
      .select()
      .single();
    if (error) { logger.error("categoryRepository.create", { error: error.message, input }); return null; }
    logger.info("categoryRepository.create", { id: data.id, name: input.name });
    return data as Category;
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const { data, error } = await adminDB()
      .from("categories")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) { logger.error("categoryRepository.update", { id, error: error.message }); return null; }
    return data as Category;
  },

  async softDelete(id: string): Promise<boolean> {
    const { error } = await adminDB()
      .from("categories")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { logger.error("categoryRepository.softDelete", { id, error: error.message }); return false; }
    logger.info("categoryRepository.softDelete", { id });
    return true;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const db = await serverDB();
    let query = db.from("categories").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.limit(1);
    return (data?.length ?? 0) > 0;
  },
};

// =============================================================================
// Brand Repository
// =============================================================================

export const brandRepository = {

  async findAll(): Promise<Brand[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) { logger.error("brandRepository.findAll", { error: error.message }); return []; }
    return (data ?? []) as Brand[];
  },

  async findActive(): Promise<Brand[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("brands")
      .select("id,name,slug,logo_url,sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (error) { logger.error("brandRepository.findActive", { error: error.message }); return []; }
    return (data ?? []) as Brand[];
  },

  async findBySlug(slug: string): Promise<Brand | null> {
    const db = await serverDB();
    const { data, error } = await db.from("brands").select("*").eq("slug", slug).single();
    if (error) { logger.warn("brandRepository.findBySlug: não encontrada", { slug }); return null; }
    return data as Brand;
  },

  async findById(id: string): Promise<Brand | null> {
    const db = await serverDB();
    const { data, error } = await db.from("brands").select("*").eq("id", id).single();
    if (error) { logger.warn("brandRepository.findById", { id }); return null; }
    return data as Brand;
  },

  async create(input: CreateBrandInput): Promise<Brand | null> {
    const { data, error } = await adminDB()
      .from("brands")
      .insert(input)
      .select()
      .single();
    if (error) { logger.error("brandRepository.create", { error: error.message }); return null; }
    logger.info("brandRepository.create", { id: data.id, name: input.name });
    return data as Brand;
  },

  async update(id: string, input: UpdateBrandInput): Promise<Brand | null> {
    const { data, error } = await adminDB()
      .from("brands")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) { logger.error("brandRepository.update", { id, error: error.message }); return null; }
    return data as Brand;
  },

  async softDelete(id: string): Promise<boolean> {
    const { error } = await adminDB()
      .from("brands")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { logger.error("brandRepository.softDelete", { id, error: error.message }); return false; }
    return true;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const db = await serverDB();
    let query = db.from("brands").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.limit(1);
    return (data?.length ?? 0) > 0;
  },
};

// =============================================================================
// Attribute Repository
// =============================================================================

export const attributeRepository = {
  async findAll(): Promise<Attribute[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("attributes")
      .select("*, values:attribute_values(id,value,color_hex,sort_order)")
      .order("name");
    if (error) { logger.error("attributeRepository.findAll", { error: error.message }); return []; }
    return (data ?? []) as unknown as Attribute[];
  },
};

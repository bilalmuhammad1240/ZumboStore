import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import { sanitizeSearchTerm } from "@/lib/utils/helpers";
import type {
  Product, ProductWithRelations, ProductImage,
  ProductVariant, CreateProductInput, UpdateProductInput,
  ProductFilters, PaginatedProducts,
} from "@/types/product.types";

const PRODUCT_FULL_SELECT = `
  *,
  category:categories(id,name,slug),
  brand:brands(id,name,logo_url),
  images:product_images(id,url,alt_text,sort_order,is_primary),
  variants:product_variants(id,sku,name,price,sale_price,stock,image_url,is_active),
  specifications:product_specifications(id,group_name,spec_key,spec_value,sort_order)
`;

export const productRepository = {

  async findMany(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const db       = await serverDB();
    const page     = Math.max(1, filters.page  ?? 1);
    const limit    = Math.min(100, filters.limit ?? 20);
    const offset   = (page - 1) * limit;

    let query = db.from("products").select(
      "id,name,slug,sku,price,sale_price,status,is_featured,is_new,avg_rating,total_reviews,views_count,created_at," +
      "category:categories(id,name,slug)," +
      "brand:brands(id,name,logo_url)," +
      "images:product_images(url,is_primary)",
      { count: "exact" }
    );

    // Filtros
    if (filters.status)      query = query.eq("status", filters.status);
    if (filters.category_id) query = query.eq("category_id", filters.category_id);
    if (filters.brand_id)    query = query.eq("brand_id", filters.brand_id);
    if (filters.is_featured) query = query.eq("is_featured", true);
    if (filters.is_new)      query = query.eq("is_new", true);
    if (filters.min_price)   query = query.gte("price", filters.min_price);
    if (filters.max_price)   query = query.lte("price", filters.max_price);
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search);
      query = query.textSearch("name", term, { type: "websearch", config: "portuguese" });
    }

    // Ordenação
    switch (filters.sort) {
      case "price_asc":  query = query.order("price",        { ascending: true  }); break;
      case "price_desc": query = query.order("price",        { ascending: false }); break;
      case "popular":    query = query.order("total_sold",   { ascending: false }); break;
      case "name_asc":   query = query.order("name",         { ascending: true  }); break;
      default:           query = query.order("created_at",   { ascending: false }); break;
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      logger.error("productRepository.findMany", { error: error.message, filters });
      return { data: [], total: 0, page, limit, pages: 0 };
    }

    const total = count ?? 0;
    return {
      data:  (data ?? []) as unknown as Product[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  },

  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    const db = await serverDB();
    const { data, error } = await db
      .from("products")
      .select(PRODUCT_FULL_SELECT)
      .eq("slug", slug)
      .single();

    if (error) {
      logger.warn("productRepository.findBySlug: não encontrado", { slug });
      return null;
    }
    return data as unknown as ProductWithRelations;
  },

  async findById(id: string): Promise<ProductWithRelations | null> {
    const db = await serverDB();
    const { data, error } = await db
      .from("products")
      .select(PRODUCT_FULL_SELECT)
      .eq("id", id)
      .single();
    if (error) { logger.warn("productRepository.findById", { id }); return null; }
    return data as unknown as ProductWithRelations;
  },

  async create(input: CreateProductInput): Promise<Product | null> {
    const { data, error } = await adminDB()
      .from("products")
      .insert(input)
      .select()
      .single();
    if (error) { logger.error("productRepository.create", { error: error.message }); return null; }
    logger.info("productRepository.create", { id: data.id, name: input.name });
    return data as Product;
  },

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const { data, error } = await adminDB()
      .from("products")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) { logger.error("productRepository.update", { id, error: error.message }); return null; }
    return data as Product;
  },

  async softDelete(id: string): Promise<boolean> {
    const { error } = await adminDB()
      .from("products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { logger.error("productRepository.softDelete", { id, error: error.message }); return false; }
    return true;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const db = await serverDB();
    let query = db.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.limit(1);
    return (data?.length ?? 0) > 0;
  },

  async skuExists(sku: string, excludeId?: string): Promise<boolean> {
    const db = await serverDB();
    let query = db.from("products").select("id").eq("sku", sku);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.limit(1);
    return (data?.length ?? 0) > 0;
  },

  // -------------------------------------------------------------------------
  // Imagens
  // -------------------------------------------------------------------------

  async addImage(input: Omit<ProductImage, "id" | "created_at">): Promise<ProductImage | null> {
    const { data, error } = await adminDB()
      .from("product_images")
      .insert(input)
      .select()
      .single();
    if (error) { logger.error("productRepository.addImage", { error: error.message }); return null; }
    return data as ProductImage;
  },

  async deleteImage(imageId: string): Promise<boolean> {
    const { error } = await adminDB().from("product_images").delete().eq("id", imageId);
    if (error) { logger.error("productRepository.deleteImage", { imageId, error: error.message }); return false; }
    return true;
  },

  async setPrimaryImage(productId: string, imageId: string): Promise<boolean> {
    // Remove primary flag de todas as imagens do produto
    await adminDB().from("product_images").update({ is_primary: false }).eq("product_id", productId);
    const { error } = await adminDB().from("product_images").update({ is_primary: true }).eq("id", imageId);
    if (error) { logger.error("productRepository.setPrimaryImage", { imageId, error: error.message }); return false; }
    return true;
  },

  // -------------------------------------------------------------------------
  // Variantes
  // -------------------------------------------------------------------------

  async addVariant(input: Omit<ProductVariant, "id" | "created_at" | "updated_at" | "attribute_values">): Promise<ProductVariant | null> {
    const { data, error } = await adminDB()
      .from("product_variants")
      .insert(input)
      .select()
      .single();
    if (error) { logger.error("productRepository.addVariant", { error: error.message }); return null; }
    return data as ProductVariant;
  },

  async updateVariant(variantId: string, input: Partial<ProductVariant>): Promise<ProductVariant | null> {
    const { data, error } = await adminDB()
      .from("product_variants")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", variantId)
      .select()
      .single();
    if (error) { logger.error("productRepository.updateVariant", { variantId, error: error.message }); return null; }
    return data as ProductVariant;
  },

  async deleteVariant(variantId: string): Promise<boolean> {
    const { error } = await adminDB().from("product_variants").delete().eq("id", variantId);
    if (error) { logger.error("productRepository.deleteVariant", { variantId, error: error.message }); return false; }
    return true;
  },

  // -------------------------------------------------------------------------
  // Destaques / Público
  // -------------------------------------------------------------------------

  async findFeatured(limit = 8): Promise<Product[]> {
    const db = await serverDB();
    const { data } = await db
      .from("products")
      .select("id,name,slug,price,sale_price,avg_rating,images:product_images(url,is_primary)")
      .eq("status", "active")
      .eq("is_featured", true)
      .order("total_sold", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as Product[];
  },

  async findNew(limit = 8): Promise<Product[]> {
    const db = await serverDB();
    const { data } = await db
      .from("products")
      .select("id,name,slug,price,sale_price,avg_rating,images:product_images(url,is_primary)")
      .eq("status", "active")
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as Product[];
  },

  async findBestSellers(limit = 8): Promise<Product[]> {
    const db = await serverDB();
    const { data } = await db
      .from("products")
      .select("id,name,slug,price,sale_price,avg_rating,total_sold,images:product_images(url,is_primary)")
      .eq("status", "active")
      .order("total_sold", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as Product[];
  },
};

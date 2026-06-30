import { productRepository } from "@/repositories/product.repository";
import { stockRepository } from "@/repositories/stock.repository";
import { slugify, uniqueSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/utils/logger";
import type {
  Product, ProductWithRelations, CreateProductInput,
  UpdateProductInput, ProductFilters, PaginatedProducts,
} from "@/types/product.types";

export const productService = {

  async getMany(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    return productRepository.findMany(filters);
  },

  async getBySlug(slug: string): Promise<ProductWithRelations | null> {
    const product = await productRepository.findBySlug(slug);
    if (product) {
      // Incrementar views_count (fire-and-forget, não bloqueia o render)
      productRepository
        .update(product.id, { views_count: product.views_count + 1 })
        .catch(() => {});
    }
    return product;
  },

  async getById(id: string): Promise<ProductWithRelations | null> {
    return productRepository.findById(id);
  },

  async create(input: CreateProductInput, userId: string): Promise<Product | null> {
    logger.info("productService.create", { name: input.name, userId });

    // Gerar slug único
    const baseSlug = input.slug || slugify(input.name);
    const all = await productRepository.findMany({ limit: 1000 });
    const existingSlugs = all.data.map((p) => p.slug);
    const finalSlug = uniqueSlug(baseSlug, existingSlugs);

    // Validar SKU único
    if (await productRepository.skuExists(input.sku)) {
      logger.warn("productService.create: SKU já existe", { sku: input.sku });
      return null;
    }

    const product = await productRepository.create({
      ...input,
      slug:   finalSlug,
      status: input.status ?? "draft",
    });

    if (product && !input.has_variants) {
      // Criar entrada de stock inicial (quantidade 0)
      await stockRepository.createMovement({
        product_id:   product.id,
        type:         "inventory",
        quantity:     0,
        reason:       "Stock inicial — produto criado",
        created_by:   userId,
      });
    }

    return product;
  },

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    logger.info("productService.update", { id });

    if (input.slug) {
      const exists = await productRepository.slugExists(input.slug, id);
      if (exists) input.slug = `${input.slug}-${Date.now()}`;
    }

    if (input.sku) {
      const exists = await productRepository.skuExists(input.sku, id);
      if (exists) {
        logger.warn("productService.update: SKU já existe", { sku: input.sku, id });
        delete input.sku; // não actualizar o SKU se já existir noutro produto
      }
    }

    return productRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    logger.info("productService.delete (archive)", { id });
    return productRepository.softDelete(id);
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    return productRepository.findFeatured(limit);
  },

  async getNew(limit = 8): Promise<Product[]> {
    return productRepository.findNew(limit);
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    return productRepository.findBestSellers(limit);
  },
};

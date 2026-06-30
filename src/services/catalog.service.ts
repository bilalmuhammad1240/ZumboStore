import { categoryRepository, brandRepository, attributeRepository } from "@/repositories/catalog.repository";
import { slugify, uniqueSlug } from "@/lib/utils/slug";
import { logger } from "@/lib/utils/logger";
import type {
  Category, CategoryTree, CreateCategoryInput, UpdateCategoryInput,
  Brand, CreateBrandInput, UpdateBrandInput, Attribute,
} from "@/types/catalog.types";

// =============================================================================
// Category Service
// =============================================================================

export const categoryService = {

  async getAll(): Promise<Category[]> {
    return categoryRepository.findAll();
  },

  async getActive(parentId?: string | null): Promise<Category[]> {
    return categoryRepository.findActive(parentId);
  },

  /** Devolve a árvore completa de categorias activas. */
  async getTree(): Promise<CategoryTree[]> {
    const all = await categoryRepository.findActive();
    return buildTree(all);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    return categoryRepository.findBySlug(slug);
  },

  async getById(id: string): Promise<Category | null> {
    return categoryRepository.findById(id);
  },

  async create(input: CreateCategoryInput): Promise<Category | null> {
    logger.info("categoryService.create", { name: input.name });

    // Garantir slug único
    const baseSlug  = input.slug || slugify(input.name);
    const existing  = await categoryRepository.findAll();
    const existingSlugs = existing.map((c) => c.slug);
    const finalSlug = uniqueSlug(baseSlug, existingSlugs);

    return categoryRepository.create({ ...input, slug: finalSlug });
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    logger.info("categoryService.update", { id });

    if (input.slug) {
      const exists = await categoryRepository.slugExists(input.slug, id);
      if (exists) {
        input.slug = `${input.slug}-${Date.now()}`;
      }
    }

    return categoryRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    logger.info("categoryService.delete (soft)", { id });
    return categoryRepository.softDelete(id);
  },
};

// =============================================================================
// Brand Service
// =============================================================================

export const brandService = {

  async getAll(): Promise<Brand[]> {
    return brandRepository.findAll();
  },

  async getActive(): Promise<Brand[]> {
    return brandRepository.findActive();
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    return brandRepository.findBySlug(slug);
  },

  async getById(id: string): Promise<Brand | null> {
    return brandRepository.findById(id);
  },

  async create(input: CreateBrandInput): Promise<Brand | null> {
    logger.info("brandService.create", { name: input.name });
    const baseSlug = input.slug || slugify(input.name);
    const existing = await brandRepository.findAll();
    const finalSlug = uniqueSlug(baseSlug, existing.map((b) => b.slug));
    return brandRepository.create({ ...input, slug: finalSlug });
  },

  async update(id: string, input: UpdateBrandInput): Promise<Brand | null> {
    logger.info("brandService.update", { id });
    if (input.slug) {
      const exists = await brandRepository.slugExists(input.slug, id);
      if (exists) input.slug = `${input.slug}-${Date.now()}`;
    }
    return brandRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    return brandRepository.softDelete(id);
  },
};

// =============================================================================
// Attribute Service
// =============================================================================

export const attributeService = {
  async getAll(): Promise<Attribute[]> {
    return attributeRepository.findAll();
  },
};

// =============================================================================
// Utilitários internos
// =============================================================================

function buildTree(categories: Category[], parentId: string | null = null): CategoryTree[] {
  return categories
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ ...c, children: buildTree(categories, c.id) }));
}

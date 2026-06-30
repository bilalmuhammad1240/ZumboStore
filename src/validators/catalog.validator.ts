import { z } from "zod";

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export const categorySchema = z.object({
  name:             z.string().min(2, "Nome obrigatório (mín. 2 caracteres).").max(100),
  slug:             z.string().max(120).optional(),
  parent_id:        z.string().uuid().optional().nullable(),
  description:      z.string().max(500).optional().nullable(),
  icon:             z.string().max(10).optional().nullable(),
  sort_order:       z.coerce.number().int().min(0).default(0),
  is_active:        z.coerce.boolean().default(true),
  meta_title:       z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
});
export type CategoryFormData = z.infer<typeof categorySchema>;

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export const brandSchema = z.object({
  name:             z.string().min(2, "Nome obrigatório.").max(100),
  slug:             z.string().max(120).optional(),
  description:      z.string().max(500).optional().nullable(),
  website:          z.string().url("URL inválido.").optional().nullable().or(z.literal("")),
  sort_order:       z.coerce.number().int().min(0).default(0),
  is_active:        z.coerce.boolean().default(true),
  meta_title:       z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
});
export type BrandFormData = z.infer<typeof brandSchema>;

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export const productSchema = z.object({
  name:              z.string().min(3, "Nome obrigatório (mín. 3 caracteres).").max(255),
  slug:              z.string().max(255).optional(),
  sku:               z.string().min(2, "SKU obrigatório.").max(100),
  internal_code:     z.string().max(50).optional().nullable(),
  barcode:           z.string().max(50).optional().nullable(),
  category_id:       z.string().uuid().optional().nullable(),
  brand_id:          z.string().uuid().optional().nullable(),
  description:       z.string().optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  price:             z.coerce.number().min(0, "Preço não pode ser negativo."),
  sale_price:        z.coerce.number().min(0).optional().nullable(),
  cost_price:        z.coerce.number().min(0).optional().nullable(),
  weight_kg:         z.coerce.number().min(0).optional().nullable(),
  width_cm:          z.coerce.number().min(0).optional().nullable(),
  height_cm:         z.coerce.number().min(0).optional().nullable(),
  depth_cm:          z.coerce.number().min(0).optional().nullable(),
  status:            z.enum(["draft","active","archived","out_of_stock"]).default("draft"),
  is_featured:       z.coerce.boolean().default(false),
  is_new:            z.coerce.boolean().default(false),
  has_variants:      z.coerce.boolean().default(false),
  warranty_months:   z.coerce.number().int().min(0).default(0),
  meta_title:        z.string().max(70).optional().nullable(),
  meta_description:  z.string().max(160).optional().nullable(),
}).refine(
  (d) => !d.sale_price || d.sale_price < d.price,
  { message: "Preço de promoção deve ser menor que o preço normal.", path: ["sale_price"] }
);
export type ProductFormData = z.infer<typeof productSchema>;

// ---------------------------------------------------------------------------
// Product Variant
// ---------------------------------------------------------------------------
export const productVariantSchema = z.object({
  sku:       z.string().min(2, "SKU da variante obrigatório.").max(100),
  name:      z.string().min(1, "Nome da variante obrigatório.").max(200),
  price:     z.coerce.number().min(0).optional().nullable(),
  sale_price:z.coerce.number().min(0).optional().nullable(),
  stock:     z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;

// ---------------------------------------------------------------------------
// Stock Movement
// ---------------------------------------------------------------------------
export const stockMovementSchema = z.object({
  product_id:         z.string().uuid("Produto obrigatório."),
  product_variant_id: z.string().uuid().optional().nullable(),
  type:               z.enum(["entry","exit","adjustment","loss","inventory","return"],
                        { required_error: "Tipo de movimento obrigatório." }),
  quantity:           z.coerce.number().int().min(1, "Quantidade deve ser pelo menos 1."),
  reason:             z.string().max(300).optional().nullable(),
  reference_id:       z.string().uuid().optional().nullable(),
  reference_type:     z.string().max(50).optional().nullable(),
});
export type StockMovementFormData = z.infer<typeof stockMovementSchema>;

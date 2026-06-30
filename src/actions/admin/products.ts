"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { productService } from "@/services/product.service";
import { productSchema, productVariantSchema } from "@/validators/catalog.validator";
import { logger } from "@/lib/utils/logger";

type ActionResult =
  | { success: true; message: string; id?: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// CREATE PRODUCT
// ---------------------------------------------------------------------------
export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { user } = await requireAdmin();

  const raw = {
    name:              formData.get("name"),
    sku:               formData.get("sku"),
    internal_code:     formData.get("internal_code") || null,
    barcode:           formData.get("barcode") || null,
    category_id:       formData.get("category_id") || null,
    brand_id:          formData.get("brand_id") || null,
    description:       formData.get("description") || null,
    short_description: formData.get("short_description") || null,
    price:             formData.get("price"),
    sale_price:        formData.get("sale_price") || null,
    cost_price:        formData.get("cost_price") || null,
    weight_kg:         formData.get("weight_kg") || null,
    width_cm:          formData.get("width_cm") || null,
    height_cm:         formData.get("height_cm") || null,
    depth_cm:          formData.get("depth_cm") || null,
    status:            formData.get("status") ?? "draft",
    is_featured:       formData.get("is_featured") === "on",
    is_new:            formData.get("is_new") === "on",
    has_variants:      formData.get("has_variants") === "on",
    warranty_months:   formData.get("warranty_months") ?? 0,
    meta_title:        formData.get("meta_title") || null,
    meta_description:  formData.get("meta_description") || null,
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados do produto inválidos." };
  }

  const result = await productService.create(parsed.data, user.id);
  if (!result) {
    return { success: false, error: "Erro ao criar produto. O SKU pode já existir." };
  }

  logger.info("createProductAction: sucesso", { id: result.id, name: result.name });
  revalidatePath("/admin/produtos");
  return { success: true, message: "Produto criado com sucesso.", id: result.id };
}

// ---------------------------------------------------------------------------
// UPDATE PRODUCT
// ---------------------------------------------------------------------------
export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name:              formData.get("name"),
    sku:               formData.get("sku"),
    internal_code:     formData.get("internal_code") || null,
    barcode:           formData.get("barcode") || null,
    category_id:       formData.get("category_id") || null,
    brand_id:          formData.get("brand_id") || null,
    description:       formData.get("description") || null,
    short_description: formData.get("short_description") || null,
    price:             formData.get("price"),
    sale_price:        formData.get("sale_price") || null,
    cost_price:        formData.get("cost_price") || null,
    weight_kg:         formData.get("weight_kg") || null,
    width_cm:          formData.get("width_cm") || null,
    height_cm:         formData.get("height_cm") || null,
    depth_cm:          formData.get("depth_cm") || null,
    status:            formData.get("status") ?? "draft",
    is_featured:       formData.get("is_featured") === "on",
    is_new:            formData.get("is_new") === "on",
    has_variants:      formData.get("has_variants") === "on",
    warranty_months:   formData.get("warranty_months") ?? 0,
    meta_title:        formData.get("meta_title") || null,
    meta_description:  formData.get("meta_description") || null,
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await productService.update(id, parsed.data);
  if (!result) return { success: false, error: "Erro ao actualizar produto." };

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath(`/produto/${result.slug}`);
  return { success: true, message: "Produto actualizado." };
}

// ---------------------------------------------------------------------------
// DELETE PRODUCT (archive)
// ---------------------------------------------------------------------------
export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const ok = await productService.delete(id);
  if (!ok) return { success: false, error: "Erro ao arquivar produto." };

  revalidatePath("/admin/produtos");
  return { success: true, message: "Produto arquivado." };
}

// ---------------------------------------------------------------------------
// CHANGE STATUS
// ---------------------------------------------------------------------------
export async function updateProductStatusAction(
  id: string,
  status: "draft" | "active" | "archived" | "out_of_stock"
): Promise<ActionResult> {
  await requireAdmin();

  const result = await productService.update(id, { status });
  if (!result) return { success: false, error: "Erro ao actualizar estado do produto." };

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  return { success: true, message: `Produto ${STATUS_LABELS[status]}.` };
}

const STATUS_LABELS: Record<string, string> = {
  draft:         "movido para rascunho",
  active:        "publicado",
  archived:      "arquivado",
  out_of_stock:  "marcado como esgotado",
};

// ---------------------------------------------------------------------------
// ADD VARIANT
// ---------------------------------------------------------------------------
export async function addVariantAction(
  productId: string,
  formData:  FormData
): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    sku:        formData.get("sku"),
    name:       formData.get("name"),
    price:      formData.get("price") || null,
    sale_price: formData.get("sale_price") || null,
    stock:      formData.get("stock") ?? 0,
    is_active:  formData.get("is_active") !== "false",
  };

  const parsed = productVariantSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados da variante inválidos." };
  }

  const { productRepository } = await import("@/repositories/product.repository");
  const result = await productRepository.addVariant({ ...parsed.data, product_id: productId, image_url: null });
  if (!result) return { success: false, error: "Erro ao adicionar variante. O SKU pode já existir." };

  revalidatePath(`/admin/produtos/${productId}`);
  return { success: true, message: "Variante adicionada.", id: result.id };
}

// ---------------------------------------------------------------------------
// DELETE VARIANT
// ---------------------------------------------------------------------------
export async function deleteVariantAction(productId: string, variantId: string): Promise<ActionResult> {
  await requireAdmin();

  const { productRepository } = await import("@/repositories/product.repository");
  const ok = await productRepository.deleteVariant(variantId);
  if (!ok) return { success: false, error: "Erro ao eliminar variante." };

  revalidatePath(`/admin/produtos/${productId}`);
  return { success: true, message: "Variante eliminada." };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { categoryService, brandService } from "@/services/catalog.service";
import { categorySchema, brandSchema } from "@/validators/catalog.validator";
import { logger } from "@/lib/utils/logger";

type ActionResult =
  | { success: true; message: string; id?: string }
  | { success: false; error: string };

// =============================================================================
// CATEGORIES
// =============================================================================

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name:             formData.get("name"),
    slug:             formData.get("slug") || undefined,
    parent_id:        formData.get("parent_id") || null,
    description:      formData.get("description") || null,
    icon:             formData.get("icon") || null,
    sort_order:       formData.get("sort_order") ?? 0,
    is_active:        formData.get("is_active") !== "false",
    meta_title:       formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await categoryService.create(parsed.data);
  if (!result) return { success: false, error: "Erro ao criar categoria." };

  logger.info("createCategoryAction: sucesso", { id: result.id });
  revalidatePath("/admin/categorias");
  revalidatePath("/", "layout");
  return { success: true, message: "Categoria criada com sucesso.", id: result.id };
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name:             formData.get("name"),
    slug:             formData.get("slug") || undefined,
    parent_id:        formData.get("parent_id") || null,
    description:      formData.get("description") || null,
    icon:             formData.get("icon") || null,
    sort_order:       formData.get("sort_order") ?? 0,
    is_active:        formData.get("is_active") !== "false",
    meta_title:       formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await categoryService.update(id, parsed.data);
  if (!result) return { success: false, error: "Erro ao actualizar categoria." };

  revalidatePath("/admin/categorias");
  revalidatePath(`/admin/categorias/${id}`);
  revalidatePath("/", "layout");
  return { success: true, message: "Categoria actualizada." };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const ok = await categoryService.delete(id);
  if (!ok) return { success: false, error: "Erro ao eliminar categoria." };

  revalidatePath("/admin/categorias");
  revalidatePath("/", "layout");
  return { success: true, message: "Categoria desactivada." };
}

// =============================================================================
// BRANDS
// =============================================================================

export async function createBrandAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name:             formData.get("name"),
    slug:             formData.get("slug") || undefined,
    description:      formData.get("description") || null,
    website:          formData.get("website") || null,
    sort_order:       formData.get("sort_order") ?? 0,
    is_active:        formData.get("is_active") !== "false",
    logo_url:         formData.get("logo_url") || null,
    meta_title:       formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
  };

  const parsed = brandSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await brandService.create(parsed.data);
  if (!result) return { success: false, error: "Erro ao criar marca." };

  logger.info("createBrandAction: sucesso", { id: result.id });
  revalidatePath("/admin/marcas");
  revalidatePath("/", "layout");
  return { success: true, message: "Marca criada com sucesso.", id: result.id };
}

export async function updateBrandAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name:             formData.get("name"),
    slug:             formData.get("slug") || undefined,
    description:      formData.get("description") || null,
    website:          formData.get("website") || null,
    sort_order:       formData.get("sort_order") ?? 0,
    is_active:        formData.get("is_active") !== "false",
    logo_url:         formData.get("logo_url") || null,
    meta_title:       formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
  };

  const parsed = brandSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await brandService.update(id, parsed.data);
  if (!result) return { success: false, error: "Erro ao actualizar marca." };

  revalidatePath("/admin/marcas");
  revalidatePath(`/admin/marcas/${id}`);
  revalidatePath("/", "layout");
  return { success: true, message: "Marca actualizada." };
}

export async function deleteBrandAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const ok = await brandService.delete(id);
  if (!ok) return { success: false, error: "Erro ao eliminar marca." };

  revalidatePath("/admin/marcas");
  return { success: true, message: "Marca desactivada." };
}

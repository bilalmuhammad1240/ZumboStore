"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { supplierService } from "@/services/supplier.service";
import { supplierSchema } from "@/validators/supplier.validator";
import { logger } from "@/lib/utils/logger";

type ActionResult =
  | { success: true; message: string; id?: string }
  | { success: false; error: string };

function parseSupplier(formData: FormData) {
  return {
    name:           formData.get("name"),
    email:          formData.get("email") || null,
    phone:          formData.get("phone") || null,
    whatsapp:       formData.get("whatsapp") || null,
    address:        formData.get("address") || null,
    city:           formData.get("city") || null,
    country:        formData.get("country") || "Moçambique",
    contact_person: formData.get("contact_person") || null,
    payment_terms:  formData.get("payment_terms") || null,
    notes:          formData.get("notes") || null,
    is_active:      formData.get("is_active") !== "false",
  };
}

export async function createSupplierAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = supplierSchema.safeParse(parseSupplier(formData));
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await supplierService.create(parsed.data);
  if (!result) return { success: false, error: "Erro ao criar fornecedor." };

  logger.info("createSupplierAction: sucesso", { id: result.id });
  revalidatePath("/admin/fornecedores");
  return { success: true, message: "Fornecedor criado.", id: result.id };
}

export async function updateSupplierAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = supplierSchema.safeParse(parseSupplier(formData));
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados inválidos." };
  }

  const result = await supplierService.update(id, parsed.data);
  if (!result) return { success: false, error: "Erro ao actualizar fornecedor." };

  revalidatePath("/admin/fornecedores");
  revalidatePath(`/admin/fornecedores/${id}`);
  return { success: true, message: "Fornecedor actualizado." };
}

export async function deleteSupplierAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await supplierService.delete(id);
  if (!ok) return { success: false, error: "Erro ao eliminar fornecedor." };
  revalidatePath("/admin/fornecedores");
  return { success: true, message: "Fornecedor desactivado." };
}

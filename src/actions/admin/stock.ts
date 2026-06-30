"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { stockService } from "@/services/stock.service";
import { stockMovementSchema } from "@/validators/catalog.validator";
import { logger } from "@/lib/utils/logger";

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Registar movimento de stock
// ---------------------------------------------------------------------------
export async function createStockMovementAction(formData: FormData): Promise<ActionResult> {
  const { user } = await requireAdmin();

  const raw = {
    product_id:         formData.get("product_id"),
    product_variant_id: formData.get("product_variant_id") || null,
    type:               formData.get("type"),
    quantity:           formData.get("quantity"),
    reason:             formData.get("reason") || null,
    reference_id:       formData.get("reference_id") || null,
    reference_type:     formData.get("reference_type") || null,
  };

  const parsed = stockMovementSchema.safeParse(raw);
  if (!parsed.success) {
    const err = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: err ?? "Dados do movimento inválidos." };
  }

  const isExit = ["exit", "loss"].includes(parsed.data.type);

  let result;
  if (isExit) {
    result = await stockService.removeStock(
      parsed.data.product_id,
      parsed.data.quantity,
      parsed.data.type as "exit" | "loss" | "adjustment",
      user.id,
      {
        variantId:    parsed.data.product_variant_id ?? undefined,
        reason:       parsed.data.reason ?? undefined,
        referenceId:  parsed.data.reference_id ?? undefined,
        referenceType:parsed.data.reference_type ?? undefined,
      }
    );

    if (!result) {
      return { success: false, error: "Stock insuficiente para esta saída." };
    }
  } else if (parsed.data.type === "inventory") {
    const targetQty = parsed.data.quantity;
    result = await stockService.adjustToQuantity(
      parsed.data.product_id,
      targetQty,
      user.id,
      parsed.data.reason ?? "Ajuste de inventário",
      parsed.data.product_variant_id ?? undefined
    );
  } else {
    result = await stockService.addStock(
      parsed.data.product_id,
      parsed.data.quantity,
      user.id,
      {
        variantId:    parsed.data.product_variant_id ?? undefined,
        reason:       parsed.data.reason ?? undefined,
        referenceId:  parsed.data.reference_id ?? undefined,
        referenceType:parsed.data.reference_type ?? undefined,
      }
    );
  }

  if (!result) {
    return { success: false, error: "Erro ao registar movimento. Verifique os dados." };
  }

  logger.info("createStockMovementAction: sucesso", {
    type:      parsed.data.type,
    productId: parsed.data.product_id,
    qty:       parsed.data.quantity,
    userId:    user.id,
  });

  revalidatePath("/admin/estoque");
  revalidatePath("/admin/estoque/movimentacoes");
  revalidatePath(`/admin/produtos/${parsed.data.product_id}`);

  return { success: true, message: "Movimento registado com sucesso." };
}

// ---------------------------------------------------------------------------
// Actualizar alerta de stock mínimo
// ---------------------------------------------------------------------------
export async function updateMinAlertAction(
  stockId:  string,
  minAlert: number
): Promise<ActionResult> {
  await requireAdmin();

  if (minAlert < 0) return { success: false, error: "O valor mínimo não pode ser negativo." };

  const ok = await stockService.updateMinAlert(stockId, minAlert);
  if (!ok) return { success: false, error: "Erro ao actualizar alerta mínimo." };

  revalidatePath("/admin/estoque");
  return { success: true, message: "Alerta de stock actualizado." };
}

// ---------------------------------------------------------------------------
// Actualizar localização física
// ---------------------------------------------------------------------------
export async function updateStockLocationAction(
  stockId:  string,
  location: string
): Promise<ActionResult> {
  await requireAdmin();

  const ok = await stockService.updateLocation(stockId, location.trim());
  if (!ok) return { success: false, error: "Erro ao actualizar localização." };

  revalidatePath("/admin/estoque");
  return { success: true, message: "Localização actualizada." };
}

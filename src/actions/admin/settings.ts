"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { settingsService } from "@/services/settings.service";
import {
  companySchema,
  seoSchema,
  paymentConfigSchema,
  shippingConfigSchema,
  notificationConfigSchema,
} from "@/validators/settings.validator";
import { logger } from "@/lib/utils/logger";

// Resposta padrão das actions — evita lançar excepções nos Client Components.
type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Empresa
// ---------------------------------------------------------------------------

export async function updateCompanyAction(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = companySchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError ?? "Dados inválidos." };
  }

  const result = await settingsService.updateCompany(parsed.data);

  if (!result) {
    logger.error("updateCompanyAction: falhou ao persistir");
    return { success: false, error: "Erro ao guardar dados da empresa." };
  }

  logger.info("updateCompanyAction: sucesso");
  revalidatePath("/admin/configuracoes/empresa");
  revalidatePath("/", "layout"); // revalida logo/nome no header
  return { success: true, message: "Dados da empresa actualizados." };
}

// ---------------------------------------------------------------------------
// SEO Global
// ---------------------------------------------------------------------------

export async function updateSeoAction(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = seoSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError ?? "Dados SEO inválidos." };
  }

  const result = await settingsService.updateSeo(parsed.data);

  if (!result) {
    return { success: false, error: "Erro ao guardar configurações SEO." };
  }

  revalidatePath("/admin/configuracoes/seo");
  revalidatePath("/", "layout");
  return { success: true, message: "Configurações SEO actualizadas." };
}

// ---------------------------------------------------------------------------
// Pagamentos
// ---------------------------------------------------------------------------

export async function updatePaymentConfigAction(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  // Checkboxes não enviados = false
  const raw = {
    mpesa_enabled:            formData.get("mpesa_enabled") === "on",
    emola_enabled:            formData.get("emola_enabled") === "on",
    bank_transfer_enabled:    formData.get("bank_transfer_enabled") === "on",
    pos_enabled:              formData.get("pos_enabled") === "on",
    cash_on_delivery_enabled: formData.get("cash_on_delivery_enabled") === "on",
  };

  const parsed = paymentConfigSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: "Dados de pagamento inválidos." };
  }

  const ok = await settingsService.updatePaymentConfig(parsed.data);

  if (!ok) {
    return { success: false, error: "Erro ao guardar configurações de pagamento." };
  }

  revalidatePath("/admin/configuracoes/pagamentos");
  return { success: true, message: "Métodos de pagamento actualizados." };
}

// ---------------------------------------------------------------------------
// Entregas
// ---------------------------------------------------------------------------

export async function updateShippingConfigAction(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = shippingConfigSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError ?? "Dados de entrega inválidos." };
  }

  const ok = await settingsService.updateShippingConfig(parsed.data);

  if (!ok) {
    return { success: false, error: "Erro ao guardar configurações de entrega." };
  }

  revalidatePath("/admin/configuracoes/entregas");
  return { success: true, message: "Configurações de entrega actualizadas." };
}

// ---------------------------------------------------------------------------
// Notificações
// ---------------------------------------------------------------------------

export async function updateNotificationConfigAction(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    email_enabled:    formData.get("email_enabled") === "on",
    sms_enabled:      formData.get("sms_enabled") === "on",
    whatsapp_enabled: formData.get("whatsapp_enabled") === "on",
    push_enabled:     formData.get("push_enabled") === "on",
  };

  const parsed = notificationConfigSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: "Dados de notificação inválidos." };
  }

  const ok = await settingsService.updateNotificationConfig(parsed.data);

  if (!ok) {
    return {
      success: false,
      error: "Erro ao guardar configurações de notificação.",
    };
  }

  revalidatePath("/admin/configuracoes/notificacoes");
  return { success: true, message: "Canais de notificação actualizados." };
}

// ---------------------------------------------------------------------------
// Modo de manutenção
// ---------------------------------------------------------------------------

export async function toggleMaintenanceModeAction(
  enabled: boolean
): Promise<ActionResult> {
  await requireAdmin();

  const ok = await settingsService.setMaintenanceMode(enabled);

  if (!ok) {
    return { success: false, error: "Erro ao alterar modo de manutenção." };
  }

  logger.info("toggleMaintenanceModeAction", { enabled });
  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
  return {
    success: true,
    message: enabled ? "Modo de manutenção activado." : "Loja online activada.",
  };
}

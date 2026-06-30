import { z } from "zod";

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

export const companySchema = z.object({
  name:      z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  slogan:    z.string().max(120).optional().nullable(),
  email:     z.string().email("Email inválido.").optional().nullable(),
  phone:     z.string().max(20).optional().nullable(),
  whatsapp:  z.string().max(20).optional().nullable(),
  address:   z.string().max(200).optional().nullable(),
  city:      z.string().max(100).optional().nullable(),
  province:  z.string().optional().nullable(),
  country:   z.string().default("Moçambique"),
  currency:  z.string().default("MZN"),
  timezone:  z.string().default("Africa/Maputo"),
  logo_url:  z.string().url().optional().nullable(),
  favicon_url: z.string().url().optional().nullable(),
});

export type CompanyFormData = z.infer<typeof companySchema>;

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const seoSchema = z.object({
  meta_title: z
    .string()
    .max(70, "Título SEO deve ter no máximo 70 caracteres.")
    .optional()
    .nullable(),
  meta_description: z
    .string()
    .max(160, "Meta descrição deve ter no máximo 160 caracteres.")
    .optional()
    .nullable(),
  og_image_url:     z.string().url("URL inválido.").optional().nullable(),
  google_analytics: z.string().max(50).optional().nullable(),
  facebook_pixel:   z.string().max(30).optional().nullable(),
});

export type SeoFormData = z.infer<typeof seoSchema>;

// ---------------------------------------------------------------------------
// Payment config
// ---------------------------------------------------------------------------

export const paymentConfigSchema = z.object({
  mpesa_enabled:            z.boolean().default(false),
  emola_enabled:            z.boolean().default(false),
  bank_transfer_enabled:    z.boolean().default(true),
  pos_enabled:              z.boolean().default(true),
  cash_on_delivery_enabled: z.boolean().default(true),
});

export type PaymentConfigFormData = z.infer<typeof paymentConfigSchema>;

// ---------------------------------------------------------------------------
// Shipping config
// ---------------------------------------------------------------------------

export const shippingConfigSchema = z.object({
  free_shipping_threshold: z.coerce
    .number()
    .min(0)
    .optional()
    .nullable()
    .transform((v) => (v === 0 ? null : v)),
  default_shipping_cost: z.coerce
    .number()
    .min(0, "Custo de entrega não pode ser negativo.")
    .default(150),
});

export type ShippingConfigFormData = z.infer<typeof shippingConfigSchema>;

// ---------------------------------------------------------------------------
// Notification config
// ---------------------------------------------------------------------------

export const notificationConfigSchema = z.object({
  email_enabled:    z.boolean().default(false),
  sms_enabled:      z.boolean().default(false),
  whatsapp_enabled: z.boolean().default(false),
  push_enabled:     z.boolean().default(false),
});

export type NotificationConfigFormData = z.infer<typeof notificationConfigSchema>;

/**
 * Tipos do Módulo 1 — Configuração Base.
 */

// ---------------------------------------------------------------------------
// Settings (tabela settings — pares chave/valor JSONB)
// ---------------------------------------------------------------------------

export type SettingKey =
  | "currency"
  | "timezone"
  | "language"
  | "email_config"
  | "sms_config"
  | "whatsapp_config"
  | "payment_config"
  | "shipping_config"
  | "maintenance_mode";

export type Setting = {
  id: string;
  key: SettingKey;
  value: unknown;
  description: string | null;
  updated_at: string;
};

// ---------------------------------------------------------------------------
// Company (tabela company)
// ---------------------------------------------------------------------------

export type Company = {
  id: string;
  name: string;
  slogan: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string;
  logo_url: string | null;
  favicon_url: string | null;
  currency: string;
  timezone: string;
  updated_at: string;
};

export type UpdateCompanyInput = Omit<Company, "id" | "updated_at">;

// ---------------------------------------------------------------------------
// SEO Settings (tabela seo_settings)
// ---------------------------------------------------------------------------

export type SeoSettings = {
  id: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  google_analytics: string | null;
  facebook_pixel: string | null;
  updated_at: string;
};

export type UpdateSeoInput = Omit<SeoSettings, "id" | "updated_at">;

// ---------------------------------------------------------------------------
// Typed config values stored in settings table
// ---------------------------------------------------------------------------

export type EmailConfig = {
  provider: "sendgrid" | "smtp" | null;
  from_email: string;
  from_name: string;
  api_key?: string;
};

export type PaymentConfig = {
  mpesa_enabled: boolean;
  emola_enabled: boolean;
  bank_transfer_enabled: boolean;
  pos_enabled: boolean;
  cash_on_delivery_enabled: boolean;
};

export type ShippingConfig = {
  free_shipping_threshold: number | null;
  default_shipping_cost: number;
};

export type NotificationConfig = {
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_enabled: boolean;
};

import {
  settingsRepository,
  companyRepository,
  seoRepository,
} from "@/repositories/settings.repository";
import { logger } from "@/lib/utils/logger";
import type {
  Setting,
  SettingKey,
  Company,
  UpdateCompanyInput,
  SeoSettings,
  UpdateSeoInput,
  PaymentConfig,
  ShippingConfig,
  EmailConfig,
  NotificationConfig,
} from "@/types/settings.types";

/**
 * Serviço de Configurações — Módulo 1.
 *
 * Camada de regras de negócio entre os Server Actions e o Repository.
 * Toda a lógica de validação e defaults vive aqui, não nas actions.
 */
export const settingsService = {
  // -------------------------------------------------------------------------
  // Settings genéricas
  // -------------------------------------------------------------------------

  async getAll(): Promise<Setting[]> {
    return settingsRepository.getAll();
  },

  async get<T = unknown>(key: SettingKey): Promise<T | null> {
    return settingsRepository.get<T>(key);
  },

  async set(key: SettingKey, value: unknown): Promise<boolean> {
    logger.info("settingsService.set", { key });
    return settingsRepository.set(key, value);
  },

  // -------------------------------------------------------------------------
  // Configurações tipadas
  // -------------------------------------------------------------------------

  async getPaymentConfig(): Promise<PaymentConfig> {
    const config = await settingsRepository.get<PaymentConfig>("payment_config");
    return (
      config ?? {
        mpesa_enabled: false,
        emola_enabled: false,
        bank_transfer_enabled: true,
        pos_enabled: true,
        cash_on_delivery_enabled: true,
      }
    );
  },

  async updatePaymentConfig(config: Partial<PaymentConfig>): Promise<boolean> {
    const current = await this.getPaymentConfig();
    return settingsRepository.set("payment_config", { ...current, ...config });
  },

  async getShippingConfig(): Promise<ShippingConfig> {
    const config = await settingsRepository.get<ShippingConfig>("shipping_config");
    return config ?? { free_shipping_threshold: null, default_shipping_cost: 150 };
  },

  async updateShippingConfig(config: Partial<ShippingConfig>): Promise<boolean> {
    const current = await this.getShippingConfig();
    return settingsRepository.set("shipping_config", { ...current, ...config });
  },

  async getEmailConfig(): Promise<EmailConfig> {
    const config = await settingsRepository.get<EmailConfig>("email_config");
    return (
      config ?? {
        provider: null,
        from_email: "noreply@zumbostore.co.mz",
        from_name: "Zumbo Store",
      }
    );
  },

  async updateEmailConfig(config: Partial<EmailConfig>): Promise<boolean> {
    const current = await this.getEmailConfig();
    return settingsRepository.set("email_config", { ...current, ...config });
  },

  async getNotificationConfig(): Promise<NotificationConfig> {
    const config =
      await settingsRepository.get<NotificationConfig>("notification_config");
    return (
      config ?? {
        email_enabled: false,
        sms_enabled: false,
        whatsapp_enabled: false,
        push_enabled: false,
      }
    );
  },

  async updateNotificationConfig(
    config: Partial<NotificationConfig>
  ): Promise<boolean> {
    const current = await this.getNotificationConfig();
    return settingsRepository.set("notification_config", { ...current, ...config });
  },

  async isMaintenanceMode(): Promise<boolean> {
    const val = await settingsRepository.get<boolean>("maintenance_mode");
    return val ?? false;
  },

  async setMaintenanceMode(enabled: boolean): Promise<boolean> {
    return settingsRepository.set("maintenance_mode", enabled);
  },

  // -------------------------------------------------------------------------
  // Company
  // -------------------------------------------------------------------------

  async getCompany(): Promise<Company | null> {
    console.log("[settingsService.getCompany] a carregar dados da empresa...");
    const result = await companyRepository.get();
    console.log("[settingsService.getCompany]", result ? `ok: ${result.name}` : "null — verificar tabela zumbo.company");
    return result;
  },

  async updateCompany(input: Partial<UpdateCompanyInput>): Promise<Company | null> {
    logger.info("settingsService.updateCompany", {
      fields: Object.keys(input),
    });
    return companyRepository.update(input);
  },

  // -------------------------------------------------------------------------
  // SEO
  // -------------------------------------------------------------------------

  async getSeo(): Promise<SeoSettings | null> {
    return seoRepository.get();
  },

  async updateSeo(input: Partial<UpdateSeoInput>): Promise<SeoSettings | null> {
    logger.info("settingsService.updateSeo");

    // Validação de negócio: meta_description não deve exceder 160 chars
    if (input.meta_description && input.meta_description.length > 160) {
      logger.warn("settingsService.updateSeo: meta_description excede 160 chars", {
        length: input.meta_description.length,
      });
      input.meta_description = input.meta_description.slice(0, 160);
    }

    return seoRepository.update(input);
  },
};

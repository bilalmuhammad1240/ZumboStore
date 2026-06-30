import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { updateNotificationConfigAction } from "@/actions/admin/settings";
import { ChevronLeft, Mail, MessageSquare, Bell, Phone } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notificações" };

const CHANNELS = [
  {
    name:        "email_enabled",
    label:       "Email",
    description: "Enviar confirmações de pedido e promoções por email (via SendGrid).",
    icon:        Mail,
    color:       "text-blue-600 bg-blue-50",
  },
  {
    name:        "sms_enabled",
    label:       "SMS",
    description: "Notificações por SMS via Twilio (custo por mensagem).",
    icon:        Phone,
    color:       "text-green-600 bg-green-50",
  },
  {
    name:        "whatsapp_enabled",
    label:       "WhatsApp",
    description: "Mensagens automáticas via WhatsApp Business API.",
    icon:        MessageSquare,
    color:       "text-emerald-600 bg-emerald-50",
  },
  {
    name:        "push_enabled",
    label:       "Push Notifications",
    description: "Notificações push no browser e aplicação móvel (Fase 2).",
    icon:        Bell,
    color:       "text-orange-600 bg-orange-50",
  },
] as const;

export default async function NotificacoesPage() {
  const config = await settingsService.getNotificationConfig();

  return (
    <div>
      <AdminHeader
        title="Canais de Notificação"
        description="Activar os canais pelos quais a Zumbo Store comunica com os clientes."
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/configuracoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Configurações
        </Link>

        <form action={updateNotificationConfigAction} className="space-y-6">
          <section className="rounded-xl border border-border bg-card divide-y divide-border">
            {CHANNELS.map((channel) => {
              const isEnabled =
                config[channel.name as keyof typeof config] === true;

              return (
                <label
                  key={channel.name}
                  className="flex cursor-pointer items-center gap-4 p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className={`rounded-xl p-2.5 ${channel.color}`}>
                    <channel.icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {channel.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {channel.description}
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      name={channel.name}
                      value="on"
                      defaultChecked={isEnabled}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-green-500" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              );
            })}
          </section>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Nota:</strong> Activar um canal
            não é suficiente. Configure as credenciais do serviço nas variáveis
            de ambiente: <code className="font-mono">SENDGRID_API_KEY</code>,{" "}
            <code className="font-mono">TWILIO_ACCOUNT_SID</code>,{" "}
            <code className="font-mono">WHATSAPP_API_TOKEN</code>.
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Guardar Notificações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

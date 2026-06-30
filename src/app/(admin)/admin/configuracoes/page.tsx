import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { toggleMaintenanceModeAction } from "@/actions/admin/settings";
import {
  Building2, Globe, CreditCard, Truck,
  Bell, Shield, ChevronRight, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações" };

const CONFIG_SECTIONS = [
  {
    href: "/admin/configuracoes/empresa",
    icon: Building2,
    title: "Empresa",
    description: "Nome, logótipo, contactos e dados da loja.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/admin/configuracoes/pagamentos",
    icon: CreditCard,
    title: "Pagamentos",
    description: "M-Pesa, e-Mola, transferência e pagamento na entrega.",
    color: "bg-green-50 text-green-600",
  },
  {
    href: "/admin/configuracoes/entregas",
    icon: Truck,
    title: "Entregas",
    description: "Custos, frete grátis e métodos de entrega.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    href: "/admin/configuracoes/seo",
    icon: Globe,
    title: "SEO Global",
    description: "Título, meta descrição e pixels de rastreamento.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    href: "/admin/configuracoes/notificacoes",
    icon: Bell,
    title: "Notificações",
    description: "Email, SMS, WhatsApp e push notifications.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    href: "/admin/utilizadores",
    icon: Shield,
    title: "Utilizadores & Permissões",
    description: "Roles, operadores, gestores e administradores.",
    color: "bg-red-50 text-red-600",
  },
];

export default async function ConfiguracoesPage() {
  const isMaintenanceMode = await settingsService.isMaintenanceMode();

  return (
    <div>
      <AdminHeader
        title="Configurações"
        description="Gerir todas as definições globais da plataforma."
      />

      <div className="p-6 max-w-4xl space-y-8">

        {/* Banner modo manutenção */}
        {isMaintenanceMode && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Modo de Manutenção Activo</p>
              <p className="text-xs mt-0.5">
                A loja está offline para os clientes. Desactive abaixo para voltar ao ar.
              </p>
            </div>
            <form action={toggleMaintenanceModeAction.bind(null, false)}>
              <button
                type="submit"
                className="text-xs font-medium underline hover:no-underline"
              >
                Desactivar
              </button>
            </form>
          </div>
        )}

        {/* Grid de secções */}
        <div>
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Áreas de Configuração
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className={`rounded-lg p-2.5 ${section.color}`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Zona de perigo */}
        <div>
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Zona de Perigo
          </h2>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm text-foreground">
                  Modo de Manutenção
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Coloca a loja offline temporariamente. Os visitantes verão uma
                  página de manutenção.
                </p>
              </div>
              <form
                action={toggleMaintenanceModeAction.bind(null, !isMaintenanceMode)}
              >
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isMaintenanceMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  }`}
                >
                  {isMaintenanceMode ? "Activar Loja" : "Activar Manutenção"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

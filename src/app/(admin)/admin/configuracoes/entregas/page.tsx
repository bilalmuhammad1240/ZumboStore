import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { updateShippingConfigAction } from "@/actions/admin/settings";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configuração de Entregas" };

export default async function EntregasPage() {
  const config = await settingsService.getShippingConfig();

  return (
    <div>
      <AdminHeader
        title="Configuração de Entregas"
        description="Definir custos de entrega e regras de frete grátis."
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/configuracoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Configurações
        </Link>

        <form action={updateShippingConfigAction} className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Custo de Entrega Padrão
            </h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Custo padrão (MT)
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="default_shipping_cost"
                  type="number"
                  min="0"
                  step="10"
                  defaultValue={config.default_shipping_cost}
                  className="w-40 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">MT</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aplicado quando não existe uma zona de entrega específica.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Frete Grátis
            </h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Valor mínimo para frete grátis (MT)
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="free_shipping_threshold"
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={config.free_shipping_threshold ?? ""}
                  placeholder="0"
                  className="w-40 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">MT</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deixar em branco ou 0 para desactivar o frete grátis automático.
              </p>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Guardar Entregas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

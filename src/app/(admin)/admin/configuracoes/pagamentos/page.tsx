import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { updatePaymentConfigAction } from "@/actions/admin/settings";
import { PAYMENT_METHODS } from "@/lib/constants/payment-methods";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configuração de Pagamentos" };

const METHOD_KEY_MAP: Record<string, string> = {
  mpesa:            "mpesa_enabled",
  emola:            "emola_enabled",
  bank_transfer:    "bank_transfer_enabled",
  pos:              "pos_enabled",
  cash_on_delivery: "cash_on_delivery_enabled",
};

export default async function PagamentosPage() {
  const config = await settingsService.getPaymentConfig();

  return (
    <div>
      <AdminHeader
        title="Métodos de Pagamento"
        description="Activar ou desactivar os métodos de pagamento disponíveis na loja."
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/configuracoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Configurações
        </Link>

        <form action={updatePaymentConfigAction}>
          <section className="rounded-xl border border-border bg-card p-6 space-y-1">
            <h2 className="font-heading font-semibold text-sm text-foreground mb-4">
              Métodos Disponíveis
            </h2>

            {PAYMENT_METHODS.map((method) => {
              const fieldName = METHOD_KEY_MAP[method.value];
              const isEnabled =
                config[fieldName as keyof typeof config] === true;

              return (
                <label
                  key={method.value}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {method.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getMethodDescription(method.value)}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="checkbox"
                      name={fieldName}
                      value="on"
                      defaultChecked={isEnabled}
                      className="peer sr-only"
                    />
                    {/* Toggle visual */}
                    <div className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-green-500" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              );
            })}
          </section>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Guardar Métodos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getMethodDescription(value: string): string {
  const map: Record<string, string> = {
    mpesa:            "Pagamento via M-Pesa (API Vodacom)",
    emola:            "Pagamento via e-Mola (API Tmcel)",
    bank_transfer:    "Transferência bancária com comprovativo",
    pos:              "Terminal POS / Cartão de crédito ou débito",
    cash_on_delivery: "Cliente paga ao receber a encomenda",
  };
  return map[value] ?? value;
}

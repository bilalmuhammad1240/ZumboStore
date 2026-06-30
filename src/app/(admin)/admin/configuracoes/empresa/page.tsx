import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { updateCompanyAction } from "@/actions/admin/settings";
import { PROVINCES } from "@/lib/constants/provinces";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dados da Empresa" };

export default async function EmpresaPage() {
  const company = await settingsService.getCompany();

  return (
    <div>
      <AdminHeader
        title="Dados da Empresa"
        description="Informação pública e identidade da Zumbo Store."
      />

      <div className="p-6 max-w-2xl">
        {/* Breadcrumb */}
        <Link
          href="/admin/configuracoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Configurações
        </Link>

        <form action={updateCompanyAction} className="space-y-8">

          {/* Identidade */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Identidade da Marca
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nome da Loja <span className="text-destructive">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={company?.name ?? "Zumbo Store"}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Slogan
                </label>
                <input
                  name="slogan"
                  type="text"
                  defaultValue={company?.slogan ?? ""}
                  placeholder="Compras inteligentes, entregas rápidas."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email de Contacto
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={company?.email ?? ""}
                  placeholder="geral@zumbostore.co.mz"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Telefone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={company?.phone ?? ""}
                  placeholder="+258 84 000 0000"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  WhatsApp
                </label>
                <input
                  name="whatsapp"
                  type="tel"
                  defaultValue={company?.whatsapp ?? ""}
                  placeholder="258840000000"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato internacional sem + (ex: 258841234567)
                </p>
              </div>
            </div>
          </section>

          {/* Localização */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Localização
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Endereço
                </label>
                <input
                  name="address"
                  type="text"
                  defaultValue={company?.address ?? ""}
                  placeholder="Av. 25 de Setembro, 1234"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Cidade
                </label>
                <input
                  name="city"
                  type="text"
                  defaultValue={company?.city ?? ""}
                  placeholder="Maputo"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Província
                </label>
                <select
                  name="province"
                  defaultValue={company?.province ?? ""}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar…</option>
                  {PROVINCES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hidden defaults */}
              <input type="hidden" name="country" value="Moçambique" />
              <input type="hidden" name="currency" value="MZN" />
              <input type="hidden" name="timezone" value="Africa/Maputo" />
              <input
                type="hidden"
                name="logo_url"
                value={company?.logo_url ?? ""}
              />
              <input
                type="hidden"
                name="favicon_url"
                value={company?.favicon_url ?? ""}
              />
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { updateSeoAction } from "@/actions/admin/settings";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SEO Global" };

export default async function SeoPage() {
  const seo = await settingsService.getSeo();

  return (
    <div>
      <AdminHeader
        title="SEO Global"
        description="Optimização para motores de pesquisa e redes sociais."
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/configuracoes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Configurações
        </Link>

        <form action={updateSeoAction} className="space-y-6">

          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Metadados Globais
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Título SEO
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (máx. 70 caracteres)
                  </span>
                </label>
                <input
                  name="meta_title"
                  type="text"
                  defaultValue={seo?.meta_title ?? ""}
                  maxLength={70}
                  placeholder="Zumbo Store — Compras inteligentes, entregas rápidas."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Meta Descrição
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (máx. 160 caracteres)
                  </span>
                </label>
                <textarea
                  name="meta_description"
                  rows={3}
                  defaultValue={seo?.meta_description ?? ""}
                  maxLength={160}
                  placeholder="A principal loja online de Moçambique. Smartphones, Eletrodomésticos, Moda e muito mais."
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Imagem Open Graph (URL)
                </label>
                <input
                  name="og_image_url"
                  type="url"
                  defaultValue={seo?.og_image_url ?? ""}
                  placeholder="https://zumbostore.co.mz/og-image.jpg"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho recomendado: 1200×630px
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Rastreamento & Analytics
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Google Analytics ID
                </label>
                <input
                  name="google_analytics"
                  type="text"
                  defaultValue={seo?.google_analytics ?? ""}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Facebook Pixel ID
                </label>
                <input
                  name="facebook_pixel"
                  type="text"
                  defaultValue={seo?.facebook_pixel ?? ""}
                  placeholder="123456789012345"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Guardar SEO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

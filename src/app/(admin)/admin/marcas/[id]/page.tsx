import { AdminHeader } from "@/components/layout/AdminHeader";
import { brandService } from "@/services/catalog.service";
import { updateBrandAction } from "@/actions/admin/catalog";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const brand = await brandService.getById(id);
  return { title: brand ? `Editar ${brand.name}` : "Marca não encontrada" };
}

export default async function EditarMarcaPage({ params }: Props) {
  const { id } = await params;
  const brand = await brandService.getById(id);
  if (!brand) notFound();

  const updateWithId = updateBrandAction.bind(null, id);

  return (
    <div>
      <AdminHeader title={`Editar: ${brand.name}`} />
      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/marcas"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Marcas
        </Link>

        <form action={updateWithId} className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Informações da Marca</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nome <span className="text-destructive">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={brand.name}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Slug</label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={brand.slug}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                <input
                  name="website"
                  type="url"
                  defaultValue={brand.website ?? ""}
                  placeholder="https://"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={brand.description ?? ""}
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Logo URL (Módulo 5 implementa upload visual) */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">URL do Logo</label>
                <input
                  name="logo_url"
                  type="url"
                  defaultValue={brand.logo_url ?? ""}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload de imagem via Storage será disponível em breve.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ordem</label>
                <input
                  name="sort_order"
                  type="number"
                  min={0}
                  defaultValue={brand.sort_order}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  value="true"
                  defaultChecked={brand.is_active}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                  Marca activa
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading font-semibold text-sm text-foreground">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Título SEO <span className="text-xs text-muted-foreground font-normal">(máx. 70)</span>
              </label>
              <input
                name="meta_title"
                type="text"
                maxLength={70}
                defaultValue={brand.meta_title ?? ""}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Meta Descrição <span className="text-xs text-muted-foreground font-normal">(máx. 160)</span>
              </label>
              <textarea
                name="meta_description"
                rows={2}
                maxLength={160}
                defaultValue={brand.meta_description ?? ""}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/marcas"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

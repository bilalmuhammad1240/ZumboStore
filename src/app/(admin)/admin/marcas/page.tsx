import { AdminHeader } from "@/components/layout/AdminHeader";
import { brandService } from "@/services/catalog.service";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { deleteBrandAction } from "@/actions/admin/catalog";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Marcas" };

export default async function MarcasPage() {
  const brands = await brandService.getAll();

  return (
    <div>
      <AdminHeader title="Marcas" description={`${brands.length} marcas registadas`} />
      <div className="p-6 max-w-5xl">
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/marcas/nova"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nova Marca
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Nenhuma marca encontrada.
            </div>
          ) : (
            brands.map((brand) => (
              <div key={brand.id} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {brand.logo_url ? (
                    <Image src={brand.logo_url} alt={brand.name} width={48} height={48} className="object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">{brand.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{brand.name}</p>
                  <code className="text-xs text-muted-foreground">{brand.slug}</code>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe className="h-3 w-3" /> Site
                    </a>
                  )}
                  <div className="mt-2">
                    <ActiveBadge active={brand.is_active} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/admin/marcas/${brand.id}`}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteBrandAction.bind(null, brand.id)}>
                    <button
                      type="submit"
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

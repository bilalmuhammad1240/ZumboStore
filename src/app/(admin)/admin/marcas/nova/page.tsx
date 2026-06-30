import { AdminHeader } from "@/components/layout/AdminHeader";
import { createBrandAction } from "@/actions/admin/catalog";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova Marca" };

export default function NovaMarcaPage() {
  return (
    <div>
      <AdminHeader title="Nova Marca" />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/marcas" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Marcas
        </Link>

        <form action={createBrandAction} className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Informações da Marca</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome <span className="text-destructive">*</span></label>
                <input name="name" type="text" required placeholder="ex: Samsung" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Slug</label>
                <input name="slug" type="text" placeholder="gerado automaticamente" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                <input name="website" type="url" placeholder="https://samsung.com" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                <textarea name="description" rows={3} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ordem</label>
                <input name="sort_order" type="number" min={0} defaultValue={0} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="is_active" id="is_active" value="true" defaultChecked className="h-4 w-4 rounded border-input accent-primary" />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">Marca activa</label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading font-semibold text-sm text-foreground">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Título SEO</label>
              <input name="meta_title" type="text" maxLength={70} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Meta Descrição</label>
              <textarea name="meta_description" rows={2} maxLength={160} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link href="/admin/marcas" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Criar Marca</button>
          </div>
        </form>
      </div>
    </div>
  );
}

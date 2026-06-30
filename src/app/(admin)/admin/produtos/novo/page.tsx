import { AdminHeader } from "@/components/layout/AdminHeader";
import { categoryService, brandService } from "@/services/catalog.service";
import { createProductAction } from "@/actions/admin/products";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo Produto" };

export default async function NovoProdutoPage() {
  const [categories, brands] = await Promise.all([
    categoryService.getActive(),
    brandService.getActive(),
  ]);

  return (
    <div>
      <AdminHeader title="Novo Produto" />
      <div className="p-6 max-w-3xl">
        <Link href="/admin/produtos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Produtos
        </Link>

        <form action={createProductAction} className="space-y-6">
          {/* Informações básicas */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Informações Básicas</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Produto <span className="text-destructive">*</span></label>
                <input name="name" type="text" required placeholder="ex: Samsung Galaxy A56 128GB" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">SKU <span className="text-destructive">*</span></label>
                <input name="sku" type="text" required placeholder="ex: SAM-A56-128-PRT" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Código Interno</label>
                <input name="internal_code" type="text" placeholder="Opcional" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Categoria</label>
                <select name="category_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Seleccionar categoria…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Marca</label>
                <select name="brand_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Seleccionar marca…</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição Curta</label>
                <textarea name="short_description" rows={2} maxLength={500} placeholder="Resumo para listagens…" className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição Completa</label>
                <textarea name="description" rows={6} placeholder="Descrição detalhada do produto…" className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          {/* Preços */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Preços (MZN)</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Preço Normal <span className="text-destructive">*</span></label>
                <input name="price" type="number" min={0} step={0.01} required placeholder="0.00" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Preço Promocional</label>
                <input name="sale_price" type="number" min={0} step={0.01} placeholder="0.00" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Custo</label>
                <input name="cost_price" type="number" min={0} step={0.01} placeholder="0.00" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-xs text-muted-foreground mt-1">Não visível ao cliente.</p>
              </div>
            </div>
          </section>

          {/* Logística */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Logística</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Peso (kg)</label>
                <input name="weight_kg" type="number" min={0} step={0.001} placeholder="0.000" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Largura (cm)</label>
                <input name="width_cm" type="number" min={0} step={0.1} placeholder="0.0" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Altura (cm)</label>
                <input name="height_cm" type="number" min={0} step={0.1} placeholder="0.0" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Profundidade (cm)</label>
                <input name="depth_cm" type="number" min={0} step={0.1} placeholder="0.0" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Garantia (meses)</label>
                <input name="warranty_months" type="number" min={0} defaultValue={0} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          {/* Opções */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Estado e Opções</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Estado</label>
                <select name="status" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="draft">Rascunho</option>
                  <option value="active">Activo</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { name: "is_featured", label: "Produto em destaque" },
                { name: "is_new",      label: "Marcar como novo" },
                { name: "has_variants",label: "Tem variações (cor/tamanho/etc.)" },
              ].map((opt) => (
                <div key={opt.name} className="flex items-center gap-2">
                  <input type="checkbox" name={opt.name} id={opt.name} value="on" className="h-4 w-4 rounded border-input accent-primary" />
                  <label htmlFor={opt.name} className="text-sm text-foreground cursor-pointer">{opt.label}</label>
                </div>
              ))}
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading font-semibold text-sm text-foreground">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Título SEO <span className="text-xs text-muted-foreground font-normal">(máx. 70)</span></label>
              <input name="meta_title" type="text" maxLength={70} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Meta Descrição <span className="text-xs text-muted-foreground font-normal">(máx. 160)</span></label>
              <textarea name="meta_description" rows={2} maxLength={160} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </section>

          <div className="flex justify-end gap-3 pb-8">
            <Link href="/admin/produtos" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Criar Produto</button>
          </div>
        </form>
      </div>
    </div>
  );
}

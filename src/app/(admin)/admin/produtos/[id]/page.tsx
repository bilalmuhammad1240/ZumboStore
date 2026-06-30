import { AdminHeader } from "@/components/layout/AdminHeader";
import { productService } from "@/services/product.service";
import { categoryService, brandService } from "@/services/catalog.service";
import { stockService } from "@/services/stock.service";
import {
  updateProductAction,
  updateProductStatusAction,
  addVariantAction,
  deleteVariantAction,
} from "@/actions/admin/products";
import { createStockMovementAction } from "@/actions/admin/stock";
import { formatPrice } from "@/lib/utils/currency";
import { ProductStatusBadge, StockBadge } from "@/components/admin/StatusBadge";
import {
  ChevronLeft, Plus, Trash2, Package,
  ArrowUpCircle, Eye, ToggleRight,
} from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await productService.getById(id);
  return { title: product ? `Editar: ${product.name}` : "Produto não encontrado" };
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    productService.getById(id),
    categoryService.getActive(),
    brandService.getActive(),
  ]);

  if (!product) notFound();

  const stockRecord = await stockService.getByProduct(id);
  const updateWithId = updateProductAction.bind(null, id);
  const primaryImg   = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;

  const STATUS_OPTIONS = [
    { value: "draft",         label: "Rascunho"  },
    { value: "active",        label: "Activo"    },
    { value: "archived",      label: "Arquivado" },
    { value: "out_of_stock",  label: "Esgotado"  },
  ] as const;

  return (
    <div>
      <AdminHeader title={`Editar Produto`} description={product.name} />

      <div className="p-6 max-w-4xl space-y-6">
        {/* Breadcrumb + acções rápidas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Produtos
          </Link>

          <div className="flex items-center gap-2">
            <ProductStatusBadge status={product.status} />
            <Link
              href={`/produto/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> Ver na loja
            </Link>
          </div>
        </div>

        {/* Alterar estado rápido */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <ToggleRight className="h-4 w-4" /> Estado rápido:
          </span>
          {STATUS_OPTIONS.map((opt) => (
            <form key={opt.value} action={updateProductStatusAction.bind(null, id, opt.value)}>
              <button
                type="submit"
                disabled={product.status === opt.value}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  product.status === opt.value
                    ? "bg-primary text-primary-foreground cursor-default"
                    : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            </form>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            <form action={updateWithId} className="space-y-6">
              {/* Informações básicas */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-5">
                <h2 className="font-heading font-semibold text-sm text-foreground">Informações Básicas</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nome <span className="text-destructive">*</span></label>
                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={product.name}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">SKU</label>
                    <input
                      name="sku"
                      type="text"
                      defaultValue={product.sku}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Código Interno</label>
                    <input
                      name="internal_code"
                      type="text"
                      defaultValue={product.internal_code ?? ""}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Categoria</label>
                    <select
                      name="category_id"
                      defaultValue={product.category_id ?? ""}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Sem categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Marca</label>
                    <select
                      name="brand_id"
                      defaultValue={product.brand_id ?? ""}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Sem marca</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Descrição Curta</label>
                    <textarea
                      name="short_description"
                      rows={2}
                      defaultValue={product.short_description ?? ""}
                      className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Descrição Completa</label>
                    <textarea
                      name="description"
                      rows={6}
                      defaultValue={product.description ?? ""}
                      className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </section>

              {/* Preços */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-heading font-semibold text-sm text-foreground">Preços (MZN)</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { name: "price",      label: "Preço Normal",      required: true  },
                    { name: "sale_price", label: "Preço Promocional", required: false },
                    { name: "cost_price", label: "Custo",             required: false },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {f.label} {f.required && <span className="text-destructive">*</span>}
                      </label>
                      <input
                        name={f.name}
                        type="number"
                        min={0}
                        step={0.01}
                        required={f.required}
                        defaultValue={
                          f.name === "price"      ? product.price :
                          f.name === "sale_price" ? (product.sale_price ?? "") :
                          (product.cost_price ?? "")
                        }
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Opções */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-heading font-semibold text-sm text-foreground">Opções</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Estado</label>
                    <select
                      name="status"
                      defaultValue={product.status}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Garantia (meses)</label>
                    <input
                      name="warranty_months"
                      type="number"
                      min={0}
                      defaultValue={product.warranty_months}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-5">
                  {[
                    { name: "is_featured",  label: "Em destaque",   checked: product.is_featured  },
                    { name: "is_new",       label: "Novo",          checked: product.is_new       },
                    { name: "has_variants", label: "Tem variações", checked: product.has_variants },
                  ].map((opt) => (
                    <div key={opt.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={opt.name}
                        id={opt.name}
                        value="on"
                        defaultChecked={opt.checked}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                      <label htmlFor={opt.name} className="text-sm text-foreground cursor-pointer">{opt.label}</label>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEO */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-heading font-semibold text-sm text-foreground">SEO</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Título SEO</label>
                  <input
                    name="meta_title"
                    type="text"
                    maxLength={70}
                    defaultValue={product.meta_title ?? ""}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Meta Descrição</label>
                  <textarea
                    name="meta_description"
                    rows={2}
                    maxLength={160}
                    defaultValue={product.meta_description ?? ""}
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </section>

              <div className="flex justify-end gap-3">
                <Link href="/admin/produtos" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Cancelar
                </Link>
                <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Guardar Produto
                </button>
              </div>
            </form>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-5">
            {/* Imagem principal */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Imagem Principal</h3>
              <div className="aspect-square rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                {primaryImg ? (
                  <Image src={primaryImg} alt={product.name} width={300} height={300} className="h-full w-full object-contain" />
                ) : (
                  <div className="text-center">
                    <Package className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-xs text-muted-foreground">Sem imagem</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Upload de imagens disponível em breve via Supabase Storage.
              </p>
            </div>

            {/* Stock */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                <Package className="h-4 w-4" /> Stock
              </h3>
              {stockRecord ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Disponível</span>
                    <StockBadge qty={stockRecord.quantity} min={stockRecord.min_alert} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Reservado</span>
                    <span className="text-sm font-medium">{stockRecord.reserved} un.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Alerta mínimo</span>
                    <span className="text-sm font-medium">{stockRecord.min_alert} un.</span>
                  </div>
                  {stockRecord.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Localização</span>
                      <span className="text-xs font-medium">{stockRecord.location}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Sem registo de stock.</p>
              )}

              {/* Entrada rápida de stock */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <ArrowUpCircle className="h-3.5 w-3.5 text-green-600" /> Entrada rápida
                </p>
                <form action={createStockMovementAction} className="space-y-2">
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="type" value="entry" />
                  <input
                    name="quantity"
                    type="number"
                    min={1}
                    required
                    placeholder="Quantidade"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    name="reason"
                    type="text"
                    placeholder="Motivo (opcional)"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Registar Entrada
                  </button>
                </form>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Estatísticas</h3>
              <div className="space-y-2">
                {[
                  { label: "Visualizações", value: product.views_count.toLocaleString("pt") },
                  { label: "Vendidos",      value: product.total_sold.toLocaleString("pt")  },
                  { label: "Avaliações",    value: product.total_reviews.toString()           },
                  { label: "Rating médio",  value: product.avg_rating > 0 ? `${product.avg_rating.toFixed(1)} ★` : "—" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Variações */}
        {product.has_variants && (
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-sm text-foreground">
                Variações ({product.variants?.length ?? 0})
              </h2>
            </div>

            {/* Lista de variantes */}
            {product.variants && product.variants.length > 0 ? (
              <div className="mb-6 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acção</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {product.variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-muted/20">
                        <td className="px-3 py-2 font-medium text-foreground">{variant.name}</td>
                        <td className="px-3 py-2">
                          <code className="text-xs text-muted-foreground">{variant.sku}</code>
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">
                          {variant.price ? formatPrice(variant.price) : <span className="text-muted-foreground text-xs">Base</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <StockBadge qty={variant.stock} min={5} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <form action={deleteVariantAction.bind(null, id, variant.id)}>
                            <button
                              type="submit"
                              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mb-5 text-sm text-muted-foreground">Nenhuma variação adicionada.</p>
            )}

            {/* Adicionar variante */}
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Adicionar Variação
              </p>
              <form action={addVariantAction.bind(null, id)} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Nome (ex: Preto / 128GB)"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <input
                    name="sku"
                    type="text"
                    required
                    placeholder="SKU da variante"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    defaultValue={0}
                    placeholder="Stock inicial"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    name="price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Preço (deixar em branco = preço base)"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Adicionar Variação
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

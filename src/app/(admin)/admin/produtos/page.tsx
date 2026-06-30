import { AdminHeader } from "@/components/layout/AdminHeader";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/catalog.service";
import { brandService } from "@/services/catalog.service";
import { ProductStatusBadge } from "@/components/admin/StatusBadge";
import { updateProductStatusAction, deleteProductAction } from "@/actions/admin/products";
import { formatPrice } from "@/lib/utils/currency";
import { Plus, Pencil, Archive, Eye, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Produtos" };

type Props = { searchParams: Promise<{ status?: string; category?: string; page?: string }> };

export default async function ProdutosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);

  const [{ data: products, total, pages }, categories, brands] = await Promise.all([
    productService.getMany({
      status:      sp.status as never,
      category_id: sp.category,
      page,
      limit:       20,
    }),
    categoryService.getActive(),
    brandService.getActive(),
  ]);

  const STATUS_TABS = [
    { value: "",             label: "Todos"     },
    { value: "active",       label: "Activos"   },
    { value: "draft",        label: "Rascunhos" },
    { value: "out_of_stock", label: "Esgotados" },
    { value: "archived",     label: "Arquivados"},
  ];

  return (
    <div>
      <AdminHeader title="Produtos" description={`${total} produto${total !== 1 ? "s" : ""}`} />

      <div className="p-6 max-w-7xl space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs de status */}
          <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
            {STATUS_TABS.map((tab) => (
              <Link
                key={tab.value}
                href={`/admin/produtos${tab.value ? `?status=${tab.value}` : ""}`}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sp.status === tab.value || (!sp.status && !tab.value)
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Novo Produto
          </Link>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum produto encontrado.{" "}
                    <Link href="/admin/produtos/novo" className="text-primary hover:underline">Criar primeiro produto →</Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const primaryImg = (product as never as { images?: { url: string; is_primary: boolean }[] }).images?.find((i) => i.is_primary)?.url
                    ?? (product as never as { images?: { url: string }[] }).images?.[0]?.url;

                  return (
                    <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {primaryImg ? (
                              <Image src={primaryImg} alt={product.name} width={40} height={40} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Sem imagem</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                            {product.avg_rating > 0 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-muted-foreground">{product.avg_rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{product.sku}</code>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {(product as never as { category?: { name: string } }).category?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          {product.sale_price ? (
                            <>
                              <p className="font-semibold text-foreground">{formatPrice(product.sale_price)}</p>
                              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</p>
                            </>
                          ) : (
                            <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ProductStatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/produtos/${product.id}`} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <Link href={`/produto/${product.slug}`} target="_blank" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Ver na loja">
                            <Eye className="h-4 w-4" />
                          </Link>
                          {product.status !== "archived" && (
                            <form action={deleteProductAction.bind(null, product.id)}>
                              <button type="submit" className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Arquivar">
                                <Archive className="h-4 w-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Paginação */}
          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">{total} produtos</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/produtos?page=${page - 1}${sp.status ? `&status=${sp.status}` : ""}`} className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors">
                    ← Anterior
                  </Link>
                )}
                {page < pages && (
                  <Link href={`/admin/produtos?page=${page + 1}${sp.status ? `&status=${sp.status}` : ""}`} className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors">
                    Próxima →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

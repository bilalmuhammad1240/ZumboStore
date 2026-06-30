import { AdminHeader } from "@/components/layout/AdminHeader";
import { stockService } from "@/services/stock.service";
import { StockBadge } from "@/components/admin/StatusBadge";
import { createStockMovementAction, updateMinAlertAction } from "@/actions/admin/stock";
import { productService } from "@/services/product.service";
import { formatDate } from "@/lib/utils/helpers";
import { AlertTriangle, Package, Plus, History } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Estoque" };

export default async function EstoquePage() {
  const [{ data: stocks, total }, alerts, { data: products }] = await Promise.all([
    stockService.getAll({ limit: 50 }),
    stockService.getAlerts(),
    productService.getMany({ status: "active", limit: 200 }),
  ]);

  return (
    <div>
      <AdminHeader title="Gestão de Estoque" description={`${total} registos de stock`} />

      <div className="p-6 max-w-6xl space-y-6">

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h2 className="font-semibold text-sm text-orange-800">
                {alerts.length} produto{alerts.length !== 1 ? "s" : ""} com stock baixo
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {alerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between rounded-lg bg-orange-100 px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-orange-900 line-clamp-1">{alert.product_name}</p>
                    {alert.variant_name && <p className="text-xs text-orange-700">{alert.variant_name}</p>}
                  </div>
                  <span className="text-xs font-bold text-orange-700">{alert.quantity} un.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registar movimento */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-semibold text-sm text-foreground">Registar Movimento</h2>
          </div>

          <form action={createStockMovementAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Produto <span className="text-destructive">*</span></label>
              <select name="product_id" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Seleccionar produto…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tipo <span className="text-destructive">*</span></label>
              <select name="type" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="entry">Entrada</option>
                <option value="exit">Saída</option>
                <option value="adjustment">Ajuste</option>
                <option value="loss">Perda/Avaria</option>
                <option value="inventory">Inventário</option>
                <option value="return">Devolução</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quantidade <span className="text-destructive">*</span></label>
              <input name="quantity" type="number" min={1} required placeholder="0" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-1.5">Motivo</label>
              <input name="reason" type="text" placeholder="Descrever o motivo do movimento…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="flex items-end">
              <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Registar
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de stock */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> Inventário Actual
            </h2>
            <Link href="/admin/estoque/movimentacoes" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
              <History className="h-3.5 w-3.5" /> Ver histórico completo
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Localização</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponível</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Reservado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      Nenhum registo de stock. Crie produtos e registe movimentos acima.
                    </td>
                  </tr>
                ) : (
                  stocks.map((stock) => (
                    <tr key={stock.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-1">
                          {stock.product?.name ?? "—"}
                        </p>
                        {stock.variant?.name && (
                          <p className="text-xs text-muted-foreground mt-0.5">{stock.variant.name}</p>
                        )}
                        <code className="text-xs text-muted-foreground/70">{stock.product?.sku}</code>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {stock.location ?? <span className="text-muted-foreground/40">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-foreground">{stock.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">
                        {stock.reserved}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StockBadge qty={stock.quantity} min={stock.min_alert} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {formatDate(stock.updated_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/components/layout/AdminHeader";
import { stockService } from "@/services/stock.service";
import { formatDateTime } from "@/lib/utils/helpers";
import { ChevronLeft, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { StockMovementType } from "@/types/stock.types";

export const metadata: Metadata = { title: "Movimentações de Estoque" };

type Props = { searchParams: Promise<{ type?: string; page?: string }> };

const MOVEMENT_CONFIG: Record<StockMovementType, { label: string; icon: React.ElementType; color: string }> = {
  entry:      { label: "Entrada",    icon: ArrowUpCircle,   color: "text-green-600"  },
  exit:       { label: "Saída",      icon: ArrowDownCircle, color: "text-red-500"    },
  adjustment: { label: "Ajuste",     icon: RefreshCw,       color: "text-blue-600"   },
  loss:       { label: "Perda",      icon: ArrowDownCircle, color: "text-orange-600" },
  inventory:  { label: "Inventário", icon: RefreshCw,       color: "text-purple-600" },
  return:     { label: "Devolução",  icon: ArrowUpCircle,   color: "text-teal-600"   },
};

export default async function MovimentacoesPage({ searchParams }: Props) {
  const sp   = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);

  const { data: movements, total } = await stockService.getMovements({
    type:  sp.type as StockMovementType | undefined,
    page,
    limit: 30,
  });

  const pages = Math.ceil(total / 30);

  const TYPE_FILTERS = [
    { value: "",          label: "Todos"      },
    { value: "entry",     label: "Entradas"   },
    { value: "exit",      label: "Saídas"     },
    { value: "loss",      label: "Perdas"     },
    { value: "inventory", label: "Inventário" },
    { value: "return",    label: "Devoluções" },
  ];

  return (
    <div>
      <AdminHeader
        title="Histórico de Movimentações"
        description={`${total} movimento${total !== 1 ? "s" : ""} registados`}
      />

      <div className="p-6 max-w-6xl space-y-5">
        <Link href="/admin/estoque" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Estoque
        </Link>

        {/* Filtros de tipo */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/admin/estoque/movimentacoes${f.value ? `?type=${f.value}` : ""}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                sp.type === f.value || (!sp.type && !f.value)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Antes</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Movimento</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depois</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Motivo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhuma movimentação registada.
                  </td>
                </tr>
              ) : (
                movements.map((mov) => {
                  const cfg = MOVEMENT_CONFIG[mov.type] ?? MOVEMENT_CONFIG.adjustment;
                  const Icon = cfg.icon;
                  const isPositive = mov.quantity > 0;

                  return (
                    <tr key={mov.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-1">
                          {mov.product?.name ?? "—"}
                        </p>
                        {mov.variant?.name && (
                          <p className="text-xs text-muted-foreground">{mov.variant.name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {cfg.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{mov.quantity_before}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
                          {isPositive ? "+" : ""}{mov.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-foreground">{mov.quantity_after}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                        {mov.reason ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {formatDateTime(mov.created_at)}
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
              <p className="text-xs text-muted-foreground">{total} movimentos</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/estoque/movimentacoes?page=${page - 1}${sp.type ? `&type=${sp.type}` : ""}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                  >
                    ← Anterior
                  </Link>
                )}
                {page < pages && (
                  <Link
                    href={`/admin/estoque/movimentacoes?page=${page + 1}${sp.type ? `&type=${sp.type}` : ""}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                  >
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

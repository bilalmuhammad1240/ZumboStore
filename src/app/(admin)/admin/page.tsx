import { AdminHeader } from "@/components/layout/AdminHeader";
import { settingsService } from "@/services/settings.service";
import { categoryService, brandService } from "@/services/catalog.service";
import { productService } from "@/services/product.service";
import { stockService } from "@/services/stock.service";
import {
  ShoppingCart, Users, Package, TrendingUp,
  AlertTriangle, CheckCircle, FolderTree, Tag,
  Warehouse, ArrowUpCircle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [
    company,
    isMaintenanceMode,
    categories,
    brands,
    { total: totalProducts },
    { data: stockAlerts },
  ] = await Promise.all([
    settingsService.getCompany(),
    settingsService.isMaintenanceMode(),
    categoryService.getAll(),
    brandService.getAll(),
    productService.getMany({ limit: 1 }),
    stockService.getAlerts(),
  ]);

  const kpis = [
    { label: "Total Produtos",  value: totalProducts.toString(), icon: Package,    color: "bg-blue-50 text-blue-600",   href: "/admin/produtos"   },
    { label: "Categorias",      value: categories.length.toString(), icon: FolderTree, color: "bg-purple-50 text-purple-600", href: "/admin/categorias" },
    { label: "Marcas",          value: brands.length.toString(),  icon: Tag,        color: "bg-orange-50 text-orange-600", href: "/admin/marcas"     },
    { label: "Alertas Stock",   value: stockAlerts.length.toString(), icon: Warehouse,  color: stockAlerts.length > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600", href: "/admin/estoque"  },
  ];

  const MODULES_STATUS = [
    { label: "Módulo 1 — Configuração Base",   done: true  },
    { label: "Módulo 2 — Autenticação",        done: true  },
    { label: "Módulo 3 — Categorias",          done: true  },
    { label: "Módulo 4 — Marcas",              done: true  },
    { label: "Módulo 5 — Produtos",            done: true  },
    { label: "Módulo 6 — Variações",           done: true  },
    { label: "Módulo 7 — Estoque",             done: true  },
    { label: "Módulo 8 — Fornecedores",        done: false },
    { label: "Módulo 9 — Home Page",           done: false },
    { label: "Módulo 10 — Pesquisa",           done: false },
  ];

  return (
    <div>
      <AdminHeader
        title={`Bem-vindo, ${company?.name ?? "Zumbo Store"}`}
        description="Resumo da actividade da plataforma."
      />

      <div className="p-6 space-y-8 max-w-7xl">

        {isMaintenanceMode && (
          <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Loja em Modo de Manutenção</p>
              <p className="text-xs mt-0.5">
                Desactive em{" "}
                <a href="/admin/configuracoes" className="underline font-medium">Configurações</a>.
              </p>
            </div>
          </div>
        )}

        {/* Alertas de stock */}
        {stockAlerts.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-orange-800">
            <Warehouse className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {stockAlerts.length} produto{stockAlerts.length !== 1 ? "s" : ""} com stock baixo ou esgotado
              </p>
              <p className="text-xs mt-0.5">
                {stockAlerts.slice(0,3).map(a => a.product_name).join(", ")}
                {stockAlerts.length > 3 && ` e mais ${stockAlerts.length - 3}…`}
              </p>
            </div>
            <Link href="/admin/estoque" className="text-xs font-medium underline hover:no-underline">
              Ver estoque →
            </Link>
          </div>
        )}

        {/* KPIs */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Catálogo
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <Link
                key={kpi.label}
                href={kpi.href}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                  <div className={`rounded-xl p-2.5 ${kpi.color}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Atalhos rápidos */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Acções Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "/admin/produtos/novo",    label: "Novo Produto",    icon: Package,        color: "bg-blue-50 text-blue-600"    },
              { href: "/admin/categorias/nova",  label: "Nova Categoria",  icon: FolderTree,     color: "bg-purple-50 text-purple-600" },
              { href: "/admin/marcas/nova",      label: "Nova Marca",      icon: Tag,            color: "bg-orange-50 text-orange-600" },
              { href: "/admin/estoque",          label: "Registar Stock",  icon: ArrowUpCircle,  color: "bg-green-50 text-green-600"  },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className={`rounded-lg p-2 ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Progresso de implementação */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Progresso de Implementação
          </h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Sprint 1 e 2 completos</span>
              <span className="text-xs font-bold text-green-600">7 / 36 módulos</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: "19%" }} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MODULES_STATUS.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  ) : (
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className={`text-xs ${item.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

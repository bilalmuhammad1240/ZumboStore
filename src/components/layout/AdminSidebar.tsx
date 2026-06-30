"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Tags, Truck, Megaphone, HeadphonesIcon, BookOpen,
  Warehouse, Building2, ChevronDown, Store,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Estrutura de navegação do admin
// ---------------------------------------------------------------------------

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Catálogo",
    icon: Package,
    children: [
      { label: "Produtos",    href: "/admin/produtos" },
      { label: "Categorias",  href: "/admin/categorias" },
      { label: "Marcas",      href: "/admin/marcas" },
      { label: "Variações",   href: "/admin/variacoes" },
    ],
  },
  {
    label: "Inventário",
    icon: Warehouse,
    children: [
      { label: "Estoque",      href: "/admin/estoque" },
      { label: "Movimentos",   href: "/admin/estoque/movimentacoes" },
      { label: "Fornecedores", href: "/admin/fornecedores" },
    ],
  },
  {
    label: "Pedidos",
    icon: ShoppingCart,
    children: [
      { label: "Todos os Pedidos", href: "/admin/pedidos" },
      { label: "Pagamentos",       href: "/admin/financeiro" },
    ],
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    label: "Marketing",
    icon: Megaphone,
    children: [
      { label: "Cupons",     href: "/admin/marketing/cupons" },
      { label: "Promoções",  href: "/admin/marketing/promocoes" },
      { label: "Banners",    href: "/admin/marketing/banners" },
      { label: "Newsletter", href: "/admin/marketing/newsletter" },
    ],
  },
  {
    label: "Logística",
    icon: Truck,
    children: [
      { label: "Entregadores",  href: "/admin/logistica/entregadores" },
      { label: "Rastreamento",  href: "/admin/logistica/rastreamento" },
    ],
  },
  {
    label: "Suporte",
    icon: HeadphonesIcon,
    children: [
      { label: "Tickets", href: "/admin/suporte/tickets" },
      { label: "FAQ",     href: "/admin/suporte/faq" },
    ],
  },
  {
    label: "CMS",
    icon: BookOpen,
    children: [
      { label: "Blog",    href: "/admin/cms/blog" },
      { label: "Páginas", href: "/admin/cms/paginas" },
    ],
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    children: [
      { label: "Vendas",    href: "/admin/relatorios/vendas" },
      { label: "Produtos",  href: "/admin/relatorios/produtos" },
      { label: "Clientes",  href: "/admin/relatorios/clientes" },
      { label: "Estoque",   href: "/admin/relatorios/estoque" },
    ],
  },
  {
    label: "Configurações",
    icon: Settings,
    children: [
      { label: "Empresa",      href: "/admin/configuracoes/empresa" },
      { label: "Pagamentos",   href: "/admin/configuracoes/pagamentos" },
      { label: "Entregas",     href: "/admin/configuracoes/entregas" },
      { label: "SEO",          href: "/admin/configuracoes/seo" },
      { label: "Notificações", href: "/admin/configuracoes/notificacoes" },
      { label: "Utilizadores", href: "/admin/utilizadores" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function AdminSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    NAV_ITEMS.filter(
      (item) =>
        item.children?.some((child) => pathname.startsWith(child.href))
    ).map((item) => item.label)
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  function isActive(href: string) {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-sidebar-foreground leading-none">
            Zumbo Store
          </p>
          <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">
            Painel Admin
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(item.href!)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          }

          const isOpen = openGroups.includes(item.label);
          const hasActiveChild = item.children.some((c) => isActive(c.href));

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  hasActiveChild
                    ? "text-sidebar-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive(child.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Ver loja */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Tags className="h-3.5 w-3.5" />
          Ver loja online
        </Link>
      </div>
    </aside>
  );
}

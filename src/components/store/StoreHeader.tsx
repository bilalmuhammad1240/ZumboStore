import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ShoppingBag, Search, Heart, User, Menu, Phone } from "lucide-react";
import { settingsService } from "@/services/settings.service";

export async function StoreHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const company = await settingsService.getCompany();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Top bar */}
      <div className="hidden border-b border-border/50 bg-brand-primary md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <p className="text-xs text-white/70">
            {company?.slogan ?? "Compras inteligentes, entregas rápidas."}
          </p>
          <div className="flex items-center gap-4">
            {company?.phone && (
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3" />
                {company.phone}
              </a>
            )}
            {company?.whatsapp && (
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-brand-primary hidden sm:block">
            {company?.name ?? "Zumbo Store"}
          </span>
        </Link>

        {/* Search bar */}
        <form action="/pesquisa" method="GET" className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              type="search"
              placeholder="Pesquisar produtos, marcas, categorias…"
              className="h-10 w-full rounded-xl border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {user ? (
            <>
              <Link
                href="/conta/favoritos"
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Favoritos"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                href="/conta"
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Minha conta"
              >
                <User className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4" />
              Entrar
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/carrinho"
            className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {/* Badge count — implementado com Client Component no Módulo 12 */}
          </Link>
        </div>
      </div>

      {/* Nav bar — categorias */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {[
              { href: "/categoria/eletronicos",    label: "Eletrônicos",      icon: "📱" },
              { href: "/categoria/informatica",    label: "Informática",      icon: "💻" },
              { href: "/categoria/eletrodomesticos",label: "Eletrodomésticos",icon: "🏠" },
              { href: "/categoria/moda-masculina", label: "Moda Masculina",   icon: "👔" },
              { href: "/categoria/moda-feminina",  label: "Moda Feminina",    icon: "👗" },
              { href: "/categoria/calcados",       label: "Calçados",         icon: "👟" },
              { href: "/categoria/beleza",         label: "Beleza",           icon: "💄" },
              { href: "/categoria/casa-escritorio",label: "Casa",             icon: "🪑" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

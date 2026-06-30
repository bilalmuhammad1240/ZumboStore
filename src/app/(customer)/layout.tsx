import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Minha Conta", template: "%s | Zumbo Store" },
};

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/conta");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "Cliente";

  const NAV = [
    { href: "/conta",           label: "Dashboard",  icon: User    },
    { href: "/conta/pedidos",   label: "Pedidos",    icon: Package },
    { href: "/conta/favoritos", label: "Favoritos",  icon: Heart   },
    { href: "/conta/enderecos", label: "Endereços",  icon: MapPin  },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header simples — substituído pelo Header completo no Módulo 9 */}
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-heading text-lg font-bold text-primary">
            Zumbo Store
          </Link>
          <span className="text-sm text-muted-foreground">
            Olá, {displayName}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar de navegação */}
          <aside className="w-full md:w-56 shrink-0">
            <nav className="rounded-xl border border-border bg-card p-2 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border my-1" />

              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Terminar Sessão
                </button>
              </form>
            </nav>
          </aside>

          {/* Conteúdo */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

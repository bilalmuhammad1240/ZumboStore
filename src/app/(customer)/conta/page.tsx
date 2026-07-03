import { createClient } from "@/lib/supabase/server";
import { Package, Heart, MapPin, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Minha Conta" };

export default async function ContaDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .schema("zumbo")
    .from("user_profiles")
    .select("full_name, role, created_at")
    .eq("id", user!.id)
    .single();

  const displayName =
    profile?.full_name ?? user?.email?.split("@")[0] ?? "Cliente";

  const QUICK_LINKS = [
    {
      href:        "/conta/pedidos",
      icon:        Package,
      label:       "Os Meus Pedidos",
      description: "Acompanhe os seus pedidos e histórico de compras.",
      color:       "bg-blue-50 text-blue-600",
    },
    {
      href:        "/conta/favoritos",
      icon:        Heart,
      label:       "Favoritos",
      description: "Produtos que guardou para comprar mais tarde.",
      color:       "bg-red-50 text-red-500",
    },
    {
      href:        "/conta/enderecos",
      icon:        MapPin,
      label:       "Os Meus Endereços",
      description: "Gerir endereços de entrega guardados.",
      color:       "bg-green-50 text-green-600",
    },
    {
      href:        "/conta/avaliacoes",
      icon:        Star,
      label:       "Minhas Avaliações",
      description: "Avaliações que fez sobre os produtos comprados.",
      color:       "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="font-heading text-xl font-bold text-foreground">
          Olá, {displayName}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bem-vindo à sua área de cliente na Zumbo Store.
        </p>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className={`rounded-xl p-3 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>

      {/* Pedidos recentes — placeholder até Módulo 15 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-sm text-foreground">
            Pedidos Recentes
          </h2>
          <Link
            href="/conta/pedidos"
            className="text-xs text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="py-8 text-center text-sm text-muted-foreground">
          Ainda não fez nenhum pedido.{" "}
          <Link href="/" className="text-primary hover:underline">
            Começar a comprar →
          </Link>
        </div>
      </div>
    </div>
  );
}

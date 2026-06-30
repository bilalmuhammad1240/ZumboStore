import { requireAdmin } from "@/lib/supabase/admin";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Painel Admin",
    template: "%s | Admin — Zumbo Store",
  },
  robots: { index: false, follow: false }, // Nunca indexar admin
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autorização antes de renderizar qualquer coisa.
  // requireAdmin() redirige para login ou devolve 404 se sem permissão.
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar fixa à esquerda */}
      <AdminSidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* O header é injectado por cada página via slot ou props */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

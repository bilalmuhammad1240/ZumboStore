import { settingsService } from "@/services/settings.service";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
};

// ISR — revalidar a cada 5 minutos
export const revalidate = 300;

export default async function HomePage() {
  const company = await settingsService.getCompany();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-primary to-[#1a3a6b] px-6 text-white">
      {/* Logo */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-secondary shadow-xl">
        <ShoppingBag className="h-10 w-10 text-white" />
      </div>

      {/* Nome + Slogan */}
      <h1 className="font-heading text-4xl font-bold text-center leading-tight">
        {company?.name ?? "Zumbo Store"}
      </h1>
      <p className="mt-3 text-lg text-white/70 text-center">
        {company?.slogan ?? "Compras inteligentes, entregas rápidas."}
      </p>

      {/* Estado de desenvolvimento */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 max-w-md w-full text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-brand-secondary uppercase tracking-wider mb-2">
          Em Desenvolvimento — Sprint 1
        </p>
        <p className="text-sm text-white/60 leading-relaxed">
          A Home Page completa será implementada no{" "}
          <strong className="text-white/80">Módulo 9</strong> com hero banners,
          categorias, promoções e mais.
        </p>
      </div>

      {/* Acções rápidas */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-brand-secondary/90 transition-colors"
        >
          Painel Admin
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}

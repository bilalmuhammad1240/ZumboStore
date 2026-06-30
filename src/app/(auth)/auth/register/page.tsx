import { register } from "@/actions/auth";
import { FormMessage } from "@/components/common/FormMessage";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie a sua conta na Zumbo Store e comece a comprar.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params   = await searchParams;
  const errorMsg = params.error;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          Criar conta
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Já tem conta?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-brand-secondary hover:underline"
          >
            Entre aqui
          </Link>
        </p>
      </div>

      {errorMsg && (
        <FormMessage kind="error" message={errorMsg} className="mb-5" />
      )}

      <form action={register} className="space-y-4">
        {/* Nome completo */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Nome completo <span className="text-brand-secondary">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            placeholder="Fulano da Silva"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Email <span className="text-brand-secondary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="o-seu@email.com"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        {/* Telefone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Telefone{" "}
            <span className="text-white/40 font-normal text-xs">(opcional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="84 000 0000"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Password <span className="text-brand-secondary">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        {/* Confirmar password */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Confirmar password <span className="text-brand-secondary">*</span>
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Repetir password"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        {/* Termos */}
        <p className="text-xs text-white/40 leading-relaxed pt-1">
          Ao criar conta, aceita os nossos{" "}
          <Link href="/termos" className="underline hover:text-white/70">
            Termos e Condições
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" className="underline hover:text-white/70">
            Política de Privacidade
          </Link>
          .
        </p>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-secondary py-3 text-sm font-semibold text-white hover:bg-brand-secondary/90 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-brand-secondary"
        >
          Criar Conta
        </button>
      </form>
    </>
  );
}

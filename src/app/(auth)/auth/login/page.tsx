import { login } from "@/actions/auth";
import { FormMessage } from "@/components/common/FormMessage";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta Zumbo Store.",
};

type Props = {
  searchParams: Promise<{ error?: string; redirect?: string; success?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const errorMsg   = params.error;
  const redirectTo = params.redirect ?? "";
  const isPasswordReset = params.success === "password_reset";

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          Entrar na conta
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Ainda não tem conta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-brand-secondary hover:underline"
          >
            Registe-se gratuitamente
          </Link>
        </p>
      </div>

      {/* Mensagens de feedback */}
      {errorMsg && (
        <FormMessage kind="error" message={errorMsg} className="mb-5" />
      )}
      {isPasswordReset && (
        <FormMessage
          kind="success"
          message="Password alterada com sucesso. Pode entrar agora."
          className="mb-5"
        />
      )}

      <form action={login} className="space-y-5">
        {redirectTo && (
          <input type="hidden" name="redirect" value={redirectTo} />
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Email
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-white/80"
            >
              Password
            </label>
            <Link
              href="/auth/recuperar-senha"
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Esqueci a password
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-secondary py-3 text-sm font-semibold text-white hover:bg-brand-secondary/90 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 focus:ring-offset-transparent"
        >
          Entrar
        </button>
      </form>
    </>
  );
}

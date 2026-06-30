import { forgotPassword } from "@/actions/auth";
import { FormMessage } from "@/components/common/FormMessage";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar password",
  description: "Recupere o acesso à sua conta Zumbo Store.",
};

type Props = {
  searchParams: Promise<{ error?: string; success?: string; email?: string }>;
};

export default async function RecuperarSenhaPage({ searchParams }: Props) {
  const params  = await searchParams;
  const success = params.success === "true";
  const email   = params.email ?? "";
  const errorMsg = params.error;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          Recuperar password
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Enviamos um link para o seu email.
        </p>
      </div>

      {errorMsg && (
        <FormMessage kind="error" message={errorMsg} className="mb-5" />
      )}

      {success ? (
        <div className="space-y-6">
          <FormMessage
            kind="success"
            message={`Link enviado para ${email || "o seu email"}. Verifique a caixa de entrada e spam.`}
          />
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-brand-secondary hover:underline"
            >
              ← Voltar ao login
            </Link>
          </div>
        </div>
      ) : (
        <form action={forgotPassword} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1.5"
            >
              Email da conta
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

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-secondary py-3 text-sm font-semibold text-white hover:bg-brand-secondary/90 active:scale-[0.98] transition-all"
          >
            Enviar Link de Recuperação
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              ← Voltar ao login
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

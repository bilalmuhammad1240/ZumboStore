import { FormMessage } from "@/components/common/FormMessage";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verificar email" };

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerificarEmailPage({ searchParams }: Props) {
  const params = await searchParams;
  const email  = params.email ?? "";

  return (
    <div className="text-center space-y-6">
      {/* Ícone */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-secondary/20">
          <MailCheck className="h-8 w-8 text-brand-secondary" />
        </div>
      </div>

      {/* Texto */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Confirme o seu email
        </h1>
        <p className="mt-3 text-sm text-white/60 leading-relaxed">
          Enviámos um link de confirmação para{" "}
          {email ? (
            <strong className="text-white/90">{email}</strong>
          ) : (
            "o seu email"
          )}
          . Clique no link para activar a sua conta.
        </p>
      </div>

      <FormMessage
        kind="info"
        message="Não encontra o email? Verifique a pasta de spam ou lixo electrónico."
      />

      <div className="pt-2 space-y-3">
        <Link
          href="/auth/login"
          className="block w-full rounded-xl border border-white/20 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
        >
          Ir para o Login
        </Link>
        <Link
          href="/"
          className="block text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}

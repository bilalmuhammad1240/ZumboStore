import { resetPassword } from "@/actions/auth";
import { FormMessage } from "@/components/common/FormMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova password" };

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NovaSenhaPage({ searchParams }: Props) {
  const params   = await searchParams;
  const errorMsg = params.error;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          Criar nova password
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Escolha uma password segura para a sua conta.
        </p>
      </div>

      {errorMsg && (
        <FormMessage kind="error" message={errorMsg} className="mb-5" />
      )}

      <form action={resetPassword} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Nova password
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

        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Confirmar nova password
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

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-secondary py-3 text-sm font-semibold text-white hover:bg-brand-secondary/90 active:scale-[0.98] transition-all"
        >
          Guardar Nova Password
        </button>
      </form>
    </>
  );
}

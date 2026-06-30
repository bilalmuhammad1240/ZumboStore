import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>

      <h1 className="font-heading text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-lg font-medium text-foreground">
        Página não encontrada
      </p>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        A página que procura não existe ou foi removida.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Ir para a Loja
        </Link>
        <Link
          href="/admin"
          className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Painel Admin
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-primary via-[#0d2a50] to-[#0B1F3A] px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary shadow-lg">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="font-heading text-xl font-bold leading-none">
            Zumbo Store
          </span>
          <p className="text-[10px] text-white/60 mt-0.5">
            Compras inteligentes, entregas rápidas.
          </p>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Zumbo Store · Moçambique
      </p>
    </div>
  );
}

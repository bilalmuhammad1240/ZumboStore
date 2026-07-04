import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { settingsService } from "@/services/settings.service";

export async function StoreFooter() {
  const company = await settingsService.getCompany();

  const LINKS = [
    {
      title: "Empresa",
      items: [
        { href: "/sobre-nos",   label: "Sobre Nós"     },
        { href: "/blog",        label: "Blog"          },
        { href: "/contacto",    label: "Contacto"      },
        { href: "/empresas",    label: "Para Empresas" },
      ],
    },
    {
      title: "Ajuda",
      items: [
        { href: "/trocas-e-devolucoes", label: "Trocas e Devoluções" },
        { href: "/rastrear-pedido",     label: "Rastrear Pedido"     },
        { href: "/faq",                 label: "Perguntas Frequentes"},
        { href: "/contacto",            label: "Suporte"             },
      ],
    },
    {
      title: "Legal",
      items: [
        { href: "/termos",      label: "Termos e Condições" },
        { href: "/privacidade", label: "Privacidade"        },
      ],
    },
  ];

  const PAYMENTS = ["M-Pesa", "e-Mola", "Transferência", "POS", "Entrega"];

  return (
    <footer className="border-t border-border bg-brand-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-secondary">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">
                {company?.name ?? "Zumbo Store"}
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {company?.slogan ?? "Compras inteligentes, entregas rápidas."} A principal loja online de Moçambique.
            </p>
            {company?.whatsapp && (
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>

          {/* Links */}
          {LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading text-sm font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payments + Copyright */}
        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-white/40 mb-2">Métodos de pagamento aceites:</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span key={p} className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/70">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {company?.name ?? "Zumbo Store"} · Moçambique
          </p>
        </div>
      </div>
    </footer>
  );
}

import { AdminHeader } from "@/components/layout/AdminHeader";
import { supplierService } from "@/services/supplier.service";
import { deleteSupplierAction } from "@/actions/admin/suppliers";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { Plus, Pencil, Trash2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fornecedores" };

export default async function FornecedoresPage() {
  const suppliers = await supplierService.getAll();

  return (
    <div>
      <AdminHeader
        title="Fornecedores"
        description={`${suppliers.length} fornecedores registados`}
      />

      <div className="p-6 max-w-5xl">
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/fornecedores/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Novo Fornecedor
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fornecedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Condições</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum fornecedor registado.{" "}
                    <Link href="/admin/fornecedores/novo" className="text-primary hover:underline">
                      Adicionar primeiro fornecedor →
                    </Link>
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{s.name}</p>
                      {s.contact_person && (
                        <p className="text-xs text-muted-foreground mt-0.5">{s.contact_person}</p>
                      )}
                      {s.city && (
                        <p className="text-xs text-muted-foreground/60">{s.city}, {s.country}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-1">
                        {s.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {s.phone}
                          </div>
                        )}
                        {s.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {s.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {s.payment_terms ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ActiveBadge active={s.is_active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/fornecedores/${s.id}`}
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={deleteSupplierAction.bind(null, s.id)}>
                          <button
                            type="submit"
                            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

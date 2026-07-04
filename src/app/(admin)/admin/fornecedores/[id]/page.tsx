import { AdminHeader } from "@/components/layout/AdminHeader";
import { supplierService } from "@/services/supplier.service";
import { updateSupplierAction } from "@/actions/admin/suppliers";
import { formatPrice } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/helpers";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await supplierService.getById(id);
  return { title: s ? `Editar ${s.name}` : "Fornecedor não encontrado" };
}

const PAYMENT_TERMS = ["À vista", "15 dias", "30 dias", "45 dias", "60 dias", "90 dias"];
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft:     { label: "Rascunho",  color: "bg-gray-100 text-gray-600"   },
  sent:      { label: "Enviada",   color: "bg-blue-100 text-blue-700"   },
  partial:   { label: "Parcial",   color: "bg-yellow-100 text-yellow-700"},
  received:  { label: "Recebida",  color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700"     },
};

export default async function EditarFornecedorPage({ params }: Props) {
  const { id } = await params;
  const [supplier, orders] = await Promise.all([
    supplierService.getById(id),
    supplierService.getOrders(id),
  ]);
  if (!supplier) notFound();

  const updateWithId = updateSupplierAction.bind(null, id);

  return (
    <div>
      <AdminHeader title={`Editar: ${supplier.name}`} />
      <div className="p-6 max-w-4xl space-y-6">
        <Link href="/admin/fornecedores" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Fornecedores
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form action={updateWithId} className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-6 space-y-5">
                <h2 className="font-heading font-semibold text-sm text-foreground">Informações</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nome <span className="text-destructive">*</span></label>
                    <input name="name" type="text" required defaultValue={supplier.name} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Pessoa de Contacto</label>
                    <input name="contact_person" type="text" defaultValue={supplier.contact_person ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input name="email" type="email" defaultValue={supplier.email ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Telefone</label>
                    <input name="phone" type="tel" defaultValue={supplier.phone ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
                    <input name="whatsapp" type="tel" defaultValue={supplier.whatsapp ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Cidade</label>
                    <input name="city" type="text" defaultValue={supplier.city ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">País</label>
                    <input name="country" type="text" defaultValue={supplier.country} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Condições de Pagamento</label>
                    <select name="payment_terms" defaultValue={supplier.payment_terms ?? ""} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Seleccionar…</option>
                      {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" name="is_active" id="is_active" value="true" defaultChecked={supplier.is_active} className="h-4 w-4 rounded border-input accent-primary" />
                    <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">Activo</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Notas</label>
                    <textarea name="notes" rows={3} defaultValue={supplier.notes ?? ""} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
              </section>
              <div className="flex justify-end gap-3">
                <Link href="/admin/fornecedores" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</Link>
                <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Guardar</button>
              </div>
            </form>
          </div>

          {/* Histórico de compras */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Ordens de Compra ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem ordens de compra.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => {
                    const cfg = STATUS_MAP[order.status] ?? STATUS_MAP.draft;
                    return (
                      <div key={order.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                          <span className="text-xs font-semibold text-foreground">{formatPrice(order.total_amount)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        {order.expected_date && (
                          <p className="text-xs text-muted-foreground">Previsto: {formatDate(order.expected_date)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/components/layout/AdminHeader";
import { createSupplierAction } from "@/actions/admin/suppliers";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo Fornecedor" };

const PAYMENT_TERMS = ["À vista", "15 dias", "30 dias", "45 dias", "60 dias", "90 dias"];

export default function NovoFornecedorPage() {
  return (
    <div>
      <AdminHeader title="Novo Fornecedor" />
      <div className="p-6 max-w-2xl">
        <Link href="/admin/fornecedores" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Fornecedores
        </Link>

        <form action={createSupplierAction} className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="font-heading font-semibold text-sm text-foreground">Informações do Fornecedor</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome <span className="text-destructive">*</span></label>
                <input name="name" type="text" required placeholder="ex: TechSupply Lda." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pessoa de Contacto</label>
                <input name="contact_person" type="text" placeholder="Nome do responsável" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input name="email" type="email" placeholder="fornecedor@email.com" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Telefone</label>
                <input name="phone" type="tel" placeholder="+258 84 000 0000" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
                <input name="whatsapp" type="tel" placeholder="258840000000" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Cidade</label>
                <input name="city" type="text" placeholder="Maputo" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">País</label>
                <input name="country" type="text" defaultValue="Moçambique" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Endereço</label>
                <input name="address" type="text" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Condições de Pagamento</label>
                <select name="payment_terms" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Seleccionar…</option>
                  {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="is_active" id="is_active" value="true" defaultChecked className="h-4 w-4 rounded border-input accent-primary" />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">Fornecedor activo</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Notas internas</label>
                <textarea name="notes" rows={3} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link href="/admin/fornecedores" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Criar Fornecedor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/components/layout/AdminHeader";
import { categoryService } from "@/services/catalog.service";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { deleteCategoryAction } from "@/actions/admin/catalog";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorias" };

export default async function CategoriasPage() {
  const categories = await categoryService.getAll();

  // Mapear parent names
  const parentMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div>
      <AdminHeader
        title="Categorias"
        description={`${categories.length} categorias registadas`}
      />

      <div className="p-6 max-w-5xl">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            <FolderTree className="h-4 w-4" />
            Hierarquia ilimitada de categorias e subcategorias
          </div>
          <Link
            href="/admin/categorias/nova"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Link>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Pai</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {cat.icon && <span className="text-lg">{cat.icon}</span>}
                        <div>
                          <p className="font-medium text-foreground">{cat.name}</p>
                          {cat.parent_id && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ↳ {parentMap[cat.parent_id] ?? "—"}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {cat.parent_id ? parentMap[cat.parent_id] ?? "—" : <span className="text-foreground/40">Raiz</span>}
                    </td>
                    <td className="px-4 py-3">
                      <ActiveBadge active={cat.is_active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categorias/${cat.id}`}
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteCategoryAction(cat.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Desactivar"
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

"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Column<T> = {
  key:       keyof T | string;
  label:     string;
  render?:   (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  data:       T[];
  columns:    Column<T>[];
  total:      number;
  page:       number;
  limit:      number;
  onPage?:    (page: number) => void;
  searchable?: boolean;
  onSearch?:  (q: string) => void;
  emptyLabel?: string;
  actions?:   (row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string }>({
  data, columns, total, page, limit,
  onPage, searchable, onSearch, emptyLabel = "Sem resultados.", actions,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const pages = Math.ceil(total / limit);

  function handleSearch(q: string) {
    setSearch(q);
    onSearch?.(q);
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Pesquisar…"
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      col.className
                    )}
                  >
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Acções
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    {columns.map((col) => (
                      <td key={String(col.key)} className={cn("px-4 py-3", col.className)}>
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {total} resultado{total !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPage?.(page - 1)}
                disabled={page <= 1}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-xs text-muted-foreground">
                {page} / {pages}
              </span>
              <button
                onClick={() => onPage?.(page + 1)}
                disabled={page >= pages}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

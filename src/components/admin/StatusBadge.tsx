import { cn } from "@/lib/utils/cn";

type Color = "green" | "yellow" | "red" | "blue" | "gray" | "orange" | "purple";

const COLOR_MAP: Record<Color, string> = {
  green:  "bg-green-100 text-green-700 border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  red:    "bg-red-100 text-red-700 border-red-200",
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
};

type Props = {
  label:      string;
  color:      Color;
  className?: string;
};

export function StatusBadge({ label, color, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        COLOR_MAP[color],
        className
      )}
    >
      {label}
    </span>
  );
}

// Helpers pré-definidos para status de produto
export function ProductStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: Color }> = {
    active:       { label: "Activo",    color: "green"  },
    draft:        { label: "Rascunho",  color: "gray"   },
    archived:     { label: "Arquivado", color: "red"    },
    out_of_stock: { label: "Esgotado",  color: "orange" },
  };
  const cfg = map[status] ?? { label: status, color: "gray" as Color };
  return <StatusBadge label={cfg.label} color={cfg.color} />;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return active
    ? <StatusBadge label="Activo"     color="green" />
    : <StatusBadge label="Inactivo"   color="gray"  />;
}

export function StockBadge({ qty, min }: { qty: number; min: number }) {
  if (qty === 0)       return <StatusBadge label="Esgotado"   color="red"    />;
  if (qty <= min)      return <StatusBadge label="Stock Baixo" color="orange" />;
  return                      <StatusBadge label={`${qty} un.`} color="green" />;
}

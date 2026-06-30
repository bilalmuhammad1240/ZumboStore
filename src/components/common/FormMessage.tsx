import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Kind = "error" | "success" | "info";

type Props = {
  kind: Kind;
  message: string;
  className?: string;
};

const STYLES: Record<Kind, { wrapper: string; icon: React.ElementType }> = {
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-800",
    icon:    AlertCircle,
  },
  success: {
    wrapper: "border-green-200 bg-green-50 text-green-800",
    icon:    CheckCircle2,
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-800",
    icon:    Info,
  },
};

export function FormMessage({ kind, message, className }: Props) {
  const { wrapper, icon: Icon } = STYLES[kind];

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm",
        wrapper,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

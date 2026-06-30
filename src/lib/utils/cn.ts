import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário padrão do Shadcn UI para combinar classes Tailwind.
 * Resolve conflitos automaticamente (ex: "p-2 p-4" → "p-4").
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

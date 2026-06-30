const PT_MZ_LOCALE = "pt-MZ";

/**
 * Formata uma data para exibição curta.
 * Ex: "2024-06-15T10:30:00Z" → "15/06/2024"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(PT_MZ_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Africa/Maputo",
  }).format(new Date(date));
}

/**
 * Formata uma data com hora.
 * Ex: "2024-06-15T10:30:00Z" → "15/06/2024 às 13:30"
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat(PT_MZ_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Maputo",
  }).format(new Date(date));
}

/**
 * Devolve uma descrição relativa.
 * Ex: "há 3 dias", "há 2 horas"
 */
export function formatRelative(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("pt", { numeric: "auto" });
  const diff = (new Date(date).getTime() - Date.now()) / 1000;

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diff) >= seconds) {
      return rtf.format(Math.round(diff / seconds), unit);
    }
  }

  return "agora mesmo";
}

// ---------------------------------------------------------------------------
// Supabase Storage
// ---------------------------------------------------------------------------

/**
 * Extrai o caminho relativo dentro do bucket a partir de um URL
 * público do Supabase Storage. Necessário para apagar ficheiros.
 *
 * Ex: ".../storage/v1/object/public/products/abc/image.jpg"
 *     bucket="products" → "abc/image.jpg"
 *
 * Retirado do mozmarkethub (lib/utils.ts → extractStoragePath).
 */
export function extractStoragePath(
  url: string,
  bucket: string
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

// ---------------------------------------------------------------------------
// Search / Input sanitization
// ---------------------------------------------------------------------------

/**
 * Sanitiza um termo de pesquisa para uso em filtros ilike/or()
 * do PostgREST. Remove caracteres especiais e limita o tamanho.
 *
 * Retirado do mozmarkethub (lib/utils.ts → sanitizeSearchTerm).
 */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()%_]/g, " ").trim().slice(0, 100);
}

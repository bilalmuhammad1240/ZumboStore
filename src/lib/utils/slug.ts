/**
 * Gera um slug URL-friendly a partir de qualquer string.
 * Suporta caracteres portugueses (ç, ã, é, etc.).
 * Ex: "Samsung Galaxy A56 128GB" → "samsung-galaxy-a56-128gb"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // Remove especiais
    .trim()
    .replace(/\s+/g, "-")           // Espaços → hífens
    .replace(/-+/g, "-");           // Múltiplos hífens → um
}

/**
 * Garante que um slug é único num array de slugs existentes.
 * Se "produto" já existir, devolve "produto-2", "produto-3", etc.
 */
export function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

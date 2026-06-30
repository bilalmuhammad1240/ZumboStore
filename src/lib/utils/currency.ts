/**
 * Utilitários de formatação monetária para a Zumbo Store.
 * Moeda: Metical Moçambicano (MZN / MT).
 *
 * Baseado no formatPrice() do mozmarkethub, extendido com
 * suporte a compacto, desconto e parcelamento.
 */

const PT_MZ_LOCALE = "pt-PT";

/**
 * Formata um valor em MZN com separador de milhares.
 * Ex: 15000  → "15.000 MT"
 *     1500.5 → "1.500,50 MT"  (se tiver cêntimos)
 */
export function formatPrice(
  value: number,
  options: { decimals?: boolean } = {}
): string {
  const { decimals = false } = options;

  const formatted = new Intl.NumberFormat(PT_MZ_LOCALE, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(value);

  return `${formatted} MT`;
}

/**
 * Calcula a percentagem de desconto entre o preço original e o de venda.
 * Ex: original=1000, sale=750 → 25
 */
export function calcDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Formata o desconto como string.
 * Ex: "-25%"
 */
export function formatDiscount(
  originalPrice: number,
  salePrice: number
): string {
  const pct = calcDiscountPercent(originalPrice, salePrice);
  return `-${pct}%`;
}

/**
 * Calcula o valor da parcela para exibição no checkout.
 * Ex: total=6000, parcelas=3 → "2.000 MT"
 */
export function formatInstallment(total: number, installments: number): string {
  if (installments <= 1) return formatPrice(total);
  return formatPrice(total / installments);
}

/**
 * Converte uma string de valor (ex: "1 500,50") para número.
 * Útil ao receber inputs de formulários.
 */
export function parsePrice(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

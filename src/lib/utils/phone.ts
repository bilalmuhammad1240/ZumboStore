/**
 * Utilitários de telefone moçambicano.
 *
 * Retirado directamente do mozmarkethub (lib/utils.ts) e isolado
 * num módulo próprio para ser reutilizado em validadores, serviços
 * de notificação e integrações M-Pesa / WhatsApp.
 */

/**
 * Normaliza um número de telefone moçambicano para o formato
 * internacional usado pelo WhatsApp e pela API M-Pesa.
 * Exemplos:
 *   "84 123 4567"     → "258841234567"
 *   "+258 82 123 4567" → "258821234567"
 *   "0841234567"      → "258841234567"
 */
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("258")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length === 9) {
    return `258${digits}`;
  }

  return digits;
}

/** Alias mantido para consistência com mozmarkethub. */
export const normalizeWhatsapp = normalizePhone;

/**
 * Valida se o número, depois de normalizado, corresponde a um
 * número de celular moçambicano válido (258 + 8X XXXXXXXX).
 * Operadoras aceites: Vodacom (84/85), Tmcel (82/83), Movitel (86/87).
 */
export function isValidMozambiquePhone(phone: string): boolean {
  return /^2588[2-7]\d{7}$/.test(normalizePhone(phone));
}

/**
 * Gera um link "wa.me" com mensagem pré-preenchida.
 * Ex: whatsappLink("841234567", "Olá!") → "https://wa.me/258841234567?text=Ol%C3%A1!"
 */
export function whatsappLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

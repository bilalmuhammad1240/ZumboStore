/**
 * Lista oficial das 11 províncias de Moçambique + Maputo Cidade.
 * Usada em formulários de endereço, filtros de entrega e relatórios.
 */
export const PROVINCES = [
  { value: "maputo_cidade", label: "Maputo Cidade" },
  { value: "maputo",        label: "Maputo Província" },
  { value: "gaza",          label: "Gaza" },
  { value: "inhambane",     label: "Inhambane" },
  { value: "sofala",        label: "Sofala" },
  { value: "manica",        label: "Manica" },
  { value: "tete",          label: "Tete" },
  { value: "zambezia",      label: "Zambézia" },
  { value: "nampula",       label: "Nampula" },
  { value: "cabo_delgado",  label: "Cabo Delgado" },
  { value: "niassa",        label: "Niassa" },
] as const;

export type ProvinceValue = (typeof PROVINCES)[number]["value"];

/** Devolve o label de uma província a partir do seu value. */
export function getProvinceLabel(value: string): string {
  return PROVINCES.find((p) => p.value === value)?.label ?? value;
}

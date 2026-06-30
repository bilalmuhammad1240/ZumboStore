/** Métodos de pagamento aceites pela Zumbo Store. */
export const PAYMENT_METHODS = [
  { value: "mpesa",            label: "M-Pesa",               icon: "📱" },
  { value: "emola",            label: "e-Mola",               icon: "📲" },
  { value: "bank_transfer",    label: "Transferência Bancária",icon: "🏦" },
  { value: "pos",              label: "POS / Cartão",          icon: "💳" },
  { value: "cash_on_delivery", label: "Pagamento na Entrega",  icon: "💵" },
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

// ---------------------------------------------------------------------------

/** Estados do pedido com label e cor para badges. */
export const ORDER_STATUSES = [
  { value: "pending",            label: "Pendente",          color: "yellow" },
  { value: "payment_confirmed",  label: "Pago",              color: "blue"   },
  { value: "processing",         label: "Em Preparação",     color: "purple" },
  { value: "shipped",            label: "Enviado",           color: "indigo" },
  { value: "delivered",          label: "Entregue",          color: "green"  },
  { value: "cancelled",          label: "Cancelado",         color: "red"    },
  { value: "refunded",           label: "Reembolsado",       color: "gray"   },
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number]["value"];

export function getOrderStatusLabel(value: string): string {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------

/** Estados de pagamento. */
export const PAYMENT_STATUSES = [
  { value: "unpaid",   label: "Não Pago",   color: "red"    },
  { value: "paid",     label: "Pago",       color: "green"  },
  { value: "refunded", label: "Reembolsado",color: "gray"   },
  { value: "partial",  label: "Parcial",    color: "yellow" },
] as const;

export type PaymentStatusValue = (typeof PAYMENT_STATUSES)[number]["value"];

// ---------------------------------------------------------------------------

/** Métodos de entrega. */
export const SHIPPING_METHODS = [
  { value: "normal",   label: "Normal",   description: "2 a 7 dias úteis"  },
  { value: "express",  label: "Expresso", description: "Mesmo dia"          },
  { value: "scheduled",label: "Agendada", description: "Data à sua escolha" },
  { value: "pickup",   label: "Retirada", description: "Loja física"        },
] as const;

export type ShippingMethodValue = (typeof SHIPPING_METHODS)[number]["value"];

// =============================================================================
// Tipos de Estoque — Módulo 7
// =============================================================================

export type StockMovementType =
  | "entry"
  | "exit"
  | "adjustment"
  | "loss"
  | "inventory"
  | "return";

export type Stock = {
  id:                 string;
  product_id:         string;
  product_variant_id: string | null;
  quantity:           number;
  reserved:           number;
  min_alert:          number;
  location:           string | null;
  updated_at:         string;
  // Relações opcionais
  product?: {
    name: string;
    sku:  string;
    status: string;
  };
  variant?: {
    name: string;
    sku:  string;
  } | null;
};

export type StockMovement = {
  id:                 string;
  product_id:         string;
  product_variant_id: string | null;
  type:               StockMovementType;
  quantity:           number;
  quantity_before:    number;
  quantity_after:     number;
  reason:             string | null;
  reference_id:       string | null;
  reference_type:     string | null;
  created_by:         string | null;
  created_at:         string;
  // Relações opcionais
  product?: { name: string; sku: string };
  variant?: { name: string } | null;
  creator?: { full_name: string | null } | null;
};

export type StockAlert = {
  id:                 string;
  product_id:         string;
  product_name:       string;
  product_sku:        string;
  product_variant_id: string | null;
  variant_name:       string | null;
  quantity:           number;
  reserved:           number;
  min_alert:          number;
  location:           string | null;
  updated_at:         string;
};

export type CreateStockMovementInput = {
  product_id:          string;
  product_variant_id?: string | null;
  type:                StockMovementType;
  quantity:            number;           // sempre positivo — o tipo define a direcção
  reason?:             string | null;
  reference_id?:       string | null;
  reference_type?:     string | null;
  created_by:          string;
};

export type StockFilters = {
  search?:       string;
  low_stock?:    boolean;
  product_id?:   string;
  page?:         number;
  limit?:        number;
};

export type MovementFilters = {
  product_id?:   string;
  type?:         StockMovementType;
  from_date?:    string;
  to_date?:      string;
  page?:         number;
  limit?:        number;
};

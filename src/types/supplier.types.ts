// =============================================================================
// Tipos de Fornecedores — Módulo 8
// =============================================================================

export type Supplier = {
  id:             string;
  name:           string;
  email:          string | null;
  phone:          string | null;
  whatsapp:       string | null;
  address:        string | null;
  city:           string | null;
  country:        string;
  contact_person: string | null;
  payment_terms:  string | null;
  notes:          string | null;
  is_active:      boolean;
  created_at:     string;
  updated_at:     string;
};

export type CreateSupplierInput = Omit<Supplier, "id" | "created_at" | "updated_at">;
export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type PurchaseOrderStatus = "draft" | "sent" | "partial" | "received" | "cancelled";

export type PurchaseOrder = {
  id:            string;
  supplier_id:   string;
  status:        PurchaseOrderStatus;
  notes:         string | null;
  expected_date: string | null;
  received_date: string | null;
  total_amount:  number;
  created_by:    string | null;
  created_at:    string;
  updated_at:    string;
  supplier?:     Pick<Supplier, "id" | "name" | "phone">;
  items?:        PurchaseItem[];
};

export type PurchaseItem = {
  id:                 string;
  purchase_order_id:  string;
  product_id:         string;
  product_variant_id: string | null;
  quantity_ordered:   number;
  quantity_received:  number;
  unit_cost:          number;
  total_cost:         number;
  product?: { name: string; sku: string };
  variant?: { name: string } | null;
};

-- =============================================================================
-- ZUMBO STORE — Migration 0006
-- Sprint 3 · Módulo 8: Fornecedores e Ordens de Compra
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.suppliers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.suppliers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT,
  phone          TEXT,
  whatsapp       TEXT,
  address        TEXT,
  city           TEXT,
  country        TEXT NOT NULL DEFAULT 'Moçambique',
  contact_person TEXT,
  payment_terms  TEXT,           -- ex: '30 dias', 'à vista'
  notes          TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_suppliers_active ON zumbo.suppliers(is_active);

ALTER TABLE zumbo.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_suppliers_staff_read" ON zumbo.suppliers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_suppliers_staff_write" ON zumbo.suppliers
  FOR ALL USING (zumbo.has_permission('stock','create'));

CREATE TRIGGER trg_zumbo_suppliers_updated_at
  BEFORE UPDATE ON zumbo.suppliers
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.purchase_orders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.purchase_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id   UUID NOT NULL REFERENCES zumbo.suppliers(id),
  status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','sent','partial','received','cancelled')),
  notes         TEXT,
  expected_date DATE,
  received_date DATE,
  total_amount  NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_by    UUID REFERENCES zumbo.user_profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_po_supplier ON zumbo.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_po_status   ON zumbo.purchase_orders(status);

ALTER TABLE zumbo.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_po_staff_read" ON zumbo.purchase_orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_po_staff_write" ON zumbo.purchase_orders
  FOR ALL USING (zumbo.has_permission('stock','create'));

CREATE TRIGGER trg_zumbo_po_updated_at
  BEFORE UPDATE ON zumbo.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.purchase_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.purchase_items (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id  UUID NOT NULL REFERENCES zumbo.purchase_orders(id) ON DELETE CASCADE,
  product_id         UUID NOT NULL REFERENCES zumbo.products(id),
  product_variant_id UUID REFERENCES zumbo.product_variants(id),
  quantity_ordered   INT  NOT NULL CHECK (quantity_ordered > 0),
  quantity_received  INT  NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
  unit_cost          NUMERIC(12,2) NOT NULL CHECK (unit_cost >= 0),
  total_cost         NUMERIC(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED
);

CREATE INDEX IF NOT EXISTS idx_zumbo_pi_order ON zumbo.purchase_items(purchase_order_id);

ALTER TABLE zumbo.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_pi_staff_read" ON zumbo.purchase_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_pi_staff_write" ON zumbo.purchase_items
  FOR ALL USING (zumbo.has_permission('stock','create'));

-- ---------------------------------------------------------------------------
-- TRIGGER: recalcular total_amount da ordem ao alterar itens
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION zumbo.recalc_purchase_order_total()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE zumbo.purchase_orders
  SET total_amount = (
    SELECT COALESCE(SUM(total_cost), 0)
    FROM zumbo.purchase_items
    WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_zumbo_pi_recalc_total
  AFTER INSERT OR UPDATE OR DELETE ON zumbo.purchase_items
  FOR EACH ROW EXECUTE FUNCTION zumbo.recalc_purchase_order_total();

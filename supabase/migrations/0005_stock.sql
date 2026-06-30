-- =============================================================================
-- ZUMBO STORE — Migration 0005
-- Sprint 2 · Módulo 7: Estoque e Movimentações
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.stock
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.stock (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id         UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES zumbo.product_variants(id) ON DELETE CASCADE,
  quantity           INT NOT NULL DEFAULT 0  CHECK (quantity >= 0),
  reserved           INT NOT NULL DEFAULT 0  CHECK (reserved >= 0),   -- em pedidos pendentes
  min_alert          INT NOT NULL DEFAULT 5,                           -- alerta de stock mínimo
  location           TEXT,                                             -- ex: 'Armazém A / Prateleira 3'
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, product_variant_id)
);

CREATE INDEX IF NOT EXISTS idx_zumbo_stock_product  ON zumbo.stock(product_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_stock_variant  ON zumbo.stock(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_stock_low      ON zumbo.stock(quantity) WHERE quantity <= min_alert;

ALTER TABLE zumbo.stock ENABLE ROW LEVEL SECURITY;

-- Apenas staff lê stock (quantidade nunca exposta ao cliente directamente)
CREATE POLICY "zumbo_stock_staff_read" ON zumbo.stock
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_stock_staff_write" ON zumbo.stock
  FOR ALL USING (zumbo.has_permission('stock','update'));

CREATE TRIGGER trg_zumbo_stock_updated_at
  BEFORE UPDATE ON zumbo.stock
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.stock_movements  (histórico imutável — sem UPDATE/DELETE)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.stock_movements (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id         UUID NOT NULL REFERENCES zumbo.products(id),
  product_variant_id UUID REFERENCES zumbo.product_variants(id),
  type               TEXT NOT NULL
                       CHECK (type IN ('entry','exit','adjustment','loss','inventory','return')),
  quantity           INT NOT NULL,          -- positivo=entrada, negativo=saída
  quantity_before    INT NOT NULL,
  quantity_after     INT NOT NULL,
  reason             TEXT,
  reference_id       UUID,                  -- order_id, purchase_order_id, etc.
  reference_type     TEXT,                  -- 'order', 'purchase_order', 'manual'
  created_by         UUID REFERENCES zumbo.user_profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_movements_product ON zumbo.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_movements_date    ON zumbo.stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_zumbo_movements_type    ON zumbo.stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_zumbo_movements_ref     ON zumbo.stock_movements(reference_id) WHERE reference_id IS NOT NULL;

ALTER TABLE zumbo.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_movements_staff_read" ON zumbo.stock_movements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

-- Apenas INSERT — histórico é imutável
CREATE POLICY "zumbo_movements_staff_insert" ON zumbo.stock_movements
  FOR INSERT WITH CHECK (zumbo.has_permission('stock','update'));

-- ---------------------------------------------------------------------------
-- TRIGGER: actualizar zumbo.stock automaticamente após movimentação
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION zumbo.apply_stock_movement()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Upsert no registo de stock correspondente
  INSERT INTO zumbo.stock (product_id, product_variant_id, quantity, updated_at)
  VALUES (NEW.product_id, NEW.product_variant_id, NEW.quantity_after, NOW())
  ON CONFLICT (product_id, product_variant_id)
  DO UPDATE SET
    quantity   = NEW.quantity_after,
    updated_at = NOW();

  -- Actualizar status do produto se stock chegar a 0
  IF NEW.quantity_after = 0 THEN
    UPDATE zumbo.products
    SET status = 'out_of_stock', updated_at = NOW()
    WHERE id = NEW.product_id AND status = 'active' AND has_variants = false;
  ELSIF NEW.quantity_after > 0 THEN
    UPDATE zumbo.products
    SET status = 'active', updated_at = NOW()
    WHERE id = NEW.product_id AND status = 'out_of_stock' AND has_variants = false;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_zumbo_apply_stock_movement
  AFTER INSERT ON zumbo.stock_movements
  FOR EACH ROW EXECUTE FUNCTION zumbo.apply_stock_movement();

-- ---------------------------------------------------------------------------
-- VIEW: stock_alert — produtos com stock abaixo do mínimo
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW zumbo.stock_alert AS
SELECT
  s.id,
  s.product_id,
  p.name   AS product_name,
  p.sku    AS product_sku,
  s.product_variant_id,
  v.name   AS variant_name,
  s.quantity,
  s.reserved,
  s.min_alert,
  s.location,
  s.updated_at
FROM zumbo.stock s
JOIN zumbo.products p ON p.id = s.product_id
LEFT JOIN zumbo.product_variants v ON v.id = s.product_variant_id
WHERE s.quantity <= s.min_alert
ORDER BY s.quantity ASC;

-- =============================================================================
-- ZUMBO STORE — Migration 0004
-- Sprint 2 · Módulos 5 e 6: Produtos e Variações
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID REFERENCES zumbo.categories(id) ON DELETE SET NULL,
  brand_id          UUID REFERENCES zumbo.brands(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  sku               TEXT UNIQUE NOT NULL,
  internal_code     TEXT,
  barcode           TEXT,
  description       TEXT,
  short_description TEXT,
  -- Preços em MZN
  price             NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  sale_price        NUMERIC(12,2) CHECK (sale_price >= 0),
  cost_price        NUMERIC(12,2) CHECK (cost_price >= 0),
  -- Logística
  weight_kg         NUMERIC(8,3),
  width_cm          NUMERIC(8,2),
  height_cm         NUMERIC(8,2),
  depth_cm          NUMERIC(8,2),
  -- Estado
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','active','archived','out_of_stock')),
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  is_new            BOOLEAN NOT NULL DEFAULT FALSE,
  has_variants      BOOLEAN NOT NULL DEFAULT FALSE,
  -- Garantia
  warranty_months   INT NOT NULL DEFAULT 0,
  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,
  -- Contadores (actualizados por triggers)
  total_sold        INT NOT NULL DEFAULT 0,
  total_reviews     INT NOT NULL DEFAULT 0,
  avg_rating        NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (avg_rating BETWEEN 0 AND 5),
  views_count       INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_products_category ON zumbo.products(category_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_products_brand    ON zumbo.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_products_status   ON zumbo.products(status);
CREATE INDEX IF NOT EXISTS idx_zumbo_products_slug     ON zumbo.products(slug);
CREATE INDEX IF NOT EXISTS idx_zumbo_products_sku      ON zumbo.products(sku);
CREATE INDEX IF NOT EXISTS idx_zumbo_products_featured ON zumbo.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_zumbo_products_new      ON zumbo.products(is_new)      WHERE is_new = true;

-- Full-text search em português
CREATE INDEX IF NOT EXISTS idx_zumbo_products_fts ON zumbo.products
  USING GIN(to_tsvector('portuguese', name || ' ' || COALESCE(short_description,'') || ' ' || COALESCE(description,'')));

ALTER TABLE zumbo.products ENABLE ROW LEVEL SECURITY;

-- Público: apenas produtos activos
CREATE POLICY "zumbo_products_public_read" ON zumbo.products
  FOR SELECT USING (status = 'active');

-- Staff: lê tudo
CREATE POLICY "zumbo_products_staff_read" ON zumbo.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

-- Staff com permissão: escreve
CREATE POLICY "zumbo_products_staff_write" ON zumbo.products
  FOR ALL USING (zumbo.has_permission('products','create'));

CREATE TRIGGER trg_zumbo_products_updated_at
  BEFORE UPDATE ON zumbo.products
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.product_images
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INT  NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_product_images_product ON zumbo.product_images(product_id, sort_order);

ALTER TABLE zumbo.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_product_images_public_read" ON zumbo.product_images
  FOR SELECT USING (true);

CREATE POLICY "zumbo_product_images_staff_write" ON zumbo.product_images
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.product_videos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.product_videos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  thumbnail  TEXT,
  title      TEXT,
  sort_order INT  NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.product_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_product_videos_public_read" ON zumbo.product_videos
  FOR SELECT USING (true);

CREATE POLICY "zumbo_product_videos_staff_write" ON zumbo.product_videos
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.product_specifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.product_specifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,   -- ex: 'Ecrã', 'Câmera', 'Bateria'
  spec_key   TEXT NOT NULL,   -- ex: 'Resolução'
  spec_value TEXT NOT NULL,   -- ex: '2400×1080 px'
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_zumbo_specs_product ON zumbo.product_specifications(product_id);

ALTER TABLE zumbo.product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_specs_public_read"  ON zumbo.product_specifications FOR SELECT USING (true);
CREATE POLICY "zumbo_specs_staff_write"  ON zumbo.product_specifications
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.product_variants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  sku        TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,          -- ex: 'Preto / 128GB'
  price      NUMERIC(12,2),          -- override do preço base
  sale_price NUMERIC(12,2),
  stock      INT  NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url  TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_variants_product ON zumbo.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_variants_sku     ON zumbo.product_variants(sku);

ALTER TABLE zumbo.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_variants_public_read" ON zumbo.product_variants
  FOR SELECT USING (is_active = true);

CREATE POLICY "zumbo_variants_staff_read" ON zumbo.product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_variants_staff_write" ON zumbo.product_variants
  FOR ALL USING (zumbo.has_permission('products','create'));

CREATE TRIGGER trg_zumbo_variants_updated_at
  BEFORE UPDATE ON zumbo.product_variants
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.variant_attribute_values  (M2M)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.variant_attribute_values (
  variant_id         UUID NOT NULL REFERENCES zumbo.product_variants(id) ON DELETE CASCADE,
  attribute_value_id UUID NOT NULL REFERENCES zumbo.attribute_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, attribute_value_id)
);

ALTER TABLE zumbo.variant_attribute_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_vav_public_read"  ON zumbo.variant_attribute_values FOR SELECT USING (true);
CREATE POLICY "zumbo_vav_staff_write"  ON zumbo.variant_attribute_values
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.product_relations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.product_relations (
  product_id         UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  relation_type      TEXT NOT NULL DEFAULT 'related'
                       CHECK (relation_type IN ('related','upsell','cross_sell','bundle')),
  PRIMARY KEY (product_id, related_product_id)
);

ALTER TABLE zumbo.product_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_relations_public_read" ON zumbo.product_relations FOR SELECT USING (true);
CREATE POLICY "zumbo_relations_staff_write" ON zumbo.product_relations
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TRIGGER: actualizar avg_rating e total_reviews no produto
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION zumbo.update_product_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE zumbo.products SET
    avg_rating   = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM zumbo.reviews WHERE product_id = NEW.product_id AND is_approved = true), 0),
    total_reviews = (SELECT COUNT(*) FROM zumbo.reviews WHERE product_id = NEW.product_id AND is_approved = true),
    updated_at   = NOW()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

-- STORAGE: bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('zumbo-products','zumbo-products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "zumbo_products_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'zumbo-products');

CREATE POLICY "zumbo_products_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'zumbo-products'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_products_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'zumbo-products'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('manager','admin','superadmin'))
  );

-- STORAGE: bucket para logos de marcas e categorias
INSERT INTO storage.buckets (id, name, public)
VALUES ('zumbo-catalog','zumbo-catalog', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "zumbo_catalog_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'zumbo-catalog');

CREATE POLICY "zumbo_catalog_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'zumbo-catalog'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('manager','admin','superadmin'))
  );

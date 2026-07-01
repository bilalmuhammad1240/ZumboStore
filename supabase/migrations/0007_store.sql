-- =============================================================================
-- ZUMBO STORE — Migration 0007
-- Sprint 3 · Módulos 9–12: Banners, Favoritos, Carrinho, Logs de Pesquisa
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.banners  (Home Page — Módulo 9)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.banners (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  subtitle         TEXT,
  image_url        TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url         TEXT,
  position         TEXT NOT NULL DEFAULT 'home_hero'
                     CHECK (position IN ('home_hero','home_middle','category','sidebar')),
  sort_order       INT  NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at        TIMESTAMPTZ,
  ends_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_banners_position ON zumbo.banners(position, is_active, sort_order);

ALTER TABLE zumbo.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_banners_public_read" ON zumbo.banners
  FOR SELECT USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at   IS NULL OR ends_at   >= NOW())
  );

CREATE POLICY "zumbo_banners_admin_read" ON zumbo.banners
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_banners_staff_write" ON zumbo.banners
  FOR ALL USING (zumbo.has_permission('marketing','create'));

CREATE TRIGGER trg_zumbo_banners_updated_at
  BEFORE UPDATE ON zumbo.banners
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- Storage bucket para banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('zumbo-banners','zumbo-banners', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "zumbo_banners_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'zumbo-banners');

CREATE POLICY "zumbo_banners_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'zumbo-banners'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('manager','admin','superadmin'))
  );

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.wishlists  (Módulo 11 — Favoritos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.wishlists (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES zumbo.user_profiles(id) ON DELETE CASCADE,
  product_id         UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES zumbo.product_variants(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_zumbo_wishlists_user ON zumbo.wishlists(user_id);

ALTER TABLE zumbo.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_wishlists_self" ON zumbo.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.carts  (Módulo 12 — Carrinho)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES zumbo.user_profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  coupon_id  UUID,                     -- FK adicionada no módulo de cupons
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_zumbo_carts_user    ON zumbo.carts(user_id)    WHERE user_id    IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zumbo_carts_session ON zumbo.carts(session_id) WHERE session_id IS NOT NULL;

ALTER TABLE zumbo.carts ENABLE ROW LEVEL SECURITY;

-- Utilizador autenticado gere o seu carrinho
CREATE POLICY "zumbo_carts_self" ON zumbo.carts
  FOR ALL USING (
    auth.uid() = user_id
    OR session_id = current_setting('request.jwt.claims', true)::jsonb->>'session_id'
  );

CREATE TRIGGER trg_zumbo_carts_updated_at
  BEFORE UPDATE ON zumbo.carts
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.cart_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.cart_items (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id            UUID NOT NULL REFERENCES zumbo.carts(id) ON DELETE CASCADE,
  product_id         UUID NOT NULL REFERENCES zumbo.products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES zumbo.product_variants(id) ON DELETE SET NULL,
  quantity           INT  NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price         NUMERIC(12,2) NOT NULL,   -- snapshot do preço
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, product_id, product_variant_id)
);

CREATE INDEX IF NOT EXISTS idx_zumbo_cart_items_cart ON zumbo.cart_items(cart_id);

ALTER TABLE zumbo.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_cart_items_via_cart" ON zumbo.cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM zumbo.carts c
      WHERE c.id = cart_id
        AND (c.user_id = auth.uid() OR c.session_id IS NOT NULL)
    )
  );

CREATE TRIGGER trg_zumbo_cart_items_updated_at
  BEFORE UPDATE ON zumbo.cart_items
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.search_logs  (Módulo 10 — Pesquisa)
--
-- NOTA DE ARQUITECTURA: tabela particionada por RANGE (created_at).
-- Em PostgreSQL, o PRIMARY KEY de uma tabela particionada deve incluir
-- TODAS as colunas de particionamento — por isso o PK é (id, created_at)
-- e não apenas (id). O índice UNIQUE em id garante unicidade global.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.search_logs (
  id         UUID         NOT NULL DEFAULT gen_random_uuid(),
  user_id    UUID         REFERENCES zumbo.user_profiles(id) ON DELETE SET NULL,
  query      TEXT         NOT NULL,
  results    INT          NOT NULL DEFAULT 0,
  clicked_id UUID         REFERENCES zumbo.products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  -- PK composta obrigatória em tabelas particionadas por created_at
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Índice para lookup por id sem precisar saber a partição
CREATE INDEX IF NOT EXISTS idx_zumbo_search_logs_id    ON zumbo.search_logs(id);
CREATE INDEX IF NOT EXISTS idx_zumbo_search_logs_query ON zumbo.search_logs(query);
CREATE INDEX IF NOT EXISTS idx_zumbo_search_logs_user  ON zumbo.search_logs(user_id) WHERE user_id IS NOT NULL;

-- Partições por ano — adicionar nova partição manualmente em cada ano
-- ou via pg_partman (futuro)
CREATE TABLE IF NOT EXISTS zumbo.search_logs_2025
  PARTITION OF zumbo.search_logs
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS zumbo.search_logs_2026
  PARTITION OF zumbo.search_logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE IF NOT EXISTS zumbo.search_logs_2027
  PARTITION OF zumbo.search_logs
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');

ALTER TABLE zumbo.search_logs ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode registar uma pesquisa (anónimo ou autenticado)
CREATE POLICY "zumbo_search_logs_insert" ON zumbo.search_logs
  FOR INSERT WITH CHECK (true);

-- Apenas staff com acesso a relatórios lê os logs
CREATE POLICY "zumbo_search_logs_staff_read" ON zumbo.search_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid()
      AND role IN ('manager','admin','superadmin'))
  );

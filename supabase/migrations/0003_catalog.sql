-- =============================================================================
-- ZUMBO STORE — Migration 0003
-- Sprint 2 · Módulos 3 e 4: Categorias, Marcas e Atributos
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.categories  (hierarquia infinita via parent_id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.categories (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id        UUID REFERENCES zumbo.categories(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  image_url        TEXT,
  icon             TEXT,
  sort_order       INT  NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_categories_parent ON zumbo.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_categories_slug   ON zumbo.categories(slug);
CREATE INDEX IF NOT EXISTS idx_zumbo_categories_active ON zumbo.categories(is_active, sort_order);

ALTER TABLE zumbo.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_categories_public_read" ON zumbo.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "zumbo_categories_admin_read" ON zumbo.categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_categories_staff_write" ON zumbo.categories
  FOR ALL USING (zumbo.has_permission('products','create'));

CREATE TRIGGER trg_zumbo_categories_updated_at
  BEFORE UPDATE ON zumbo.categories
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- Categorias iniciais da Zumbo Store
INSERT INTO zumbo.categories (name, slug, icon, sort_order) VALUES
  ('Eletrônicos',         'eletronicos',    '📱', 1),
  ('Informática',         'informatica',    '💻', 2),
  ('Eletrodomésticos',    'eletrodomesticos','🏠', 3),
  ('Moda Masculina',      'moda-masculina', '👔', 4),
  ('Moda Feminina',       'moda-feminina',  '👗', 5),
  ('Calçados',            'calcados',       '👟', 6),
  ('Beleza',              'beleza',         '💄', 7),
  ('Casa e Escritório',   'casa-escritorio','🪑', 8)
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias de Eletrônicos
WITH parent AS (SELECT id FROM zumbo.categories WHERE slug = 'eletronicos')
INSERT INTO zumbo.categories (parent_id, name, slug, sort_order)
SELECT p.id, sub.name, sub.slug, sub.sort_order FROM parent p,
  (VALUES
    ('Smartphones',   'smartphones',   1),
    ('Tablets',       'tablets',       2),
    ('Smartwatches',  'smartwatches',  3),
    ('Auscultadores', 'auscultadores', 4),
    ('Powerbanks',    'powerbanks',    5),
    ('Carregadores',  'carregadores',  6),
    ('Consolas',      'consolas',      7)
  ) AS sub(name, slug, sort_order)
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias de Informática
WITH parent AS (SELECT id FROM zumbo.categories WHERE slug = 'informatica')
INSERT INTO zumbo.categories (parent_id, name, slug, sort_order)
SELECT p.id, sub.name, sub.slug, sub.sort_order FROM parent p,
  (VALUES
    ('Laptops',     'laptops',     1),
    ('Computadores','computadores',2),
    ('Monitores',   'monitores',   3),
    ('Impressoras', 'impressoras', 4),
    ('Teclados',    'teclados',    5),
    ('Ratos',       'ratos',       6),
    ('Redes',       'redes',       7)
  ) AS sub(name, slug, sort_order)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.brands
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.brands (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  logo_url         TEXT,
  description      TEXT,
  website          TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INT NOT NULL DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_brands_slug   ON zumbo.brands(slug);
CREATE INDEX IF NOT EXISTS idx_zumbo_brands_active ON zumbo.brands(is_active, sort_order);

ALTER TABLE zumbo.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_brands_public_read" ON zumbo.brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "zumbo_brands_admin_read" ON zumbo.brands
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('operator','manager','admin','superadmin'))
  );

CREATE POLICY "zumbo_brands_staff_write" ON zumbo.brands
  FOR ALL USING (zumbo.has_permission('products','create'));

CREATE TRIGGER trg_zumbo_brands_updated_at
  BEFORE UPDATE ON zumbo.brands
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- Marcas iniciais
INSERT INTO zumbo.brands (name, slug, sort_order) VALUES
  ('Samsung',  'samsung',  1),
  ('Apple',    'apple',    2),
  ('Tecno',    'tecno',    3),
  ('Infinix',  'infinix',  4),
  ('Itel',     'itel',     5),
  ('Xiaomi',   'xiaomi',   6),
  ('Hisense',  'hisense',  7),
  ('LG',       'lg',       8),
  ('Sony',     'sony',     9),
  ('Nike',     'nike',     10),
  ('Adidas',   'adidas',   11),
  ('Puma',     'puma',     12)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.attributes  (Cor, Tamanho, Capacidade…)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.attributes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  type       TEXT NOT NULL DEFAULT 'select'
               CHECK (type IN ('select','color','size','boolean')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_attributes_public_read" ON zumbo.attributes
  FOR SELECT USING (true);

CREATE POLICY "zumbo_attributes_staff_write" ON zumbo.attributes
  FOR ALL USING (zumbo.has_permission('products','create'));

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.attribute_values  (Preto, Branco, 128GB…)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.attribute_values (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID NOT NULL REFERENCES zumbo.attributes(id) ON DELETE CASCADE,
  value        TEXT NOT NULL,
  color_hex    TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zumbo_attr_values_attr ON zumbo.attribute_values(attribute_id);

ALTER TABLE zumbo.attribute_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_attr_values_public_read" ON zumbo.attribute_values
  FOR SELECT USING (true);

CREATE POLICY "zumbo_attr_values_staff_write" ON zumbo.attribute_values
  FOR ALL USING (zumbo.has_permission('products','create'));

-- Atributos e valores iniciais
INSERT INTO zumbo.attributes (name, slug, type) VALUES
  ('Cor',        'cor',        'color'),
  ('Tamanho',    'tamanho',    'size'),
  ('Capacidade', 'capacidade', 'select'),
  ('RAM',        'ram',        'select')
ON CONFLICT (slug) DO NOTHING;

WITH cor AS (SELECT id FROM zumbo.attributes WHERE slug = 'cor')
INSERT INTO zumbo.attribute_values (attribute_id, value, color_hex, sort_order)
SELECT cor.id, v.value, v.hex, v.ord FROM cor,
  (VALUES ('Preto','#000000',1),('Branco','#FFFFFF',2),('Azul','#0000FF',3),
          ('Vermelho','#FF0000',4),('Verde','#00A651',5),('Dourado','#FFD700',6)) AS v(value,hex,ord)
ON CONFLICT DO NOTHING;

WITH tam AS (SELECT id FROM zumbo.attributes WHERE slug = 'tamanho')
INSERT INTO zumbo.attribute_values (attribute_id, value, sort_order)
SELECT tam.id, v.value, v.ord FROM tam,
  (VALUES ('XS',1),('S',2),('M',3),('L',4),('XL',5),('XXL',6),
          ('36',7),('37',8),('38',9),('39',10),('40',11),('41',12),('42',13),('43',14),('44',15),('45',16)) AS v(value,ord)
ON CONFLICT DO NOTHING;

WITH cap AS (SELECT id FROM zumbo.attributes WHERE slug = 'capacidade')
INSERT INTO zumbo.attribute_values (attribute_id, value, sort_order)
SELECT cap.id, v.value, v.ord FROM cap,
  (VALUES ('64GB',1),('128GB',2),('256GB',3),('512GB',4),('1TB',5)) AS v(value,ord)
ON CONFLICT DO NOTHING;

WITH ram AS (SELECT id FROM zumbo.attributes WHERE slug = 'ram')
INSERT INTO zumbo.attribute_values (attribute_id, value, sort_order)
SELECT ram.id, v.value, v.ord FROM ram,
  (VALUES ('4GB',1),('6GB',2),('8GB',3),('12GB',4),('16GB',5)) AS v(value,ord)
ON CONFLICT DO NOTHING;

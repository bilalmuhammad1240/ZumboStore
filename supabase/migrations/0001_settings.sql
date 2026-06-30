-- =============================================================================
-- ZUMBO STORE — Migration 0001
-- Módulo 1: Configuração Base + Autenticação
-- Schema: zumbo
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  value       JSONB NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_settings_public_read" ON zumbo.settings
  FOR SELECT USING (true);

CREATE POLICY "zumbo_settings_admin_write" ON zumbo.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM zumbo.user_profiles
      WHERE id = auth.uid() AND role IN ('admin','superadmin')
    )
  );

INSERT INTO zumbo.settings (key, value, description) VALUES
  ('currency',            '"MZN"',          'Moeda da plataforma'),
  ('timezone',            '"Africa/Maputo"', 'Fuso horário padrão'),
  ('language',            '"pt-MZ"',         'Idioma padrão'),
  ('maintenance_mode',    'false',           'Modo de manutenção'),
  ('email_config',        '{"provider":null,"from_email":"noreply@zumbostore.co.mz","from_name":"Zumbo Store"}', 'Config email'),
  ('payment_config',      '{"mpesa_enabled":false,"emola_enabled":false,"bank_transfer_enabled":true,"pos_enabled":true,"cash_on_delivery_enabled":true}', 'Métodos de pagamento'),
  ('shipping_config',     '{"free_shipping_threshold":null,"default_shipping_cost":150}', 'Config entregas'),
  ('notification_config', '{"email_enabled":false,"sms_enabled":false,"whatsapp_enabled":false,"push_enabled":false}', 'Canais notificação')
ON CONFLICT (key) DO NOTHING;

CREATE TRIGGER trg_zumbo_settings_updated_at
  BEFORE UPDATE ON zumbo.settings
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.company
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.company (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL DEFAULT 'Zumbo Store',
  slogan       TEXT,
  email        TEXT,
  phone        TEXT,
  whatsapp     TEXT,
  address      TEXT,
  city         TEXT,
  province     TEXT,
  country      TEXT NOT NULL DEFAULT 'Moçambique',
  logo_url     TEXT,
  favicon_url  TEXT,
  currency     TEXT NOT NULL DEFAULT 'MZN',
  timezone     TEXT NOT NULL DEFAULT 'Africa/Maputo',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.company ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_company_public_read" ON zumbo.company
  FOR SELECT USING (true);

CREATE POLICY "zumbo_company_admin_write" ON zumbo.company
  FOR ALL USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

INSERT INTO zumbo.company (name, slogan, country, currency, timezone)
VALUES ('Zumbo Store','Compras inteligentes, entregas rápidas.','Moçambique','MZN','Africa/Maputo')
ON CONFLICT DO NOTHING;

CREATE TRIGGER trg_zumbo_company_updated_at
  BEFORE UPDATE ON zumbo.company
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.seo_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.seo_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title       TEXT,
  meta_description TEXT,
  og_image_url     TEXT,
  google_analytics TEXT,
  facebook_pixel   TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_seo_public_read" ON zumbo.seo_settings
  FOR SELECT USING (true);

CREATE POLICY "zumbo_seo_admin_write" ON zumbo.seo_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

INSERT INTO zumbo.seo_settings (meta_title, meta_description)
VALUES (
  'Zumbo Store — Compras inteligentes, entregas rápidas.',
  'A principal loja online de Moçambique. Smartphones, Eletrodomésticos, Moda e muito mais.'
) ON CONFLICT DO NOTHING;

CREATE TRIGGER trg_zumbo_seo_updated_at
  BEFORE UPDATE ON zumbo.seo_settings
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.user_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'customer'
                 CHECK (role IN ('customer','operator','manager','admin','superadmin')),
  full_name    TEXT,
  phone        TEXT,
  avatar_url   TEXT,
  birth_date   DATE,
  gender       TEXT CHECK (gender IN ('M','F','other')),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE zumbo.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_profiles_public_read" ON zumbo.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "zumbo_profiles_self_update" ON zumbo.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "zumbo_profiles_admin_all" ON zumbo.user_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','superadmin'))
  );

-- Trigger: criar profile automaticamente após signup (padrão mozmarkethub)
CREATE OR REPLACE FUNCTION zumbo.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = zumbo AS $$
BEGIN
  INSERT INTO zumbo.user_profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role','customer')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_zumbo_auth_user_created ON auth.users;
CREATE TRIGGER on_zumbo_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION zumbo.handle_new_user();

CREATE TRIGGER trg_zumbo_profiles_updated_at
  BEFORE UPDATE ON zumbo.user_profiles
  FOR EACH ROW EXECUTE FUNCTION zumbo.set_updated_at();

-- ---------------------------------------------------------------------------
-- STORAGE: bucket company-assets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('zumbo-company-assets','zumbo-company-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "zumbo_company_assets_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'zumbo-company-assets');

CREATE POLICY "zumbo_company_assets_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'zumbo-company-assets'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

CREATE POLICY "zumbo_company_assets_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'zumbo-company-assets'
    AND EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

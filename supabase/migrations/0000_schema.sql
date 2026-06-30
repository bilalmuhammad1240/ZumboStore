-- =============================================================================
-- ZUMBO STORE — Migration 0000
-- Criação do schema dedicado "zumbo" no projecto Supabase partilhado.
--
-- APLICAR PRIMEIRO, antes de todas as outras migrations.
--
-- Após aplicar, adicionar "zumbo" em:
--   Supabase Dashboard → Settings → API → Exposed schemas
-- =============================================================================

-- Criar schema isolado para a Zumbo Store
CREATE SCHEMA IF NOT EXISTS zumbo;

-- Garantir que o Supabase Auth tem acesso ao schema
GRANT USAGE ON SCHEMA zumbo TO anon, authenticated, service_role;
GRANT ALL   ON ALL TABLES    IN SCHEMA zumbo TO anon, authenticated, service_role;
GRANT ALL   ON ALL SEQUENCES IN SCHEMA zumbo TO anon, authenticated, service_role;
GRANT ALL   ON ALL ROUTINES  IN SCHEMA zumbo TO anon, authenticated, service_role;

-- Defaults para futuros objectos criados no schema zumbo
ALTER DEFAULT PRIVILEGES IN SCHEMA zumbo
  GRANT ALL ON TABLES    TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA zumbo
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA zumbo
  GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- Função utilitária: updated_at automático (reutilizada por todos os triggers)
CREATE OR REPLACE FUNCTION zumbo.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

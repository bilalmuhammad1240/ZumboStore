-- =============================================================================
-- ZUMBO STORE — Migration 0002
-- Módulo 2: Sessões, Permissões RBAC e função has_permission()
-- Schema: zumbo
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.user_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.user_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES zumbo.user_profiles(id) ON DELETE CASCADE,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_zumbo_sessions_user ON zumbo.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_zumbo_sessions_created ON zumbo.user_sessions(created_at);

ALTER TABLE zumbo.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_sessions_self" ON zumbo.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "zumbo_sessions_admin" ON zumbo.user_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

-- ---------------------------------------------------------------------------
-- TABELA: zumbo.role_permissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zumbo.role_permissions (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role     TEXT NOT NULL CHECK (role IN ('customer','operator','manager','admin','superadmin')),
  resource TEXT NOT NULL,
  action   TEXT NOT NULL CHECK (action IN ('create','read','update','delete','export','approve')),
  UNIQUE(role, resource, action)
);

ALTER TABLE zumbo.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zumbo_permissions_read" ON zumbo.role_permissions
  FOR SELECT USING (true);

CREATE POLICY "zumbo_permissions_superadmin" ON zumbo.role_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM zumbo.user_profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Permissões iniciais
INSERT INTO zumbo.role_permissions (role, resource, action) VALUES
  ('operator','orders','read'),   ('operator','orders','update'),
  ('operator','products','read'), ('operator','stock','read'),
  ('operator','stock','update'),  ('operator','customers','read'),
  ('manager','orders','read'),    ('manager','orders','update'),    ('manager','orders','create'),
  ('manager','products','read'),  ('manager','products','create'),  ('manager','products','update'),
  ('manager','stock','read'),     ('manager','stock','update'),     ('manager','stock','create'),
  ('manager','customers','read'), ('manager','reports','read'),     ('manager','reports','export'),
  ('manager','marketing','read'), ('manager','marketing','create'), ('manager','marketing','update'),
  ('admin','orders','read'),      ('admin','orders','create'),      ('admin','orders','update'),   ('admin','orders','delete'),
  ('admin','products','read'),    ('admin','products','create'),    ('admin','products','update'), ('admin','products','delete'),
  ('admin','stock','read'),       ('admin','stock','create'),       ('admin','stock','update'),    ('admin','stock','delete'),
  ('admin','customers','read'),   ('admin','customers','update'),   ('admin','customers','delete'),
  ('admin','reports','read'),     ('admin','reports','export'),
  ('admin','marketing','read'),   ('admin','marketing','create'),   ('admin','marketing','update'), ('admin','marketing','delete'),
  ('admin','settings','read'),    ('admin','settings','update'),
  ('superadmin','settings','read'),     ('superadmin','settings','update'),  ('superadmin','settings','delete'),
  ('superadmin','permissions','read'),  ('superadmin','permissions','create'),('superadmin','permissions','update'),('superadmin','permissions','delete'),
  ('superadmin','users','read'),        ('superadmin','users','create'),      ('superadmin','users','update'),       ('superadmin','users','delete')
ON CONFLICT (role, resource, action) DO NOTHING;

-- ---------------------------------------------------------------------------
-- FUNÇÃO: zumbo.has_permission()  — usada em RLS policies complexas
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION zumbo.has_permission(p_resource TEXT, p_action TEXT)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM zumbo.user_profiles up
    JOIN zumbo.role_permissions rp ON rp.role = up.role
    WHERE up.id = auth.uid()
      AND rp.resource = p_resource
      AND rp.action   = p_action
  );
$$;

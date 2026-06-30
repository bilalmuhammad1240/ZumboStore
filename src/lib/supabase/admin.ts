import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import type { Database } from "@/types/database.types";
import type { UserRole } from "@/types/auth.types";
import { logger } from "@/lib/utils/logger";

/**
 * Cliente Supabase com service role key — bypassa o RLS completamente.
 * USO EXCLUSIVO no servidor (Server Actions, Route Handlers, admin guards).
 * NUNCA importar em Client Components ou expor ao browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    logger.error("createAdminClient: variáveis de ambiente em falta", {
      hasUrl: Boolean(url),
      hasServiceKey: Boolean(serviceKey),
    });
    throw new Error("Configuração do Supabase Admin incompleta.");
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      // Desactivar persistência de sessão no admin client —
      // cada chamada é stateless e autenticada pela service key.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ---------------------------------------------------------------------------
// Guards de autorização por role
// ---------------------------------------------------------------------------

const ADMIN_ROLES: UserRole[] = ["admin", "superadmin", "manager", "operator"];
const STRICT_ADMIN_ROLES: UserRole[] = ["admin", "superadmin"];

/**
 * Importado pelo mozmarkethub como requireAdmin().
 * Aqui generalizado para suportar múltiplos roles (customer, operator, …).
 *
 * Comportamento:
 *  - Não autenticado  → redirect para /auth/login
 *  - Sem role mínimo  → notFound() (não revela a existência da área)
 *  - OK               → devolve { user, profile }
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const { createClient: createServerClient } = await import(
    "@/lib/supabase/server"
  );
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("requireRole: utilizador não autenticado, a redirecionar");
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    logger.error("requireRole: perfil não encontrado", {
      userId: user.id,
      error: error?.message,
    });
    notFound();
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    logger.warn("requireRole: role insuficiente", {
      userId: user.id,
      role: profile.role,
      required: allowedRoles,
    });
    notFound();
  }

  logger.debug("requireRole: acesso concedido", {
    userId: user.id,
    role: profile.role,
  });

  return { user, profile };
}

/** Qualquer membro da equipa interna (operator, manager, admin, superadmin). */
export async function requireAdmin() {
  return requireRole(ADMIN_ROLES);
}

/** Apenas administradores com acesso total (admin, superadmin). */
export async function requireSuperAdmin() {
  return requireRole(STRICT_ADMIN_ROLES);
}

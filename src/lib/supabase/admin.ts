import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import type { Database } from "@/types/database.types";
import type { UserRole } from "@/types/auth.types";
import { logger } from "@/lib/utils/logger";

/**
 * Cliente admin com service role key — bypassa RLS.
 * Schema "zumbo" definido como padrão.
 * USO EXCLUSIVO em Server Actions e Route Handlers protegidos.
 */
export function createAdminClient() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !svcKey) {
    console.error("[createAdminClient] ERRO: variáveis de ambiente em falta", {
      hasUrl:    Boolean(url),
      hasSvcKey: Boolean(svcKey),
    });
    throw new Error("Configuração do Supabase Admin incompleta.");
  }

  return createClient<Database, "zumbo">(url, svcKey, {
    db:   { schema: "zumbo" },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Guards de autorização
// ---------------------------------------------------------------------------

const ADMIN_ROLES: UserRole[]  = ["admin", "superadmin", "manager", "operator"];
const STRICT_ROLES: UserRole[] = ["admin", "superadmin"];

export async function requireRole(allowedRoles: UserRole[]) {
  const { createClient: createServerClient } = await import("@/lib/supabase/server");
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log("[requireRole] auth.getUser:", { userId: user?.id, authError: authError?.message });

  if (!user) {
    logger.warn("[requireRole] utilizador não autenticado → redirect login");
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  console.log("[requireRole] profile query:", {
    userId:  user.id,
    role:    profile?.role,
    error:   profileError?.message,
    allowed: allowedRoles,
  });

  if (profileError || !profile) {
    logger.error("[requireRole] perfil não encontrado", { userId: user.id, error: profileError?.message });
    notFound();
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    logger.warn("[requireRole] acesso negado", { userId: user.id, role: profile.role, required: allowedRoles });
    notFound();
  }

  logger.info("[requireRole] acesso concedido", { userId: user.id, role: profile.role });
  return { user, profile };
}

export async function requireAdmin()      { return requireRole(ADMIN_ROLES);  }
export async function requireSuperAdmin() { return requireRole(STRICT_ROLES); }

import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { logger } from "@/lib/utils/logger";

/**
 * Callback OAuth do Supabase Auth.
 *
 * Trocado o code pelo token de sessão. Usado em:
 * - Confirmação de email após registo
 * - Links de recuperação de password
 * - OAuth social (Google, etc.) — Fase 2
 *
 * Padrão oficial @supabase/ssr.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/conta";

  // Garantir que o redirect é interno
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/conta";

  if (!code) {
    logger.warn("auth/callback: sem code no URL", { searchParams: searchParams.toString() });
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent("Link inválido ou expirado.")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logger.error("auth/callback: exchangeCodeForSession falhou", {
      code:    error.code,
      message: error.message,
    });
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent("Link expirado. Solicite um novo.")}`
    );
  }

  logger.info("auth/callback: sessão criada, a redirigir", { next: safeNext });
  return NextResponse.redirect(`${origin}${safeNext}`);
}

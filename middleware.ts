import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Definição de rotas protegidas
// ---------------------------------------------------------------------------

/** Rotas que exigem sessão autenticada (qualquer role). */
const AUTHENTICATED_ROUTES = ["/conta", "/checkout"];

/** Rotas que exigem role de equipa interna. */
const STAFF_ROUTES = ["/admin"];

/** Rotas de autenticação — redirigir para /conta se já autenticado. */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

// ---------------------------------------------------------------------------
// Middleware principal
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Renovar sessão Supabase (obrigatório para @supabase/ssr).
  const { supabaseResponse, user } = await updateSession(request);

  // 2. Redirigir utilizadores já autenticados para fora das páginas de auth.
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/conta", request.url));
  }

  // 3. Proteger rotas de clientes autenticados.
  if (!user && AUTHENTICATED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Proteger rotas de staff — verificar role no DB.
  if (STAFF_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Usar o admin client para bypassar o RLS na leitura do role —
      // o user_profiles tem RLS e o middleware corre antes dos Server
      // Components, por isso o user pode ainda não ter cookies válidos.
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
  .from("user_profiles")
  .select("role")
  .eq("id", user.id)
  .single();

const profile = data as Database["public"]["Tables"]["user_profiles"]["Row"] | null;

      const staffRoles = ["operator", "manager", "admin", "superadmin"];
      if (!profile || !staffRoles.includes(profile.role)) {
        // Não revelar a existência da área admin a utilizadores comuns.
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    } catch (err) {
      console.error("[middleware] erro ao verificar role de staff", {
        userId: user.id,
        pathname,
        err,
      });
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Aplicar a todas as rotas EXCEPTO:
     * - _next/static  (assets estáticos)
     * - _next/image   (optimização de imagens)
     * - favicon.ico
     * - ficheiros com extensão (imagens, fonts, etc.)
     * - api/webhooks  (webhooks externos — têm auth própria por HMAC)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

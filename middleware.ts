import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/admin";

const AUTHENTICATED_ROUTES = ["/conta", "/checkout"];
const STAFF_ROUTES         = ["/admin"];
const AUTH_ROUTES          = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[middleware] request:", pathname);

  // 1. Renovar sessão Supabase
  const { supabaseResponse, user } = await updateSession(request);

  console.log("[middleware] user:", user?.id ?? "anonymous");

  // 2. Utilizadores autenticados fora das páginas de auth
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    console.log("[middleware] autenticado → redirect /conta");
    return NextResponse.redirect(new URL("/conta", request.url));
  }

  // 3. Rotas que exigem autenticação
  if (!user && AUTHENTICATED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    console.log("[middleware] não autenticado → redirect login");
    return NextResponse.redirect(loginUrl);
  }

  // 4. Rotas de staff — verificar role
  if (STAFF_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const adminClient = createAdminClient();
      // createAdminClient já usa schema "zumbo" por defeito (db: { schema: "zumbo" })
      const { data: profile, error } = await adminClient
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("[middleware] staff check:", { userId: user.id, role: profile?.role, error: error?.message });

      const staffRoles = ["operator", "manager", "admin", "superadmin"];
      if (!profile || !staffRoles.includes(profile.role)) {
        console.warn("[middleware] acesso negado ao admin:", { userId: user.id, role: profile?.role });
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    } catch (err) {
      console.error("[middleware] erro ao verificar role:", err);
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

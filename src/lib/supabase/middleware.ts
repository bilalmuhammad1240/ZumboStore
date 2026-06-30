import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Mantém a sessão do utilizador actualizada em cada request.
 * Deve ser chamada no middleware.ts antes de qualquer verificação
 * de autenticação ou autorização.
 *
 * Padrão idêntico ao mozmarkethub — não modificar sem ler a doc do
 * @supabase/ssr sobre gestão de cookies em middleware.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // CRÍTICO: este await é obrigatório para que o token de sessão
  // seja refrescado quando expirar. Não remover.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}

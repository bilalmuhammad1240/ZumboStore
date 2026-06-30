import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Cliente Supabase para uso em Server Components, Server Actions e
 * Route Handlers. Lê/escreve cookies para manter a sessão do utilizador
 * sincronizada entre cliente e servidor.
 *
 * IMPORTANTE: Criar uma nova instância por request — nunca partilhar
 * uma instância global no servidor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll chamado a partir de um Server Component (read-only).
            // Pode ser ignorado — o middleware trata de actualizar a sessão.
          }
        },
      },
    }
  );
}

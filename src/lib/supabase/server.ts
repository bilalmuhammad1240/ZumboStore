import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Schema "zumbo" definido como padrão.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database, "zumbo">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado em Server Components read-only — middleware trata da sessão.
          }
        },
      },
    }
  );
}

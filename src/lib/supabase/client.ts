import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Cliente Supabase para Client Components.
 * Schema "zumbo" definido como padrão — todas as queries vão para zumbo.*
 */
export function createClient() {
  return createBrowserClient<Database, "zumbo">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

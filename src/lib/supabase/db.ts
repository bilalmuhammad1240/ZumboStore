import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Helper que devolve o cliente Supabase já ancorado no schema "zumbo".
 *
 * USO EM REPOSITÓRIOS (Server Components, Server Actions):
 *   const db = await serverDB();
 *   const { data } = await db.from("categories").select("*");
 *
 * Requisito Supabase: adicionar "zumbo" em
 *   Dashboard → Settings → API → Exposed schemas
 */
export async function serverDB() {
  const supabase = await createClient();
  return supabase.schema("zumbo");
}

/**
 * Cliente admin (service role) ancorado no schema "zumbo".
 * Bypassa RLS — usar apenas em Server Actions protegidos por requireAdmin().
 */
export function adminDB() {
  return createAdminClient().schema("zumbo");
}

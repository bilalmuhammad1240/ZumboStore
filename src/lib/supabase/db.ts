import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Helper de repositório — cliente server ancorado no schema "zumbo".
 * Os clientes já têm "zumbo" como schema padrão, mas esta função
 * garante consistência e centraliza o ponto de acesso nos repositórios.
 *
 * USO:
 *   const db = await serverDB();
 *   const { data } = await db.from("categories").select("*");
 */
export async function serverDB() {
  const client = await createClient();
  return client.schema("zumbo");
}

/**
 * Admin client (service role) ancorado no schema "zumbo".
 * Bypassa RLS — usar apenas em Server Actions protegidos por requireAdmin().
 */
export function adminDB() {
  return createAdminClient().schema("zumbo");
}

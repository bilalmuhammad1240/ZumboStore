import { createClient } from "@/lib/supabase/server";
import { Bell, LogOut, User } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth";

type Props = {
  title: string;
  description?: string;
};

export async function AdminHeader({ title, description }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileName = "Admin";
  let profileRole = "";

  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      profileName = profile.full_name ?? user.email?.split("@")[0] ?? "Admin";
      profileRole = ROLE_LABELS[profile.role] ?? profile.role;
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Título da página */}
      <div>
        <h1 className="font-heading text-lg font-semibold text-foreground leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Acções do utilizador */}
      <div className="flex items-center gap-3">
        {/* Notificações — placeholder para Módulo 23 */}
        <button
          type="button"
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground leading-none">
              {profileName}
            </p>
            {profileRole && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {profileRole}
              </p>
            )}
          </div>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Terminar sessão"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  );
}

const ROLE_LABELS: Record<string, string> = {
  customer:   "Cliente",
  operator:   "Operador",
  manager:    "Gestor",
  admin:      "Administrador",
  superadmin: "Super Admin",
};

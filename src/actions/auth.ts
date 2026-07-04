"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validators/auth.validator";
import { logger } from "@/lib/utils/logger";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Traduz erros do Supabase Auth para português.
 * Adaptado do mozmarkethub e extendido para cobrir mais casos da Zumbo Store.
 */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "User already registered":
      "Este email já está registado. Tente entrar na sua conta.",
    "Password should be at least 6 characters.":
      "A password deve ter pelo menos 6 caracteres.",
    "Unable to validate email address: invalid format":
      "Formato de email inválido.",
    "Invalid login credentials":
      "Email ou password incorretos.",
    "Email not confirmed":
      "Email ainda não confirmado. Verifique a sua caixa de entrada.",
    "User not found":
      "Conta não encontrada com este email.",
    "New password should be different from the old password.":
      "A nova password deve ser diferente da anterior.",
    "Token has expired or is invalid":
      "O link expirou. Solicite um novo link de recuperação.",
    "Email rate limit exceeded":
      "Demasiadas tentativas. Aguarde alguns minutos e tente novamente.",
  };
  return map[message] ?? "Não foi possível concluir o pedido. Tente novamente.";
}

/** Garante que o redirect é interno — previne open redirect. */
function safeRedirectUrl(next: unknown): string {
  const str = typeof next === "string" ? next.trim() : "";
  return str.startsWith("/") && !str.startsWith("//") ? str : "";
}

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------

export async function login(formData: FormData) {
  const raw = {
    email:    String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    redirect: String(formData.get("redirect") ?? "").trim(),
  };

  const parsed = loginSchema.safeParse(raw);
  const nextUrl = safeRedirectUrl(raw.redirect);

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    const params = new URLSearchParams({ error: firstError ?? "Dados inválidos." });
    if (nextUrl) params.set("redirect", nextUrl);
    redirect(`/auth/login?${params}`);
  }

  const supabase = await createClient();
  console.log("[login] tentativa para:", parsed.data.email);
  const { error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error("[login] falhou:", { email: parsed.data.email, code: error.code, msg: error.message });
    logger.warn("login: falhou", {
      email: parsed.data.email,
      code:  error.code,
      msg:   error.message,
    });
    const params = new URLSearchParams({
      error: translateAuthError(error.message),
    });
    if (nextUrl) params.set("redirect", nextUrl);
    redirect(`/auth/login?${params}`);
  }

  logger.info("login: sucesso", { email: parsed.data.email });
  revalidatePath("/", "layout");
  redirect(nextUrl || "/conta");
}

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------

export async function register(formData: FormData) {
  const raw = {
    full_name:        String(formData.get("full_name") ?? "").trim(),
    email:            String(formData.get("email") ?? "").trim().toLowerCase(),
    phone:            String(formData.get("phone") ?? "").trim(),
    password:         String(formData.get("password") ?? ""),
    confirm_password: String(formData.get("confirm_password") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    redirect(
      `/auth/register?error=${encodeURIComponent(firstError ?? "Dados inválidos.")}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        phone:     parsed.data.phone || null,
        role:      "customer", // trigger handle_new_user usará este valor
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    logger.warn("register: falhou", {
      email: parsed.data.email,
      code:  error.code,
      msg:   error.message,
    });
    redirect(
      `/auth/register?error=${encodeURIComponent(translateAuthError(error.message))}`
    );
  }

  logger.info("register: sucesso", {
    email:       parsed.data.email,
    userId:      data.user?.id,
    hasSession:  Boolean(data.session),
  });

  // Se a confirmação de email estiver desactivada no Supabase (desenvolvimento),
  // o signUp devolve sessão imediata — entrar directamente na conta.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/conta");
  }

  // Email de confirmação enviado.
  redirect(
    `/auth/verificar-email?email=${encodeURIComponent(parsed.data.email)}`
  );
}

// ---------------------------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.error("logout: signOut falhou", {
      code: error.code,
      msg:  error.message,
    });
  } else {
    logger.info("logout: sucesso");
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}

// ---------------------------------------------------------------------------
// RECUPERAR PASSWORD
// ---------------------------------------------------------------------------

export async function forgotPassword(formData: FormData) {
  const raw = { email: String(formData.get("email") ?? "").trim().toLowerCase() };
  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    redirect(
      `/auth/recuperar-senha?error=${encodeURIComponent(firstError ?? "Email inválido.")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/auth/nova-senha`,
    }
  );

  if (error) {
    logger.warn("forgotPassword: falhou", {
      email: parsed.data.email,
      msg:   error.message,
    });
    redirect(
      `/auth/recuperar-senha?error=${encodeURIComponent(translateAuthError(error.message))}`
    );
  }

  logger.info("forgotPassword: email enviado", { email: parsed.data.email });

  // Redirigir para página de sucesso — não revelar se o email existe ou não.
  redirect(
    `/auth/recuperar-senha?success=true&email=${encodeURIComponent(parsed.data.email)}`
  );
}

// ---------------------------------------------------------------------------
// NOVA PASSWORD (após link de reset)
// ---------------------------------------------------------------------------

export async function resetPassword(formData: FormData) {
  const raw = {
    password:         String(formData.get("password") ?? ""),
    confirm_password: String(formData.get("confirm_password") ?? ""),
  };

  const parsed = resetPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    redirect(
      `/auth/nova-senha?error=${encodeURIComponent(firstError ?? "Dados inválidos.")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    logger.warn("resetPassword: falhou", { msg: error.message });
    redirect(
      `/auth/nova-senha?error=${encodeURIComponent(translateAuthError(error.message))}`
    );
  }

  logger.info("resetPassword: sucesso");
  revalidatePath("/", "layout");
  redirect("/auth/login?success=password_reset");
}

import { z } from "zod";

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório.")
    .email("Formato de email inválido."),
  password: z
    .string()
    .min(1, "Password é obrigatória.")
    .min(6, "Password deve ter pelo menos 6 caracteres."),
  redirect: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres.")
      .max(100, "Nome demasiado longo."),
    email: z
      .string()
      .min(1, "Email é obrigatório.")
      .email("Formato de email inválido."),
    phone: z
      .string()
      .min(9, "Telefone inválido.")
      .max(20, "Telefone inválido.")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Password deve ter pelo menos 6 caracteres.")
      .max(72, "Password demasiado longa."),
    confirm_password: z.string().min(1, "Confirme a password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As passwords não coincidem.",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Recuperar password
// ---------------------------------------------------------------------------

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório.")
    .email("Formato de email inválido."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ---------------------------------------------------------------------------
// Nova password (após link de reset)
// ---------------------------------------------------------------------------

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password deve ter pelo menos 6 caracteres.")
      .max(72, "Password demasiado longa."),
    confirm_password: z.string().min(1, "Confirme a nova password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As passwords não coincidem.",
    path: ["confirm_password"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

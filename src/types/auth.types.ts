/**
 * Tipos de autenticação e autorização da Zumbo Store.
 */

export type UserRole =
  | "customer"
  | "operator"
  | "manager"
  | "admin"
  | "superadmin";

export type UserProfile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  gender: "M" | "F" | "other" | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SessionUser = {
  id: string;
  email: string | undefined;
  profile: UserProfile;
};

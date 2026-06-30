/**
 * Tipos gerados automaticamente pelo Supabase CLI.
 *
 * Para regenerar após alterar o schema:
 *   npm run db:types
 *   (equivale a: supabase gen types typescript --local > src/types/database.types.ts)
 *
 * Este ficheiro é um stub inicial — será substituído pelo CLI após
 * a primeira migration ser aplicada.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
      company: {
        Row: {
          id: string;
          name: string;
          slogan: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          city: string | null;
          province: string | null;
          country: string;
          logo_url: string | null;
          favicon_url: string | null;
          currency: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slogan?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          country?: string;
          logo_url?: string | null;
          favicon_url?: string | null;
          currency?: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company"]["Insert"]>;
      };
      seo_settings: {
        Row: {
          id: string;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          google_analytics: string | null;
          facebook_pixel: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          google_analytics?: string | null;
          facebook_pixel?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["seo_settings"]["Insert"]>;
      };
      user_profiles: {
        Row: {
          id: string;
          role: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          gender: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

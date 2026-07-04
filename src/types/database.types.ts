/**
 * Tipos do schema Supabase — Zumbo Store
 *
 * Todas as tabelas vivem no schema "zumbo" (projecto Supabase partilhado).
 * Regenerar com:
 *   supabase gen types typescript --schema zumbo --local > src/types/database.types.ts
 *
 * O stub abaixo é suficiente para o build enquanto o schema não estiver
 * totalmente estabilizado. Após aplicar todas as migrations, regenerar.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Tipo principal — schema "zumbo" declarado explicitamente
// ---------------------------------------------------------------------------

export type Database = {
  zumbo: {
    Tables: {
      settings: {
        Row:    { id: string; key: string; value: Json; description: string | null; updated_at: string };
        Insert: { id?: string; key: string; value: Json; description?: string | null; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["settings"]["Insert"]>;
      };
      company: {
        Row: {
          id: string; name: string; slogan: string | null; email: string | null;
          phone: string | null; whatsapp: string | null; address: string | null;
          city: string | null; province: string | null; country: string;
          logo_url: string | null; favicon_url: string | null;
          currency: string; timezone: string; updated_at: string;
        };
        Insert: Partial<Database["zumbo"]["Tables"]["company"]["Row"]> & { name: string };
        Update: Partial<Database["zumbo"]["Tables"]["company"]["Row"]>;
      };
      seo_settings: {
        Row: {
          id: string; meta_title: string | null; meta_description: string | null;
          og_image_url: string | null; google_analytics: string | null;
          facebook_pixel: string | null; updated_at: string;
        };
        Insert: Partial<Database["zumbo"]["Tables"]["seo_settings"]["Row"]>;
        Update: Partial<Database["zumbo"]["Tables"]["seo_settings"]["Row"]>;
      };
      user_profiles: {
        Row: {
          id: string; role: string; full_name: string | null; phone: string | null;
          avatar_url: string | null; birth_date: string | null;
          gender: string | null; is_active: boolean;
          created_at: string; updated_at: string;
        };
        Insert: { id: string; role?: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; birth_date?: string | null; gender?: string | null; is_active?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["user_profiles"]["Insert"]>;
      };
      user_sessions: {
        Row:    { id: string; user_id: string; ip_address: string | null; user_agent: string | null; created_at: string; expires_at: string | null };
        Insert: Omit<Database["zumbo"]["Tables"]["user_sessions"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["user_sessions"]["Insert"]>;
      };
      role_permissions: {
        Row:    { id: string; role: string; resource: string; action: string };
        Insert: Omit<Database["zumbo"]["Tables"]["role_permissions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["zumbo"]["Tables"]["role_permissions"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string; parent_id: string | null; name: string; slug: string;
          description: string | null; image_url: string | null; icon: string | null;
          sort_order: number; is_active: boolean;
          meta_title: string | null; meta_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["categories"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["categories"]["Insert"]>;
      };
      brands: {
        Row: {
          id: string; name: string; slug: string; logo_url: string | null;
          description: string | null; website: string | null; is_active: boolean;
          sort_order: number; meta_title: string | null; meta_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["brands"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["brands"]["Insert"]>;
      };
      attributes: {
        Row:    { id: string; name: string; slug: string; type: string; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["attributes"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["attributes"]["Insert"]>;
      };
      attribute_values: {
        Row:    { id: string; attribute_id: string; value: string; color_hex: string | null; sort_order: number; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["attribute_values"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["attribute_values"]["Insert"]>;
      };
      products: {
        Row: {
          id: string; category_id: string | null; brand_id: string | null;
          name: string; slug: string; sku: string; internal_code: string | null;
          barcode: string | null; description: string | null; short_description: string | null;
          price: number; sale_price: number | null; cost_price: number | null;
          weight_kg: number | null; width_cm: number | null; height_cm: number | null; depth_cm: number | null;
          status: string; is_featured: boolean; is_new: boolean; has_variants: boolean;
          warranty_months: number; meta_title: string | null; meta_description: string | null;
          total_sold: number; total_reviews: number; avg_rating: number; views_count: number;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at" | "total_sold" | "total_reviews" | "avg_rating" | "views_count"> & { id?: string; created_at?: string; updated_at?: string; total_sold?: number; total_reviews?: number; avg_rating?: number; views_count?: number };
        Update: Partial<Database["zumbo"]["Tables"]["products"]["Insert"]>;
      };
      product_images: {
        Row:    { id: string; product_id: string; url: string; alt_text: string | null; sort_order: number; is_primary: boolean; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["product_images"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["product_images"]["Insert"]>;
      };
      product_videos: {
        Row:    { id: string; product_id: string; url: string; thumbnail: string | null; title: string | null; sort_order: number; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["product_videos"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["product_videos"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string; product_id: string; sku: string; name: string;
          price: number | null; sale_price: number | null; stock: number;
          image_url: string | null; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["product_variants"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_specifications: {
        Row:    { id: string; product_id: string; group_name: string; spec_key: string; spec_value: string; sort_order: number };
        Insert: Omit<Database["zumbo"]["Tables"]["product_specifications"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["zumbo"]["Tables"]["product_specifications"]["Insert"]>;
      };
      variant_attribute_values: {
        Row:    { variant_id: string; attribute_value_id: string };
        Insert: Database["zumbo"]["Tables"]["variant_attribute_values"]["Row"];
        Update: Partial<Database["zumbo"]["Tables"]["variant_attribute_values"]["Row"]>;
      };
      product_relations: {
        Row:    { product_id: string; related_product_id: string; relation_type: string };
        Insert: Database["zumbo"]["Tables"]["product_relations"]["Row"];
        Update: Partial<Database["zumbo"]["Tables"]["product_relations"]["Row"]>;
      };
      stock: {
        Row: {
          id: string; product_id: string; product_variant_id: string | null;
          quantity: number; reserved: number; min_alert: number;
          location: string | null; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["stock"]["Row"], "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["stock"]["Insert"]>;
      };
      stock_movements: {
        Row: {
          id: string; product_id: string; product_variant_id: string | null;
          type: string; quantity: number; quantity_before: number; quantity_after: number;
          reason: string | null; reference_id: string | null; reference_type: string | null;
          created_by: string | null; created_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["stock_movements"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["stock_movements"]["Insert"]>;
      };
      suppliers: {
        Row: {
          id: string; name: string; email: string | null; phone: string | null;
          whatsapp: string | null; address: string | null; city: string | null;
          country: string; contact_person: string | null; payment_terms: string | null;
          notes: string | null; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["suppliers"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["suppliers"]["Insert"]>;
      };
      purchase_orders: {
        Row: {
          id: string; supplier_id: string; status: string; notes: string | null;
          expected_date: string | null; received_date: string | null;
          total_amount: number; created_by: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["purchase_orders"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["purchase_orders"]["Insert"]>;
      };
      purchase_items: {
        Row: {
          id: string; purchase_order_id: string; product_id: string;
          product_variant_id: string | null; quantity_ordered: number;
          quantity_received: number; unit_cost: number; total_cost: number;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["purchase_items"]["Row"], "id" | "total_cost"> & { id?: string };
        Update: Partial<Database["zumbo"]["Tables"]["purchase_items"]["Insert"]>;
      };
      banners: {
        Row: {
          id: string; title: string; subtitle: string | null; image_url: string;
          mobile_image_url: string | null; link_url: string | null; position: string;
          sort_order: number; is_active: boolean; starts_at: string | null;
          ends_at: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["banners"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["banners"]["Insert"]>;
      };
      wishlists: {
        Row:    { id: string; user_id: string; product_id: string; product_variant_id: string | null; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["wishlists"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["wishlists"]["Insert"]>;
      };
      carts: {
        Row:    { id: string; user_id: string | null; session_id: string | null; coupon_id: string | null; created_at: string; updated_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["carts"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["carts"]["Insert"]>;
      };
      cart_items: {
        Row: {
          id: string; cart_id: string; product_id: string;
          product_variant_id: string | null; quantity: number;
          unit_price: number; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["zumbo"]["Tables"]["cart_items"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["cart_items"]["Insert"]>;
      };
      search_logs: {
        Row:    { id: string; user_id: string | null; query: string; results: number; clicked_id: string | null; created_at: string };
        Insert: Omit<Database["zumbo"]["Tables"]["search_logs"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["zumbo"]["Tables"]["search_logs"]["Insert"]>;
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
};

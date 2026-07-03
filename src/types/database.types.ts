/**
 * Tipos gerados a partir das migrations em supabase/migrations/*.sql.
 *
 * IMPORTANTE: quase todas as tabelas da Zumbo Store vivem no schema
 * "zumbo" (ver 0000_schema.sql), NÃO no schema "public". Só o schema
 * "public" é usado por defeito pelo cliente Supabase — por isso todo
 * o acesso a dados de negócio passa por `serverDB()` / `adminDB()`
 * (src/lib/supabase/db.ts), que fazem `.schema("zumbo")`.
 *
 * Para regenerar após alterar o schema (requer Supabase CLI + projecto
 * ligado):
 *   npx supabase gen types typescript --project-id <ref> --schema zumbo,public > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // O schema "public" não tem tabelas de negócio nesta aplicação —
  // mantido apenas porque é o schema por omissão do supabase-js/ssr.
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };

  zumbo: {
    Tables: {
      // -----------------------------------------------------------------
      // 0001_settings.sql
      // -----------------------------------------------------------------
      user_profiles: {
        Row: {
          id: string;
          role: "customer" | "operator" | "manager" | "admin" | "superadmin";
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          gender: "M" | "F" | "other" | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "customer" | "operator" | "manager" | "admin" | "superadmin";
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          gender?: "M" | "F" | "other" | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["user_profiles"]["Insert"]>;
      };

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
        Update: Partial<Database["zumbo"]["Tables"]["settings"]["Insert"]>;
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
          name?: string;
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
        Update: Partial<Database["zumbo"]["Tables"]["company"]["Insert"]>;
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
        Update: Partial<Database["zumbo"]["Tables"]["seo_settings"]["Insert"]>;
      };

      // -----------------------------------------------------------------
      // 0002_auth.sql
      // -----------------------------------------------------------------
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: Partial<Database["zumbo"]["Tables"]["user_sessions"]["Insert"]>;
      };

      role_permissions: {
        Row: {
          id: string;
          role: "customer" | "operator" | "manager" | "admin" | "superadmin";
          resource: string;
          action: "create" | "read" | "update" | "delete" | "export" | "approve";
        };
        Insert: {
          id?: string;
          role: "customer" | "operator" | "manager" | "admin" | "superadmin";
          resource: string;
          action: "create" | "read" | "update" | "delete" | "export" | "approve";
        };
        Update: Partial<Database["zumbo"]["Tables"]["role_permissions"]["Insert"]>;
      };

      // -----------------------------------------------------------------
      // 0003_catalog.sql
      // -----------------------------------------------------------------
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["categories"]["Insert"]>;
      };

      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          website: string | null;
          is_active: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          description?: string | null;
          website?: string | null;
          is_active?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["brands"]["Insert"]>;
      };

      attributes: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: "select" | "color" | "size" | "boolean";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type?: "select" | "color" | "size" | "boolean";
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["attributes"]["Insert"]>;
      };

      attribute_values: {
        Row: {
          id: string;
          attribute_id: string;
          value: string;
          color_hex: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          attribute_id: string;
          value: string;
          color_hex?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["attribute_values"]["Insert"]>;
      };

      // -----------------------------------------------------------------
      // 0004_products.sql
      // -----------------------------------------------------------------
      products: {
        Row: {
          id: string;
          category_id: string | null;
          brand_id: string | null;
          name: string;
          slug: string;
          sku: string;
          internal_code: string | null;
          barcode: string | null;
          description: string | null;
          short_description: string | null;
          price: number;
          sale_price: number | null;
          cost_price: number | null;
          weight_kg: number | null;
          width_cm: number | null;
          height_cm: number | null;
          depth_cm: number | null;
          status: "draft" | "active" | "archived" | "out_of_stock";
          is_featured: boolean;
          is_new: boolean;
          has_variants: boolean;
          warranty_months: number;
          meta_title: string | null;
          meta_description: string | null;
          total_sold: number;
          total_reviews: number;
          avg_rating: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          name: string;
          slug: string;
          sku: string;
          internal_code?: string | null;
          barcode?: string | null;
          description?: string | null;
          short_description?: string | null;
          price: number;
          sale_price?: number | null;
          cost_price?: number | null;
          weight_kg?: number | null;
          width_cm?: number | null;
          height_cm?: number | null;
          depth_cm?: number | null;
          status?: "draft" | "active" | "archived" | "out_of_stock";
          is_featured?: boolean;
          is_new?: boolean;
          has_variants?: boolean;
          warranty_months?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          total_sold?: number;
          total_reviews?: number;
          avg_rating?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["products"]["Insert"]>;
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["product_images"]["Insert"]>;
      };

      product_videos: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          thumbnail: string | null;
          title: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          thumbnail?: string | null;
          title?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["product_videos"]["Insert"]>;
      };

      product_specifications: {
        Row: {
          id: string;
          product_id: string;
          group_name: string;
          spec_key: string;
          spec_value: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          group_name: string;
          spec_key: string;
          spec_value: string;
          sort_order?: number;
        };
        Update: Partial<Database["zumbo"]["Tables"]["product_specifications"]["Insert"]>;
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          name: string;
          price: number | null;
          sale_price: number | null;
          stock: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          name: string;
          price?: number | null;
          sale_price?: number | null;
          stock?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["product_variants"]["Insert"]>;
      };

      variant_attribute_values: {
        Row: {
          variant_id: string;
          attribute_value_id: string;
        };
        Insert: {
          variant_id: string;
          attribute_value_id: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["variant_attribute_values"]["Insert"]>;
      };

      product_relations: {
        Row: {
          product_id: string;
          related_product_id: string;
          relation_type: "related" | "upsell" | "cross_sell" | "bundle";
        };
        Insert: {
          product_id: string;
          related_product_id: string;
          relation_type?: "related" | "upsell" | "cross_sell" | "bundle";
        };
        Update: Partial<Database["zumbo"]["Tables"]["product_relations"]["Insert"]>;
      };

      // -----------------------------------------------------------------
      // 0005_stock.sql
      // -----------------------------------------------------------------
      stock: {
        Row: {
          id: string;
          product_id: string;
          product_variant_id: string | null;
          quantity: number;
          reserved: number;
          min_alert: number;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_variant_id?: string | null;
          quantity?: number;
          reserved?: number;
          min_alert?: number;
          location?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["stock"]["Insert"]>;
      };

      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          product_variant_id: string | null;
          type: "entry" | "exit" | "adjustment" | "loss" | "inventory" | "return";
          quantity: number;
          quantity_before: number;
          quantity_after: number;
          reason: string | null;
          reference_id: string | null;
          reference_type: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_variant_id?: string | null;
          type: "entry" | "exit" | "adjustment" | "loss" | "inventory" | "return";
          quantity: number;
          quantity_before: number;
          quantity_after: number;
          reason?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["stock_movements"]["Insert"]>;
      };

      // -----------------------------------------------------------------
      // 0006_suppliers.sql
      // -----------------------------------------------------------------
      suppliers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          city: string | null;
          country: string;
          contact_person: string | null;
          payment_terms: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          contact_person?: string | null;
          payment_terms?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["suppliers"]["Insert"]>;
      };

      purchase_orders: {
        Row: {
          id: string;
          supplier_id: string;
          status: "draft" | "sent" | "partial" | "received" | "cancelled";
          notes: string | null;
          expected_date: string | null;
          received_date: string | null;
          total_amount: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          status?: "draft" | "sent" | "partial" | "received" | "cancelled";
          notes?: string | null;
          expected_date?: string | null;
          received_date?: string | null;
          total_amount?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["purchase_orders"]["Insert"]>;
      };

      purchase_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_id: string;
          product_variant_id: string | null;
          quantity_ordered: number;
          quantity_received: number;
          unit_cost: number;
          total_cost: number;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          product_id: string;
          product_variant_id?: string | null;
          quantity_ordered: number;
          quantity_received?: number;
          unit_cost: number;
          // total_cost é GENERATED ALWAYS pela BD — nunca enviar no insert.
        };
        Update: Partial<Omit<Database["zumbo"]["Tables"]["purchase_items"]["Insert"], "purchase_order_id" | "product_id">>;
      };

      // -----------------------------------------------------------------
      // 0007_store.sql
      // -----------------------------------------------------------------
      banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string;
          mobile_image_url: string | null;
          link_url: string | null;
          position: "home_hero" | "home_middle" | "category" | "sidebar";
          sort_order: number;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          image_url: string;
          mobile_image_url?: string | null;
          link_url?: string | null;
          position?: "home_hero" | "home_middle" | "category" | "sidebar";
          sort_order?: number;
          is_active?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["banners"]["Insert"]>;
      };

      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_variant_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_variant_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["wishlists"]["Insert"]>;
      };

      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          coupon_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          coupon_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["carts"]["Insert"]>;
      };

      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          product_variant_id: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          product_variant_id?: string | null;
          quantity?: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["cart_items"]["Insert"]>;
      };

      search_logs: {
        Row: {
          id: string;
          user_id: string | null;
          query: string;
          results: number;
          clicked_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          query: string;
          results?: number;
          clicked_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["zumbo"]["Tables"]["search_logs"]["Insert"]>;
      };
    };

    Views: {
      // View criada em 0005_stock.sql — só leitura.
      stock_alert: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          product_sku: string;
          product_variant_id: string | null;
          variant_name: string | null;
          quantity: number;
          reserved: number;
          min_alert: number;
          location: string | null;
          updated_at: string;
        };
      };
    };

    Functions: {
      // Função SQL usada nas policies RLS; pode também ser chamada via
      // supabase.schema("zumbo").rpc("has_permission", {...}).
      has_permission: {
        Args: { p_resource: string; p_action: string };
        Returns: boolean;
      };
    };

    Enums: Record<string, never>;
  };
};

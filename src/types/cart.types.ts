// =============================================================================
// Tipos de Carrinho e Favoritos — Módulos 11 e 12
// =============================================================================

import type { Product } from "./product.types";

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

export type WishlistItem = {
  id:                 string;
  user_id:            string;
  product_id:         string;
  product_variant_id: string | null;
  created_at:         string;
  product?: Pick<Product, "id" | "name" | "slug" | "price" | "sale_price" | "status"> & {
    images?: { url: string; is_primary: boolean }[];
  };
};

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export type CartItem = {
  id:                 string;
  cart_id:            string;
  product_id:         string;
  product_variant_id: string | null;
  quantity:           number;
  unit_price:         number;
  created_at:         string;
  updated_at:         string;
  // Relações
  product?: Pick<Product, "id" | "name" | "slug" | "price" | "sale_price" | "status"> & {
    images?: { url: string; is_primary: boolean }[];
  };
  variant?: { id: string; name: string; price: number | null; stock: number } | null;
};

export type Cart = {
  id:         string;
  user_id:    string | null;
  session_id: string | null;
  coupon_id:  string | null;
  created_at: string;
  updated_at: string;
  items:      CartItem[];
};

export type CartSummary = {
  items:         CartItem[];
  subtotal:      number;
  discount:      number;
  shipping_cost: number;
  total:         number;
  item_count:    number;
};

export type AddToCartInput = {
  product_id:          string;
  product_variant_id?: string | null;
  quantity:            number;
};

export type UpdateCartItemInput = {
  cart_item_id: string;
  quantity:     number;
};

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

export type BannerPosition = "home_hero" | "home_middle" | "category" | "sidebar";

export type Banner = {
  id:               string;
  title:            string;
  subtitle:         string | null;
  image_url:        string;
  mobile_image_url: string | null;
  link_url:         string | null;
  position:         BannerPosition;
  sort_order:       number;
  is_active:        boolean;
  starts_at:        string | null;
  ends_at:          string | null;
  created_at:       string;
  updated_at:       string;
};

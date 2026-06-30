import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type { Cart, CartItem, AddToCartInput } from "@/types/cart.types";

const CART_ITEM_SELECT = `
  id, cart_id, product_id, product_variant_id, quantity, unit_price, created_at, updated_at,
  product:products(id, name, slug, price, sale_price, status,
    images:product_images(url, is_primary)),
  variant:product_variants(id, name, price, stock)
`;

export const cartRepository = {

  async findOrCreate(userId: string): Promise<Cart | null> {
    const db = await serverDB();

    // Tentar encontrar carrinho existente
    const { data: existing } = await db
      .from("carts")
      .select(`id, user_id, session_id, coupon_id, created_at, updated_at,
        items:cart_items(${CART_ITEM_SELECT})`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) return existing as unknown as Cart;

    // Criar novo carrinho
    const { data: created, error } = await adminDB()
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) {
      logger.error("cartRepository.findOrCreate", { userId, error: error.message });
      return null;
    }

    return { ...created, items: [] } as unknown as Cart;
  },

  async getWithItems(cartId: string): Promise<Cart | null> {
    const db = await serverDB();
    const { data, error } = await db
      .from("carts")
      .select(`id, user_id, session_id, coupon_id, created_at, updated_at,
        items:cart_items(${CART_ITEM_SELECT})`)
      .eq("id", cartId)
      .single();
    if (error) { logger.warn("cartRepository.getWithItems", { cartId }); return null; }
    return data as unknown as Cart;
  },

  async addItem(cartId: string, input: AddToCartInput, unitPrice: number): Promise<CartItem | null> {
    // Upsert — se o produto+variante já estiver no carrinho, incrementar qty
    const { data: existing } = await adminDB()
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", input.product_id)
      .is("product_variant_id", input.product_variant_id ?? null)
      .single();

    if (existing) {
      const { data, error } = await adminDB()
        .from("cart_items")
        .update({
          quantity:   existing.quantity + input.quantity,
          unit_price: unitPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) { logger.error("cartRepository.addItem (update)", { error: error.message }); return null; }
      return data as CartItem;
    }

    const { data, error } = await adminDB()
      .from("cart_items")
      .insert({
        cart_id:            cartId,
        product_id:         input.product_id,
        product_variant_id: input.product_variant_id ?? null,
        quantity:           input.quantity,
        unit_price:         unitPrice,
      })
      .select()
      .single();

    if (error) { logger.error("cartRepository.addItem (insert)", { error: error.message }); return null; }
    logger.info("cartRepository.addItem", { cartId, productId: input.product_id, qty: input.quantity });
    return data as CartItem;
  },

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    const { error } = await adminDB()
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId);
    if (error) { logger.error("cartRepository.updateItemQuantity", { cartItemId, error: error.message }); return false; }
    return true;
  },

  async removeItem(cartItemId: string): Promise<boolean> {
    const { error } = await adminDB().from("cart_items").delete().eq("id", cartItemId);
    if (error) { logger.error("cartRepository.removeItem", { cartItemId, error: error.message }); return false; }
    return true;
  },

  async clearCart(cartId: string): Promise<boolean> {
    const { error } = await adminDB().from("cart_items").delete().eq("cart_id", cartId);
    if (error) { logger.error("cartRepository.clearCart", { cartId, error: error.message }); return false; }
    return true;
  },

  async getItemCount(cartId: string): Promise<number> {
    const db = await serverDB();
    const { data } = await db
      .from("cart_items")
      .select("quantity")
      .eq("cart_id", cartId);
    return (data ?? []).reduce((sum, item) => sum + item.quantity, 0);
  },
};

import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type {
  Stock, StockMovement, StockAlert,
  CreateStockMovementInput, StockFilters, MovementFilters,
} from "@/types/stock.types";

export const stockRepository = {

  // -------------------------------------------------------------------------
  // Stock
  // -------------------------------------------------------------------------

  async findAll(filters: StockFilters = {}): Promise<{ data: Stock[]; total: number }> {
    const db    = await serverDB();
    const page  = filters.page  ?? 1;
    const limit = filters.limit ?? 30;
    const offset = (page - 1) * limit;

    let query = db
      .from("stock")
      .select(
        "*, product:products(name,sku,status), variant:product_variants(name,sku)",
        { count: "exact" }
      )
      .order("updated_at", { ascending: false });

    if (filters.product_id) query = query.eq("product_id", filters.product_id);
    // Nota: comparação quantity <= min_alert não é possível com os
    // filtros padrão do PostgREST (coluna vs. coluna). Para stock
    // baixo, usar stockRepository.findAlerts(), que consulta a view
    // zumbo.stock_alert (já filtrada na base de dados).

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      logger.error("stockRepository.findAll", { error: error.message });
      return { data: [], total: 0 };
    }

    return { data: (data ?? []) as unknown as Stock[], total: count ?? 0 };
  },

  async findAlerts(): Promise<StockAlert[]> {
    const db = await serverDB();
    // Usa a view zumbo.stock_alert criada na migration 0005
    const { data, error } = await db
      .from("stock_alert")
      .select("*")
      .limit(50);
    if (error) {
      logger.error("stockRepository.findAlerts", { error: error.message });
      return [];
    }
    return (data ?? []) as unknown as StockAlert[];
  },

  async findByProduct(productId: string, variantId?: string | null): Promise<Stock | null> {
    const db = await serverDB();
    let query = db
      .from("stock")
      .select("*")
      .eq("product_id", productId);

    if (variantId) {
      query = query.eq("product_variant_id", variantId);
    } else {
      query = query.is("product_variant_id", null);
    }

    const { data, error } = await query.single();
    if (error) { return null; }
    return data as Stock;
  },

  async updateMinAlert(stockId: string, minAlert: number): Promise<boolean> {
    const { error } = await adminDB()
      .from("stock")
      .update({ min_alert: minAlert, updated_at: new Date().toISOString() })
      .eq("id", stockId);
    if (error) { logger.error("stockRepository.updateMinAlert", { stockId, error: error.message }); return false; }
    return true;
  },

  async updateLocation(stockId: string, location: string): Promise<boolean> {
    const { error } = await adminDB()
      .from("stock")
      .update({ location, updated_at: new Date().toISOString() })
      .eq("id", stockId);
    if (error) { logger.error("stockRepository.updateLocation", { stockId, error: error.message }); return false; }
    return true;
  },

  // -------------------------------------------------------------------------
  // Movimentos
  // -------------------------------------------------------------------------

  async createMovement(input: CreateStockMovementInput): Promise<StockMovement | null> {
    // Buscar quantidade actual antes de criar o movimento
    const currentStock = await this.findByProduct(
      input.product_id,
      input.product_variant_id ?? null
    );
    const quantityBefore = currentStock?.quantity ?? 0;

    // A direcção depende do tipo de movimento
    const isExit   = ["exit", "loss"].includes(input.type);
    const delta    = isExit ? -Math.abs(input.quantity) : Math.abs(input.quantity);
    const quantityAfter = Math.max(0, quantityBefore + delta);

    const { data, error } = await adminDB()
      .from("stock_movements")
      .insert({
        product_id:          input.product_id,
        product_variant_id:  input.product_variant_id ?? null,
        type:                input.type,
        quantity:            delta,
        quantity_before:     quantityBefore,
        quantity_after:      quantityAfter,
        reason:              input.reason ?? null,
        reference_id:        input.reference_id ?? null,
        reference_type:      input.reference_type ?? null,
        created_by:          input.created_by,
      })
      .select()
      .single();

    if (error) {
      logger.error("stockRepository.createMovement", {
        error: error.message,
        productId: input.product_id,
        type: input.type,
      });
      return null;
    }

    logger.info("stockRepository.createMovement: sucesso", {
      productId:      input.product_id,
      type:           input.type,
      quantityBefore,
      quantityAfter,
    });

    return data as StockMovement;
  },

  async findMovements(filters: MovementFilters = {}): Promise<{ data: StockMovement[]; total: number }> {
    const db     = await serverDB();
    const page   = filters.page  ?? 1;
    const limit  = filters.limit ?? 30;
    const offset = (page - 1) * limit;

    let query = db
      .from("stock_movements")
      .select(
        "*, product:products(name,sku), variant:product_variants(name), creator:user_profiles(full_name)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (filters.product_id) query = query.eq("product_id", filters.product_id);
    if (filters.type)       query = query.eq("type", filters.type);
    if (filters.from_date)  query = query.gte("created_at", filters.from_date);
    if (filters.to_date)    query = query.lte("created_at", filters.to_date);

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      logger.error("stockRepository.findMovements", { error: error.message });
      return { data: [], total: 0 };
    }

    return { data: (data ?? []) as unknown as StockMovement[], total: count ?? 0 };
  },
};

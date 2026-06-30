import { stockRepository } from "@/repositories/stock.repository";
import { logger } from "@/lib/utils/logger";
import type {
  Stock, StockMovement, StockAlert,
  CreateStockMovementInput, StockFilters, MovementFilters,
} from "@/types/stock.types";

export const stockService = {

  async getAll(filters?: StockFilters): Promise<{ data: Stock[]; total: number }> {
    return stockRepository.findAll(filters);
  },

  async getAlerts(): Promise<StockAlert[]> {
    return stockRepository.findAlerts();
  },

  async getByProduct(productId: string, variantId?: string): Promise<Stock | null> {
    return stockRepository.findByProduct(productId, variantId);
  },

  /**
   * Registar entrada de stock (compra de fornecedor, devolução, etc.)
   */
  async addStock(
    productId:  string,
    quantity:   number,
    userId:     string,
    options: {
      variantId?:     string;
      reason?:        string;
      referenceId?:   string;
      referenceType?: string;
    } = {}
  ): Promise<StockMovement | null> {
    if (quantity <= 0) {
      logger.warn("stockService.addStock: quantidade inválida", { productId, quantity });
      return null;
    }

    return stockRepository.createMovement({
      product_id:          productId,
      product_variant_id:  options.variantId,
      type:                "entry",
      quantity,
      reason:              options.reason ?? "Entrada de stock",
      reference_id:        options.referenceId,
      reference_type:      options.referenceType,
      created_by:          userId,
    });
  },

  /**
   * Registar saída de stock (venda, perda, ajuste manual, etc.)
   */
  async removeStock(
    productId: string,
    quantity:  number,
    type:      "exit" | "loss" | "adjustment",
    userId:    string,
    options: {
      variantId?:     string;
      reason?:        string;
      referenceId?:   string;
      referenceType?: string;
    } = {}
  ): Promise<StockMovement | null> {
    if (quantity <= 0) {
      logger.warn("stockService.removeStock: quantidade inválida", { productId, quantity });
      return null;
    }

    // Verificar se há stock suficiente
    const current = await stockRepository.findByProduct(productId, options.variantId);
    if (current && current.quantity < quantity) {
      logger.warn("stockService.removeStock: stock insuficiente", {
        productId,
        available: current.quantity,
        requested: quantity,
      });
      return null; // Caller deve tratar este caso
    }

    return stockRepository.createMovement({
      product_id:          productId,
      product_variant_id:  options.variantId,
      type,
      quantity,
      reason:              options.reason,
      reference_id:        options.referenceId,
      reference_type:      options.referenceType,
      created_by:          userId,
    });
  },

  /**
   * Ajuste manual para correcção de inventário.
   */
  async adjustToQuantity(
    productId:       string,
    targetQuantity:  number,
    userId:          string,
    reason:          string,
    variantId?:      string
  ): Promise<StockMovement | null> {
    const current = await stockRepository.findByProduct(productId, variantId);
    const current_qty = current?.quantity ?? 0;
    const delta = targetQuantity - current_qty;

    if (delta === 0) {
      logger.info("stockService.adjustToQuantity: sem alteração necessária", { productId });
      return null;
    }

    logger.info("stockService.adjustToQuantity", { productId, current_qty, targetQuantity, delta });

    return stockRepository.createMovement({
      product_id:          productId,
      product_variant_id:  variantId,
      type:                "inventory",
      quantity:            Math.abs(delta),
      reason:              `Ajuste de inventário: ${reason}`,
      created_by:          userId,
    });
  },

  async getMovements(filters?: MovementFilters): Promise<{ data: StockMovement[]; total: number }> {
    return stockRepository.findMovements(filters);
  },

  async updateMinAlert(stockId: string, minAlert: number): Promise<boolean> {
    return stockRepository.updateMinAlert(stockId, minAlert);
  },

  async updateLocation(stockId: string, location: string): Promise<boolean> {
    return stockRepository.updateLocation(stockId, location);
  },
};

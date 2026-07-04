import { supplierRepository } from "@/repositories/supplier.repository";
import { logger } from "@/lib/utils/logger";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput, PurchaseOrder } from "@/types/supplier.types";

export const supplierService = {

  async getAll(): Promise<Supplier[]> {
    return supplierRepository.findAll();
  },

  async getById(id: string): Promise<Supplier | null> {
    return supplierRepository.findById(id);
  },

  async create(input: CreateSupplierInput): Promise<Supplier | null> {
    logger.info("supplierService.create", { name: input.name });
    return supplierRepository.create(input);
  },

  async update(id: string, input: UpdateSupplierInput): Promise<Supplier | null> {
    logger.info("supplierService.update", { id });
    return supplierRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    logger.info("supplierService.delete (soft)", { id });
    return supplierRepository.softDelete(id);
  },

  async getOrders(supplierId: string): Promise<PurchaseOrder[]> {
    return supplierRepository.findOrders(supplierId);
  },
};

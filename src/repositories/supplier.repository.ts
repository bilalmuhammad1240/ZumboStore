import { serverDB, adminDB } from "@/lib/supabase/db";
import { logger } from "@/lib/utils/logger";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput, PurchaseOrder } from "@/types/supplier.types";

export const supplierRepository = {

  async findAll(): Promise<Supplier[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("suppliers")
      .select("*")
      .order("name");
    if (error) { logger.error("supplierRepository.findAll", { error: error.message }); return []; }
    return (data ?? []) as Supplier[];
  },

  async findById(id: string): Promise<Supplier | null> {
    const db = await serverDB();
    const { data, error } = await db.from("suppliers").select("*").eq("id", id).single();
    if (error) { logger.warn("supplierRepository.findById", { id }); return null; }
    return data as Supplier;
  },

  async create(input: CreateSupplierInput): Promise<Supplier | null> {
    const { data, error } = await adminDB().from("suppliers").insert(input).select().single();
    if (error) { logger.error("supplierRepository.create", { error: error.message }); return null; }
    logger.info("supplierRepository.create", { id: data.id });
    return data as Supplier;
  },

  async update(id: string, input: UpdateSupplierInput): Promise<Supplier | null> {
    const { data, error } = await adminDB()
      .from("suppliers")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) { logger.error("supplierRepository.update", { id, error: error.message }); return null; }
    return data as Supplier;
  },

  async softDelete(id: string): Promise<boolean> {
    const { error } = await adminDB()
      .from("suppliers")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { logger.error("supplierRepository.softDelete", { id, error: error.message }); return false; }
    return true;
  },

  async findOrders(supplierId: string): Promise<PurchaseOrder[]> {
    const db = await serverDB();
    const { data, error } = await db
      .from("purchase_orders")
      .select("*, items:purchase_items(*, product:products(name,sku), variant:product_variants(name))")
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false });
    if (error) { logger.error("supplierRepository.findOrders", { supplierId, error: error.message }); return []; }
    return (data ?? []) as unknown as PurchaseOrder[];
  },
};

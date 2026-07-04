import { z } from "zod";

export const supplierSchema = z.object({
  name:           z.string().min(2, "Nome obrigatório (mín. 2 caracteres).").max(150),
  email:          z.string().email("Email inválido.").optional().nullable().or(z.literal("")),
  phone:          z.string().max(20).optional().nullable(),
  whatsapp:       z.string().max(20).optional().nullable(),
  address:        z.string().max(300).optional().nullable(),
  city:           z.string().max(100).optional().nullable(),
  country:        z.string().default("Moçambique"),
  contact_person: z.string().max(150).optional().nullable(),
  payment_terms:  z.string().max(100).optional().nullable(),
  notes:          z.string().max(1000).optional().nullable(),
  is_active:      z.coerce.boolean().default(true),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

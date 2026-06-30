// =============================================================================
// Tipos de Produto — Módulos 5 e 6
// =============================================================================

import type { Category } from "./catalog.types";
import type { Brand, AttributeValue } from "./catalog.types";

export type ProductStatus = "draft" | "active" | "archived" | "out_of_stock";

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

export type Product = {
  id:                string;
  category_id:       string | null;
  brand_id:          string | null;
  name:              string;
  slug:              string;
  sku:               string;
  internal_code:     string | null;
  barcode:           string | null;
  description:       string | null;
  short_description: string | null;
  price:             number;
  sale_price:        number | null;
  cost_price:        number | null;
  weight_kg:         number | null;
  width_cm:          number | null;
  height_cm:         number | null;
  depth_cm:          number | null;
  status:            ProductStatus;
  is_featured:       boolean;
  is_new:            boolean;
  has_variants:      boolean;
  warranty_months:   number;
  meta_title:        string | null;
  meta_description:  string | null;
  total_sold:        number;
  total_reviews:     number;
  avg_rating:        number;
  views_count:       number;
  created_at:        string;
  updated_at:        string;
  // Relações opcionais
  category?:         Pick<Category, "id" | "name" | "slug"> | null;
  brand?:            Pick<Brand, "id" | "name" | "logo_url"> | null;
  images?:           ProductImage[];
  variants?:         ProductVariant[];
  specifications?:   ProductSpecification[];
};

export type ProductWithRelations = Product & {
  category:       Pick<Category, "id" | "name" | "slug"> | null;
  brand:          Pick<Brand, "id" | "name" | "logo_url"> | null;
  images:         ProductImage[];
  variants:       ProductVariant[];
  specifications: ProductSpecification[];
};

// ---------------------------------------------------------------------------
// ProductImage
// ---------------------------------------------------------------------------

export type ProductImage = {
  id:         string;
  product_id: string;
  url:        string;
  alt_text:   string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

// ---------------------------------------------------------------------------
// ProductVariant
// ---------------------------------------------------------------------------

export type ProductVariant = {
  id:         string;
  product_id: string;
  sku:        string;
  name:       string;
  price:      number | null;
  sale_price: number | null;
  stock:      number;
  image_url:  string | null;
  is_active:  boolean;
  created_at: string;
  updated_at: string;
  // Relação com atributos
  attribute_values?: AttributeValue[];
};

// ---------------------------------------------------------------------------
// ProductSpecification
// ---------------------------------------------------------------------------

export type ProductSpecification = {
  id:         string;
  product_id: string;
  group_name: string;
  spec_key:   string;
  spec_value: string;
  sort_order: number;
};

// ---------------------------------------------------------------------------
// Inputs para criação/edição
// ---------------------------------------------------------------------------

export type CreateProductInput = {
  category_id?:       string | null;
  brand_id?:          string | null;
  name:               string;
  slug:               string;
  sku:                string;
  internal_code?:     string | null;
  barcode?:           string | null;
  description?:       string | null;
  short_description?: string | null;
  price:              number;
  sale_price?:        number | null;
  cost_price?:        number | null;
  weight_kg?:         number | null;
  width_cm?:          number | null;
  height_cm?:         number | null;
  depth_cm?:          number | null;
  status?:            ProductStatus;
  is_featured?:       boolean;
  is_new?:            boolean;
  has_variants?:      boolean;
  warranty_months?:   number;
  meta_title?:        string | null;
  meta_description?:  string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;

// ---------------------------------------------------------------------------
// Filtros de listagem
// ---------------------------------------------------------------------------

export type ProductFilters = {
  category_id?: string;
  brand_id?:    string;
  status?:      ProductStatus;
  is_featured?: boolean;
  is_new?:      boolean;
  search?:      string;
  min_price?:   number;
  max_price?:   number;
  page?:        number;
  limit?:       number;
  sort?:        "price_asc" | "price_desc" | "newest" | "popular" | "name_asc";
};

export type PaginatedProducts = {
  data:  Product[];
  total: number;
  page:  number;
  limit: number;
  pages: number;
};

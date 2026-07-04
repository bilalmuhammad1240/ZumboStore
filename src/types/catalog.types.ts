// =============================================================================
// Tipos do Catálogo — Módulos 3, 4 e Atributos
// =============================================================================

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export type Category = {
  id:               string;
  parent_id:        string | null;
  name:             string;
  slug:             string;
  description:      string | null;
  image_url:        string | null;
  icon:             string | null;
  sort_order:       number;
  is_active:        boolean;
  meta_title:       string | null;
  meta_description: string | null;
  created_at:       string;
  updated_at:       string;
  // Relações opcionais (quando carregadas via join)
  children?:        Category[];
  parent?:          Pick<Category, "id" | "name" | "slug"> | null;
  _count?:          { products: number };
};

export type CategoryTree = Category & { children: CategoryTree[] };

export type CreateCategoryInput = {
  parent_id?:        string | null;
  name:              string;
  slug?:             string;             // opcional — gerado pelo service se omitido
  description?:      string | null;
  image_url?:        string | null;
  icon?:             string | null;
  sort_order?:       number;
  is_active?:        boolean;
  meta_title?:       string | null;
  meta_description?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export type Brand = {
  id:               string;
  name:             string;
  slug:             string;
  logo_url:         string | null;
  description:      string | null;
  website:          string | null;
  is_active:        boolean;
  sort_order:       number;
  meta_title:       string | null;
  meta_description: string | null;
  created_at:       string;
  updated_at:       string;
};

export type CreateBrandInput = Omit<Brand, "id" | "created_at" | "updated_at"> & {
  slug?: string;   // opcional — gerado pelo service se omitido
};
export type UpdateBrandInput = Partial<CreateBrandInput>;

// ---------------------------------------------------------------------------
// Attributes
// ---------------------------------------------------------------------------

export type AttributeType = "select" | "color" | "size" | "boolean";

export type Attribute = {
  id:         string;
  name:       string;
  slug:       string;
  type:       AttributeType;
  created_at: string;
  values?:    AttributeValue[];
};

export type AttributeValue = {
  id:           string;
  attribute_id: string;
  value:        string;
  color_hex:    string | null;
  sort_order:   number;
  created_at:   string;
  attribute?:   Pick<Attribute, "id" | "name" | "type">;
};

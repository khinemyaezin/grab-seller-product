// Models
export type {
  Product,
  Category,
  Variant,
  Variation,
  VariationMatrix,
  VariationOption,
  VariationType,
  MatrixVariantVariation,
  CategoryLeaf,
  ProductLifecycleEvent
} from "./catalog.model";

// Request DTOs
export type {
  CreateProductRequest,
  CreateProductRequestProduct,
  CreateProductRequestVariation,
  CreateProductRequestVariationType,
  UpdateProductRequest,
  UPDATE_INTENT,
  GetFeaturedProductRequest,
  VariationMatrixRequest,
  VariationMatrixRequestVariation,
  VariationMatrixRequestVariantType,
} from "./catalog.request";

// Response DTOs
export type {
  CatalogRoot,
  CreateProductResponse,
  UpdateProductResponse,
  GetFeaturedProductResponse,
  GetFullProductResponse,
  VariationMatrixResponse,
  VariationMatrixResponseVariation,
  VariationMatrixResponseVariantType,
  CategoryLeavesResult,
  GetVariationTypeResult,
  GetVariationOptionResult,
  ProductModerationResponse,
  DeleteProductResponse
} from "./catalog.response";

// Form Values
export type {
  ProductFormValue,
  ProductFilterFormValue,
} from "./catalog.form";

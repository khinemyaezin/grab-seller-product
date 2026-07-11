import type { Product, ProductStatus, VariationType } from "./catalog.model";

export type ProductFormValue = {
  product: Product;
  variationTypes: VariationType[];
};

export type ProductFilterFormValue = {
  productName: string;
  productStatus: ProductStatus | null;
  page: number;
  size: number;
};

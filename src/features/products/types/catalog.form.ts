import type { Product, VariationType } from "./catalog.model";

export type ProductFormValue = {
  product: Product;
  variationTypes: VariationType[];
};

export type ProductFilterFormValue = {
  productName: string;
  page: number;
  size: number;
};

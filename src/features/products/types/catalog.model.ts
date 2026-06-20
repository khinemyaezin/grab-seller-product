export type Product = {
  name: string;
  category: Category | null;
  variants: Variant[];
  standaloneVariant: Partial<Variant>;
};

export type Category = {
  id: string;
  name: string;
};

export type Variant = {
  name: string;
  matrixKey: string;
  sku: string;
  variations: Variation[];
};

export type Variation = {
  typeId: string;
  optionId: string;
};

export type VariationMatrix = {
  types: VariationType[];
  variants: Variant[];
};

export type VariationOption = {
  uuid: string;
  name: string;
};

export type VariationType = {
  uuid: string;
  name: string;
  options: VariationOption[];
};

export type MatrixVariantVariation = {
  optionId: string;
  typeId: string;
};

export type CategoryLeaf = {
  id: string;
  name: string;
  parentId: string | null;
  active: boolean;
  listingAllowed: boolean;
  reviewRequired: boolean;
  c2cAllowed: boolean;
};

import type { PageInfo, HateoasLink, HateoasPageMetadata } from "@khinemyaezin/seller-api";
import type { CategoryLeaf } from "./catalog.model";

export interface CatalogRoot {
  self?: HateoasLink;
  searchProducts?: HateoasLink
  createProduct?: HateoasLink
  getProduct?: HateoasLink
  searchCategoryLeaves?: HateoasLink
  searchVariantTypes?: HateoasLink
  searchVariantOptions?: HateoasLink
  generateVariationMatrix?: HateoasLink
}

export type VariationMatrixResponseVariation = {
  optionId: string;
  typeId: string;
};

export type VariationMatrixResponseVariantType = {
  typeId: string;
  options: { optionId: string }[];
};

export type VariationMatrixResponse = {
  variants: {
    matrixKey: string;
    originalMatrixKey: string;
    variations: VariationMatrixResponseVariation[];
  }[];
  collapsedSku: string[];
  variantTypes: VariationMatrixResponseVariantType[];
};

export type CreateProductResponse = {};

export interface UpdateProductResponse { }

export interface GetFeaturedProductResponse {
  _embedded: {
    productSummaryResponseList: {
      id: string;
      name: string;
      status: string;
      slug: string;
      categoryName: string;
      variant: {
        available: boolean;
        types: {
          typeId: string;
          typeName: string;
          options: {
            optionId: string;
            optionName: string;
          }[];
        }[];
      };
      _links?: Record<string, HateoasLink>;
    }[]
  }
  _links?: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface GetFullProductResponse {
  id: string;
  name: string;
  _links?: Record<string, HateoasLink>;
  category: {
    id: string;
    name: string;
  };
  sellerId: string;
  sellerType: string;
  condition: string;
  offerEligible: boolean;
  status: string;
  slug: string;
  featured: boolean;
  descriptions: null;
  medias: null;
  moderationNote: null;
  variants: {
    id: string;
    sku: string;
    status: string;
    matrixKey: string;
    variations: {
      optionId: string;
      optionName: string;
      typeId: string;
      typeName: string;
    }[];
  }[];
  variantTypes: {
    typeId: string;
    typeName: string;
    options: {
      optionId: string;
      optionName: string;
    }[];
  }[];
}

export interface CategoryLeavesResult {
  leaves: CategoryLeaf[];
  _links?: Record<string, HateoasLink>;
}

export interface GetVariationTypeResult {
  types: {
    id: string;
    name: string;
  }[];
  _links?: Record<string, HateoasLink>;
}

export interface GetVariationOptionResult {
  options: {
    id: string;
    name: string;
    typeId: string;
    typeName: string;
  }[];
  _links?: Record<string, HateoasLink>;
}
export interface ProductModerationResponse {
  productId: string;
  action: string;
  oldStatus: string;
  newStatus: string;
  reason: string;
}

export interface DeleteProductResponse {
  productId: string,
  deleted: boolean

}

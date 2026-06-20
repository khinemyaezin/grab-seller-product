import type {
  CategoryLeavesResult,
  CreateProductRequest,
  GetFullProductResponse,
  GetFeaturedProductRequest,
  GetFeaturedProductResponse,
  GetVariationOptionResult,
  GetVariationTypeResult,
  UpdateProductRequest,
  UpdateProductResponse,
  VariationMatrixRequest,
  VariationMatrixResponse,
} from "@/features/products/types";
import { api } from "@grab/seller-api";
import type { HateoasLink } from "@grab/seller-api";

export const catalogService = {
  createVariationMatrix: (link: HateoasLink, request: VariationMatrixRequest, headers?: Record<string, string>) =>
    api.followLink<VariationMatrixResponse>(link, "POST", request, undefined, headers),

  getCategories: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<CategoryLeavesResult>(link, "GET", undefined, undefined, headers),

  createProduct: (link: HateoasLink, request: CreateProductRequest, headers?: Record<string, string>) =>
    api.followLink<void>(link, "POST", request, undefined, headers),

  getVariationType: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetVariationTypeResult>(link, "GET", undefined, undefined, headers),

  getVariationOption: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetVariationOptionResult>(link, "GET", undefined, undefined, headers),

  searchProducts: (link: HateoasLink, request: GetFeaturedProductRequest, headers?: Record<string, string>) =>
    api.followLink<GetFeaturedProductResponse>(link, "POST", request, undefined, headers),

  getFullProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetFullProductResponse>(link, "GET", undefined, undefined, headers),

  updateProduct: (link: HateoasLink, request: UpdateProductRequest, headers?: Record<string, string>) =>
    api.followLink<UpdateProductResponse>(link, "PUT", request, undefined, headers),
};

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
  DeleteProductResponse,
  ProductModerationResponse,
} from "@/features/products/types";
import { api, resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";

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

  searchProducts: (link: HateoasLink, request: GetFeaturedProductRequest, headers?: Record<string, string>) => {
    const { page, size, ...restFilter } = request;
    const params = { page: String(page), size: String(size) };
    const resolvedLink = resolveUrlTemplate({}, link);
    return api.followLink<GetFeaturedProductResponse>(resolvedLink, "POST", restFilter, params, headers);
  },

  getFullProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<GetFullProductResponse>(link, "GET", undefined, undefined, headers),

  updateProduct: (link: HateoasLink, request: UpdateProductRequest, headers?: Record<string, string>) =>
    api.followLink<UpdateProductResponse>(link, "PUT", request, undefined, headers),

  deleteProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<DeleteProductResponse>(link, "DELETE", undefined, undefined, headers),

  restoreProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ProductModerationResponse>(link, "POST", undefined, undefined, headers),

  publishProduct: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ProductModerationResponse>(link, "POST", undefined, undefined, headers),
};

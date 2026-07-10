
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogService } from "@/features/products/api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateProductRequest, GetFullProductResponse, GetFeaturedProductRequest, GetFeaturedProductResponse, UpdateProductRequest, UpdateProductResponse, ProductModerationResponse, DeleteProductResponse } from "@/features/products/types";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";

export function useProductMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { link: HateoasLink, request: CreateProductRequest }>({
    mutationFn: ({ link, request }) =>
      catalogService.createProduct(link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProductUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateProductResponse, Error, { link: HateoasLink, request: UpdateProductRequest }>({
    mutationFn: ({ link, request }) =>
      catalogService.updateProduct(link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProductDeleteMutation() {
  const queryClient = useQueryClient();
  return useMutation<DeleteProductResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) =>
      catalogService.deleteProduct(link),
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", resp.productId ] });
    },
  });
}

export function useProductRestoreMutation() {
  const queryClient = useQueryClient();
  return useMutation<ProductModerationResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) =>
      catalogService.restoreProduct(link),
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", resp.productId] });
    },
  });
}

export function useProductSearch(productsLink?: HateoasLink, filters?: GetFeaturedProductRequest) {
  return useQuery<GetFeaturedProductResponse>({
    queryKey: ["products", "search", productsLink?.href, filters],
    queryFn: async () => catalogService.searchProducts(productsLink!, filters!),
    enabled: !!productsLink,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductGet(productLink: HateoasLink, productId: string) {
  const extendedLink = resolveUrlTemplate({ "productId": productId }, productLink)
  return useQuery<GetFullProductResponse, Error>({
    queryKey: ["product", productId],
    queryFn: async () => catalogService.getFullProduct(extendedLink),
    staleTime: 5 * 60 * 1000,
  });
}

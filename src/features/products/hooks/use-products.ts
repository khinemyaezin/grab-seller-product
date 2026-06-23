
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogService } from "@/features/products/api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateProductRequest, GetFullProductResponse, GetFeaturedProductRequest, GetFeaturedProductResponse, UpdateProductRequest, UpdateProductResponse } from "@/features/products/types";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";

export function useProductMutation() {
  return useMutation<void, Error, { link: HateoasLink, request: CreateProductRequest }>({
    mutationFn: ({ link, request }) =>
      catalogService.createProduct(link, request),
  });
}

export function useProductUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateProductResponse, Error, { link: HateoasLink, request: UpdateProductRequest }>({
    mutationFn: ({ link, request }) =>
      catalogService.updateProduct(link, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProductSearch(productsLink?: HateoasLink, filters?: GetFeaturedProductRequest) {
  return useQuery<GetFeaturedProductResponse>({
    queryKey: ["products", "search", productsLink?.href, filters],
    queryFn: async () => catalogService.searchProducts(productsLink!, filters!),
    enabled: !!productsLink,
    placeholderData: (previousData) => previousData,
  });
}

export function useProductGet(productLink: HateoasLink, productId: string) {
  const extendedLink = resolveUrlTemplate({ "productId": productId }, productLink)
  return useQuery<GetFullProductResponse, Error>({
    queryKey: ["product", extendedLink],
    queryFn: async () => catalogService.getFullProduct(extendedLink),
  });
}


import { catalogService } from "@/features/products/api";
import type { HateoasLink } from "@grab/seller-api";
import type { VariationMatrixRequest, VariationMatrixResponse } from "@/features/products/types";
import { useMutation } from "@tanstack/react-query";

export function useVariationMatrixMutation(variationMatrixLink: HateoasLink) {
  return useMutation<VariationMatrixResponse, Error, VariationMatrixRequest>({
    mutationFn: (request) =>
      catalogService.createVariationMatrix(variationMatrixLink, request),
  });
}

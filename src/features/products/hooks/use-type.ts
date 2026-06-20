import { catalogService } from "@/features/products/api";
import type { HateoasLink } from "@grab/seller-api";
import { GetVariationTypeResult } from "@/features/products/types";
import { useQuery } from "@tanstack/react-query";
import { resolveUrlTemplate } from "@grab/seller-api";

export function useVariationType(variantTypesLink: HateoasLink, name: string) {
  const expendLink = resolveUrlTemplate({ "name": name }, variantTypesLink);

  return useQuery<GetVariationTypeResult>({
    queryKey: ["types", variantTypesLink?.href, name],
    queryFn: async () => catalogService.getVariationType(expendLink),
    enabled: !!variantTypesLink && !!name?.trim(),
    staleTime: 1000 * 60 * 5,
  });
}

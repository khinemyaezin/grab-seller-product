import { catalogService } from "@/features/products/api";
import type { HateoasLink } from "@grab/seller-api";
import { GetVariationOptionResult } from "@/features/products/types";
import { useQuery } from "@tanstack/react-query";
import { resolveUrlTemplate } from "@grab/seller-api";

export function useVariationOptionSearch(variantOptionsLink: HateoasLink, name: string, type: string) {
  const expendLink = resolveUrlTemplate({ "name": name, "typeId": type }, variantOptionsLink);

  return useQuery<GetVariationOptionResult>({
    queryKey: ["option", variantOptionsLink.href, `${name}-${type}`],
    queryFn: async () => catalogService.getVariationOption(expendLink),
    enabled: !!variantOptionsLink && !!name?.trim(),
    staleTime: 1000 * 60 * 5,
  });
}

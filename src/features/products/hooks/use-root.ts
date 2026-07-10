
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogRoot } from "../api/discovery";
import type { CatalogRoot } from "@/features/products/types";
import { useEntryLink } from "@khinemyaezin/seller-ui";

export function useRoot() {
  const entryLink = useEntryLink();

  return useQuery<CatalogRoot>({
    queryKey: ["catalog-root", entryLink?.href],
    queryFn: () => fetchCatalogRoot(entryLink),
    enabled: !!entryLink,
    staleTime: Infinity,
  });
}

// ponytail: no provider needed — useRoot() is a shared React Query cache (staleTime: Infinity),
// so every caller dedupes onto one fetch. This is just a named accessor for a single link.
export function useCatalogLink(rel: keyof CatalogRoot) {
  return useRoot().data?.[rel];
}

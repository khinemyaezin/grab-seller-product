
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogRoot } from "../api/discovery";
import type { CatalogRoot } from "@/features/products/types";
import { useProductLink } from "../context";

export function useCatalogRoot() {
   const link = useProductLink();
  
  return useQuery<CatalogRoot>({
    queryKey: ["catalog-root", link.href],
    queryFn: () => fetchCatalogRoot(link),
    enabled: !!link,
    staleTime: Infinity,
  });
}

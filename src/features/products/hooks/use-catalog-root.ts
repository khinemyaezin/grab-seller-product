
import { useQuery } from "@tanstack/react-query";
import { useApiRoot } from "./use-api-root";
import { fetchCatalogRoot } from "../api/discovery";
import type { CatalogRoot } from "@/features/products/types";

export function useCatalogRoot() {
  const { data: apiRoot } = useApiRoot();

  return useQuery<CatalogRoot>({
    queryKey: ["catalog-root", apiRoot?.catalog?.href],
    queryFn: () => fetchCatalogRoot(apiRoot!.catalog!),
    enabled: !!apiRoot?.catalog,
    staleTime: Infinity,
  });
}

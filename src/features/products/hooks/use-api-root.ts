
import { useQuery } from "@tanstack/react-query";
import { fetchApiRoot } from "@grab/seller-api";
import type { ApiRoot } from "@grab/seller-api";

export function useApiRoot() {
  return useQuery<ApiRoot>({
    queryKey: ["api-root"],
    queryFn: fetchApiRoot,
    staleTime: Infinity,
  });
}

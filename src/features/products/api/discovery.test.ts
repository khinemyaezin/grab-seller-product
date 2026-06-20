import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { configureApi } from "@grab/seller-api";
import { server } from "@/test/server";
import { fetchCatalogRoot } from "./discovery";

describe("catalog discovery", () => {
  it("maps catalog HAL relations into the Product contract", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(http.get("http://api.test/catalog", () => HttpResponse.json({
      _links: {
        self: { href: "/catalog" },
        "search-products": { href: "/catalog/products/search" },
        "create-product": { href: "/catalog/products" },
      },
    }, { headers: { "content-type": "application/hal+json" } })));

    const root = await fetchCatalogRoot({ href: "/catalog" });
    expect(root.searchProducts?.href).toBe("/catalog/products/search");
    expect(root.createProduct?.href).toBe("/catalog/products");
  });
});

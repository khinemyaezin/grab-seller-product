
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { useCatalogRoot } from "@/features/products/hooks/use-catalog-root";
import ProductsView from "@/features/products/components/products-view";

export default function AdminProductsPage() {
  const { data: catalogRoot } = useCatalogRoot();

  return (
    <div className="container mx-auto max-w-5xl">
      <Header
        title="Products"
        description="Manage your product catalog, update stock status, and add new inventory.">
      </Header>

      {catalogRoot?.searchProducts && (
        <ProductsView
          link={catalogRoot.searchProducts}
          canCreate={!!catalogRoot.createProduct}
        />
      )}
    </div>
  );
}

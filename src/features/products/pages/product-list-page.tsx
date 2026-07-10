
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { useRoot } from "@/features/products/hooks/use-root";
import ProductsView from "@/features/products/components/products-view";

export default function AdminProductsPage() {
  const { data: catalogRoot } = useRoot();

  return (
    <div className="container mx-auto max-w-5xl p-6">
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

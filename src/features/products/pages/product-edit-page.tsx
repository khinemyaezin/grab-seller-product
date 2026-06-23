
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { useCatalogRoot } from "@/features/products/hooks/use-catalog-root";
import { routes } from "@khinemyaezin/seller-contracts";
import ProductEditForm from "@/features/products/components/product-edit-form";

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data } = useCatalogRoot();

  return (
    <div className="container mx-auto max-w-xl">
      <Header
        title="Edit Product"
        description="Create a new warehouse, store, or distribution center."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary">
            <Link to={routes.products} className="flex gap-2 items-center">
              <ArrowLeftIcon />
              <span>Back to Products</span>
            </Link>
          </Button>

        </ButtonGroup>
      </Header>
      {data?.generateVariationMatrix
        && data.searchVariantTypes
        && data.searchVariantOptions
        && data.searchCategoryLeaves
        && data.createProduct
        && data.getProduct && (
          <ProductEditForm
            generateMatrixLink={data.generateVariationMatrix}
            variationTypeSearchLink={data.searchVariantTypes}
            variationOptionSearchLink={data.searchVariantOptions}
            categorySearchLink={data.searchCategoryLeaves}
            getProductLink={data.getProduct}
            productId={productId!} />
        )}
    </div>
  );
}


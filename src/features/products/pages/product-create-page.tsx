
import ProductNewForm from "@/features/products/components/product-new-form";
import { Header } from "@grab/seller-ui/layout/header";
import { Button } from "@grab/seller-ui/components/index";
import { ButtonGroup } from "@grab/seller-ui/components/button-group";
import { routes } from "@grab/seller-contracts";
import { useCatalogRoot } from "@/features/products/hooks/use-catalog-root";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";

export default function NewProductPage() {
    const { data } = useCatalogRoot();

    return (
        <div className="container mx-auto max-w-xl">
            <Header
                title="Add Product"
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
            {data?.generateVariationMatrix && data.searchVariantTypes && data.searchVariantOptions && data.searchCategoryLeaves && data.createProduct && (
                <ProductNewForm
                    generateMatrixLink={data.generateVariationMatrix}
                    variationTypeSearchLink={data.searchVariantTypes}
                    variationOptionSearchLink={data.searchVariantOptions}
                    categorySearchLink={data.searchCategoryLeaves}
                    createProductLink={data.createProduct} />
            )}
        </div>
    );
}

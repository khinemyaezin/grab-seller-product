
import ProductNewForm from "@/features/products/components/product-new-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useRoot } from "@/features/products/hooks/use-root";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";
import { usePlatform } from "@khinemyaezin/seller-ui";

export default function NewProductPage() {
    const { data } = useRoot();
    const platform = usePlatform();
    return (
        <div className="container mx-auto max-w-xl p-6">
            <Header
                title="Add Product"
                description="Add a new product to your seller catalog."
            >
                <ButtonGroup>
                    <Button type="button" variant="secondary" asChild>
                        <Link to="..">
                            <ArrowLeftIcon />
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
                    createProductLink={data.createProduct}
                    onSuccess={() => platform?.events.publish("shell:toast:v1", { type: "success", message: "Product created successfully", position: "top-center" })}
                    onError={() => platform?.events.publish("shell:toast:v1", { type: "error", message: "Failed to create product", position: "top-center" })}
                />
            )}
        </div>
    );
}

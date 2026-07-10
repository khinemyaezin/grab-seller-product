import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform, useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import { useRoot } from "@/features/products/hooks/use-root";
import ProductEditForm from "@/features/products/components/product-edit-form";

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data } = useRoot();
  const [title, setTitle] = useState<string | undefined>();
  const platform = usePlatform();
  const navigate = useNavigate();

  useShellBreadcrumb(title);

  return (
    <div className="container mx-auto max-w-xl p-6">
      <Header
        title="Edit Product"
        description="Create a new warehouse, store, or distribution center."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary">
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
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
            productId={productId!}
            onResolvedTitle={setTitle}
            onSuccess={() => platform?.events.publish("shell:toast:v1", { type: "success", message: "Product updated successfully", position: "top-center" })}
            onError={() => platform?.events.publish("shell:toast:v1", { type: "error", message: "Failed to update product", position: "top-center" })}
            onArchived={() => {
              platform?.events.publish("shell:toast:v1", { type: "success", message: "Product archived successfully", position: "top-center" });
              navigate("..");
            }}
            onArchiveError={() => platform?.events.publish("shell:toast:v1", { type: "error", message: "Failed to archive product", position: "top-center" })}
          />
        )}
    </div>
  );
}

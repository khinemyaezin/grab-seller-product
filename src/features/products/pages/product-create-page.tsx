
import ProductNewForm from "@/features/products/components/product-new-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { useCatalogLink } from "@/features/products/hooks/use-root";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { ProductLifecycleEvent } from "@/features/products/types";

export default function NewProductPage() {
    const canCreate = !!useCatalogLink("createProduct");
    const platform = usePlatform();
    const navigate = useNavigate();

    const toast = (type: "success" | "error", message: string) =>
        platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

    const handleEvent = (event: ProductLifecycleEvent) => {
        switch (event.type) {
            case "created": toast("success", "Product created successfully"); break;
            case "createFailed": toast("error", "Failed to create product"); break;
        }
    };

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
            {canCreate && (
                <ProductNewForm
                    onLifecycleEvent={handleEvent}
                />
            )}
        </div>
    );
}

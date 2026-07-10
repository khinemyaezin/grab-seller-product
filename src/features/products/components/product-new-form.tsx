import { FormProvider, useForm } from "react-hook-form"
import ProductBasicFieldSet from "./product-basic-fieldset";
import ProductVariationFieldSet from "./product-variation-fieldset";
import { generateSlug } from "@/features/products/utils";
import { useProductMutation } from "@/features/products/hooks/use-products";
import { useCatalogLink } from "@/features/products/hooks/use-root";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Separator } from "@khinemyaezin/seller-ui/components/separator";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { ProductFormValue, CreateProductRequest } from "../types";
import { useEffect } from "react";

import type { ProductLifecycleEvent } from "../types";

export type ProductNewFormProps = {
    onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};

const DEFAULT_PRODUCT_FORM_VALUE: ProductFormValue = {
    product: {
        name: "",
        category: null,
        variants: [],
        standaloneVariant: {
            sku: ""
        },
    },
    variationTypes: [],
};

function buildCreatePayload(values: ProductFormValue): CreateProductRequest {
    const mappedVariants = values.product.variants.length > 0
        ? values.product.variants.map((variant) => ({
            sku: variant.sku,
            variations: variant.variations.map((v) => ({
                typeId: v.typeId,
                optionId: v.optionId,
            })),
        }))
        : [{
            sku: values.product.standaloneVariant.sku,
            variations: [],
        }];

    return {
        product: {
            name: values.product.name,
            categoryId: values.product.category?.id || "",
            condition: "NEW",
            slug: generateSlug(values.product.name),
            variants: mappedVariants,
        },
        variantTypes: values.variationTypes.map((type) => ({
            typeId: type.uuid,
            options: type.options
                .filter((option) => option.uuid !== "")
                .map((option) => ({
                    optionId: option.uuid,
                })),
        })),
    };
}

export default function ProductNewForm({ onLifecycleEvent }: ProductNewFormProps) {
    const createProductLink = useCatalogLink("createProduct");
    const form = useForm<ProductFormValue>({
        defaultValues: DEFAULT_PRODUCT_FORM_VALUE,
        mode: "onSubmit"
    });

    const { handleSubmit, reset, formState: { isDirty } } = form;

    const createProductApi = useProductMutation();

    useEffect(() => {
        if (createProductApi.isSuccess) {
            onLifecycleEvent?.({ type: "created" });
            const timer = setTimeout(() => {
                createProductApi.reset();
                reset();
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [createProductApi.isSuccess, createProductApi, reset, onLifecycleEvent]);

    useEffect(() => {
        if (createProductApi.isError) {
            onLifecycleEvent?.({ type: "createFailed" });
            const timer = setTimeout(() => {
                createProductApi.reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [createProductApi.isError, createProductApi, onLifecycleEvent]);

    const handleFormSubmit = async (values: ProductFormValue) => {
        if (!createProductLink) return;
        const payload = buildCreatePayload(values);
        try {
            await createProductApi.mutateAsync({ link: createProductLink, request: payload });
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-6">
                <Card>
                    <CardContent>
                        <ProductBasicFieldSet />
                        <Separator className="my-6" />
                        <ProductVariationFieldSet />
                    </CardContent>
                    {isDirty && (
                        <CardFooter className="flex justify-end border-t">
                            <ButtonGroup>
                                <ButtonGroup>

                                    <Button type="submit" disabled={createProductApi.isPending}>
                                        <ButtonStatus status={
                                            createProductApi.isPending
                                                ? "pending"
                                                : createProductApi.isSuccess
                                                    ? "success"
                                                    : createProductApi.isError
                                                        ? "failed"
                                                        : "idle"
                                        }
                                            pendingLabel="Saving…"
                                            successLabel="Saved">
                                            Save Changes
                                        </ButtonStatus>
                                    </Button>

                                </ButtonGroup>
                            </ButtonGroup>
                        </CardFooter>
                    )}
                </Card>
            </form>

        </FormProvider>
    )
}
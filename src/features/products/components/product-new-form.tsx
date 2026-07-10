import { FormProvider, useForm } from "react-hook-form"
import ProductBasicFieldSet from "./product-basic-fieldset";
import ProductVariationFieldSet from "./product-variation-fieldset";
import { generateSlug } from "@/features/products/utils";
import { useProductMutation } from "@/features/products/hooks/use-products";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Separator } from "@khinemyaezin/seller-ui/components/separator";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductFormValue, CreateProductRequest } from "../types";
import { useEffect } from "react";

export type ProductNewFormProps = {
    generateMatrixLink: HateoasLink,
    variationTypeSearchLink: HateoasLink,
    variationOptionSearchLink: HateoasLink,
    categorySearchLink: HateoasLink,
    createProductLink: HateoasLink,
    onSuccess?: () => void,
    onError?: () => void
}

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

export default function ProductNewForm({
    generateMatrixLink,
    variationTypeSearchLink,
    variationOptionSearchLink,
    categorySearchLink,
    createProductLink,
    onSuccess,
    onError
}: ProductNewFormProps) {
    const form = useForm<ProductFormValue>({
        defaultValues: DEFAULT_PRODUCT_FORM_VALUE,
        mode: "onSubmit"
    });

    const { handleSubmit, reset, formState: { isDirty } } = form;

    const createProductApi = useProductMutation();

    useEffect(() => {
        if (createProductApi.isSuccess) {
            onSuccess?.();
            const timer = setTimeout(() => {
                createProductApi.reset();
                reset();
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [createProductApi.isSuccess, createProductApi, onSuccess]);

    useEffect(() => {
        if (createProductApi.isError) {
            onError?.();
            const timer = setTimeout(() => {
                createProductApi.reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [createProductApi.isError, createProductApi, onError]);

    const handleFormSubmit = async (values: ProductFormValue) => {
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
                        <ProductBasicFieldSet
                            searchCategoryLink={categorySearchLink}
                        />
                        <Separator className="my-6" />
                        <ProductVariationFieldSet
                            generateMatrixLink={generateMatrixLink}
                            variationTypeSearchLink={variationTypeSearchLink}
                            variationOptionSearchLink={variationOptionSearchLink}
                        />
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

import { Button } from "@khinemyaezin/seller-ui/components/index"
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group"
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import ProductBasicFieldSet from "./product-basic-fieldset"
import ProductVariationFieldSet from "./product-variation-fieldset"
import { GetFullProductResponse, HateoasLink, ProductFormValue, UPDATE_INTENT, UpdateProductRequest } from "@/types"
import { generateSlug } from "@/features/products/utils"
import { useProductGet, useProductUpdateMutation } from "@/features/products/hooks/use-products"
import { getVariantName } from "@/features/products/adapters/variation-matrix"
import { ApiError } from "@/features/products/api"
import { isEqual } from "lodash"
import { useMemo, useEffect } from "react"
import { toast } from "sonner"
import { Separator } from "@khinemyaezin/seller-ui/components/separator"
import { resolveLink } from "@khinemyaezin/seller-api"

export type ProductEditFormProps = {
    generateMatrixLink: HateoasLink,
    variationTypeSearchLink: HateoasLink,
    variationOptionSearchLink: HateoasLink,
    categorySearchLink: HateoasLink,
    getProductLink: HateoasLink,
    productId: string
}

const DEFAULT_PRODUCT_FORM_VALUE: ProductFormValue = {
    product: {
        name: "",
        category: null,
        variants: [],
        standaloneVariant: {
            sku: ""
        }
    },
    variationTypes: [],
};

function determineUpdateIntent({
    hasVariationTypes,
    hasVariantChanges,
    hasVariationTypeChanges,
    hasStandaloneChanges,
}: {
    hasVariationTypes: boolean;
    hasVariationTypeChanges: boolean;
    hasVariantChanges: boolean;
    hasStandaloneChanges: boolean;
}): UPDATE_INTENT {
    if (hasVariationTypes && hasVariantChanges || hasVariationTypeChanges) return "FULL_SYNC";
    if (hasStandaloneChanges) return "COLLAPSE_TO_STANDALONE";
    return "LEAVE_AS_IS";
}

function buildUpdatePayload(values: ProductFormValue, intent: UPDATE_INTENT): UpdateProductRequest {
    const mappedVariants: UpdateProductRequest["variantSync"]["overrides"] =
        values.variationTypes.length > 0
            ? values.product.variants.map((variant) => ({
                sku: variant.sku,
                matrixKey: variant.matrixKey,
                variations: variant.variations.map((v) => ({
                    typeId: v.typeId,
                    optionId: v.optionId,
                })),
            }))
            : [{
                sku: values.product.standaloneVariant.sku ?? "",
                matrixKey: "",
                variations: [],
            }];

    const types: UpdateProductRequest["variantSync"]["variantTypes"] =
        values.variationTypes.map((type) => ({
            typeId: type.uuid,
            options: type.options
                .filter((option) => option.uuid !== "")
                .map((option) => ({
                    optionId: option.uuid,
                    optionName: option.name,
                })),
        }));

    return {
        name: values.product.name,
        categoryId: values.product.category?.id || "",
        condition: "NEW",
        slug: generateSlug(values.product.name),

        variantSync: {
            intent: intent,
            overrides: mappedVariants,
            variantTypes: types,
        },
    };
}

function normalizeForComparison(values: ProductFormValue): ProductFormValue {
    return {
        ...values,
        variationTypes: values.variationTypes.map((type) => ({
            ...type,
            options: type.options
                .filter((option) => option.uuid !== "")
                .map((option) => ({ uuid: option.uuid, name: option.name })),
        })),
    };
}

function transformProductToFormValue(apiData: GetFullProductResponse): ProductFormValue {
    const nameMap = Object.fromEntries(apiData.variantTypes.flatMap((t) =>
        t.options.map((o) => [o.optionId, o.optionName])));

    const standaloneVariant = apiData.variantTypes.length == 0
        && apiData.variants.find(v => v.variations.length === 0);

    return {
        product: {
            name: apiData.name,
            category: apiData?.category ?? {
                id: apiData.category.id,
                name: apiData.category.name
            },
            variants: apiData.variants.map((v) => ({
                name: getVariantName(v, nameMap),
                matrixKey: v.matrixKey,
                sku: v.sku,
                price: "",
                variations: v.variations.map((r) => ({
                    typeId: r.typeId,
                    optionId: r.optionId,
                })),
            })),
            standaloneVariant: standaloneVariant ? standaloneVariant : {
                sku: ""
            },
        },
        variationTypes: apiData.variantTypes.map((vt) => ({
            uuid: vt.typeId,
            name: vt.typeName,
            options: vt.options.map((o) => ({
                uuid: o.optionId,
                name: o.optionName,
            })),
        })),
    };
}

export default function ProductEditForm({
    generateMatrixLink,
    variationTypeSearchLink,
    variationOptionSearchLink,
    categorySearchLink,
    getProductLink,
    productId
}: ProductEditFormProps) {
    const form = useForm<ProductFormValue>({
        defaultValues: DEFAULT_PRODUCT_FORM_VALUE,
        mode: "onSubmit",
    });
    const { handleSubmit, control, reset, getFieldState, formState: { isDirty } } = form;
    const { data: productData, isLoading: isProductLoading } = useProductGet(getProductLink, productId);
    const productUpdateLink = resolveLink(productData?._links, "update-product");
    const updateProductMutation = useProductUpdateMutation();
    const watchedValues = useWatch({ control });

    const normalizedDefaults = useMemo(
        () => productData
            ? normalizeForComparison(transformProductToFormValue(productData))
            : normalizeForComparison(DEFAULT_PRODUCT_FORM_VALUE),
        [productData],
    );

    const isFormDirty = useMemo(
        () => !isEqual(normalizeForComparison(watchedValues as ProductFormValue), normalizedDefaults),
        [watchedValues, normalizedDefaults],
    );

    useEffect(() => {
        if (productData) {
            const formValue = transformProductToFormValue(productData);
            reset(formValue);
        }
    }, [productData, reset]);

    async function handleFormSubmit(values: ProductFormValue) {
        if (!productUpdateLink) return;
        const intent = determineUpdateIntent({
            hasVariationTypes: values.variationTypes.length > 0,
            hasVariationTypeChanges: getFieldState("variationTypes").isDirty,
            hasVariantChanges: getFieldState("product.variants").isDirty,
            hasStandaloneChanges: getFieldState("product.standaloneVariant").isDirty,
        });

        const payload = buildUpdatePayload(values, intent);

        try {
            await updateProductMutation.mutateAsync({ link: productUpdateLink, request: payload });
            toast.success("Product updated successfully", { position: "top-center" });
        } catch (error) {
            console.error("Failed to update product:", (error as ApiError).data);
        }
    }

    if (isProductLoading || !productData) {
        return (
            <div className="container mx-auto max-w-xl">
                <span className="text-muted">Loading product details...</span>
            </div>
        );
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
                    {isFormDirty && (
                        <CardFooter className="flex justify-end border-t">
                            <ButtonGroup>
                                <ButtonGroup>

                                    <Button type="submit" disabled={updateProductMutation.isPending}>
                                        {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
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
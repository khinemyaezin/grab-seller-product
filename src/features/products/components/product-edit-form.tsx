
import { Button, ButtonStatus, Skeleton } from "@khinemyaezin/seller-ui/components/index"
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group"
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import ProductBasicFieldSet from "./product-basic-fieldset"
import ProductVariationFieldSet from "./product-variation-fieldset"
import { generateSlug } from "@/features/products/utils"
import { useProductGet, useProductUpdateMutation, useProductDeleteMutation, useProductRestoreMutation } from "@/features/products/hooks/use-products"
import { getVariantName } from "@/features/products/adapters/variation-matrix"
import { isEqual } from "lodash"
import { useEffect, useMemo } from "react"
import { ApiError } from "@khinemyaezin/seller-api"
import { Separator } from "@khinemyaezin/seller-ui/components/separator"
import { HateoasLink, resolveLink } from "@khinemyaezin/seller-api"
import { ProductFormValue, UPDATE_INTENT, UpdateProductRequest, GetFullProductResponse } from "../types"

export type ProductEditFormProps = {
    generateMatrixLink: HateoasLink,
    variationTypeSearchLink: HateoasLink,
    variationOptionSearchLink: HateoasLink,
    categorySearchLink: HateoasLink,
    getProductLink: HateoasLink,
    productId: string,
    onResolvedTitle?: (name: string) => void,
    onSuccess?: () => void,
    onError?: () => void,
    onArchived?: () => void,
    onArchiveError?: () => void
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
    productId,
    onResolvedTitle,
    onSuccess,
    onError,
    onArchived,
    onArchiveError
}: ProductEditFormProps) {
    const form = useForm<ProductFormValue>({
        defaultValues: DEFAULT_PRODUCT_FORM_VALUE,
        mode: "onSubmit",
    });
    const { handleSubmit, control, reset, getFieldState, formState: { isDirty } } = form;
    const { data: productData, isLoading: isProductLoading, refetch } = useProductGet(getProductLink, productId);
    const productUpdateLink = resolveLink(productData?._links, "update-product");
    const productDeleteLink = resolveLink(productData?._links, "delete-product");
    const productRestoreLink = resolveLink(productData?._links, "restore-product");

    const updateProductMutation = useProductUpdateMutation();
    const deleteProductMutation = useProductDeleteMutation();
    const restoreProductMutation = useProductRestoreMutation();

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
        if (productData?.name) {
            onResolvedTitle?.(productData.name);
        }
    }, [productData?.name, onResolvedTitle]);

    useEffect(() => {
        if (productData) {
            const formValue = transformProductToFormValue(productData);
            reset(formValue);
        }
    }, [productData, reset]);

    useEffect(() => {
        if (updateProductMutation.isSuccess) {
            onSuccess?.();
            const timer = setTimeout(() => {
                refetch();
                updateProductMutation.reset();
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [updateProductMutation.isSuccess, refetch, updateProductMutation, onSuccess]);

    useEffect(() => {
        if (updateProductMutation.isError) {
            onError?.();
            const timer = setTimeout(() => {
                updateProductMutation.reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateProductMutation.isError, updateProductMutation, onError]);

    function handleFormSubmit(values: ProductFormValue) {
        if (!productUpdateLink) return;
        const intent = determineUpdateIntent({
            hasVariationTypes: values.variationTypes.length > 0,
            hasVariationTypeChanges: getFieldState("variationTypes").isDirty,
            hasVariantChanges: getFieldState("product.variants").isDirty,
            hasStandaloneChanges: getFieldState("product.standaloneVariant").isDirty,
        });

        const payload = buildUpdatePayload(values, intent);

        try {
            updateProductMutation.mutateAsync({ link: productUpdateLink, request: payload });
        } catch (error) {
            console.error("Failed to update product:", (error as ApiError).data);
        }
    }

    function handleArchive() {
        if (!productDeleteLink) return;
        deleteProductMutation.mutate(
            { link: productDeleteLink },
            {
                onSuccess: () => onArchived?.(),
                onError: () => onArchiveError?.(),
            },
        );
    }

    function handleOnRestore() {
        if (!productRestoreLink) return;
        restoreProductMutation.mutate(
            { link: productRestoreLink },
         
        );
    }

    if (isProductLoading || !productData) {
        return (
            <div className="container mx-auto max-w-xl">
                <div className="flex w-full max-w-xs flex-col gap-7">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                </div>
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
                    <CardFooter className="flex justify-end border-t">
                        <ButtonGroup>
                            <ButtonGroup>
                                {productRestoreLink && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={restoreProductMutation.isPending}
                                        onClick={handleOnRestore}>
                                        <ButtonStatus
                                            status={
                                                restoreProductMutation.isPending
                                                    ? "pending"
                                                    : restoreProductMutation.isSuccess
                                                        ? "success"
                                                        : restoreProductMutation.isError
                                                            ? "failed"
                                                            : "idle"
                                            }
                                            pendingLabel="Restoring"
                                            successLabel="Restored">
                                            Restore
                                        </ButtonStatus>
                                    </Button>
                                )}
                                {productDeleteLink && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={deleteProductMutation.isPending}
                                        onClick={handleArchive}>
                                        <ButtonStatus
                                            status={
                                                deleteProductMutation.isPending
                                                    ? "pending"
                                                    : deleteProductMutation.isSuccess
                                                        ? "success"
                                                        : deleteProductMutation.isError
                                                            ? "failed"
                                                            : "idle"
                                            }
                                            pendingLabel="Archiving"
                                            successLabel="Archived">
                                            Archive
                                        </ButtonStatus>
                                    </Button>
                                )}
                            </ButtonGroup>
                            {isFormDirty && (
                                <ButtonGroup>
                                    <Button type="submit" disabled={updateProductMutation.isPending}>
                                        <ButtonStatus
                                            status={
                                                updateProductMutation.isPending
                                                    ? "pending"
                                                    : updateProductMutation.isSuccess
                                                        ? "success"
                                                        : updateProductMutation.isError
                                                            ? "failed"
                                                            : "idle"
                                            }
                                            pendingLabel="Saving…"
                                            successLabel="Saved">
                                            Save
                                        </ButtonStatus>
                                    </Button>
                                </ButtonGroup>
                            )}
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </form>

        </FormProvider>
    )

}
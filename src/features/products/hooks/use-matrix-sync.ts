
import { useCallback, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useVariationMatrixMutation } from "@/features/products/hooks/use-variation-matrix";
import { buildMatrixRequest, buildStructuralFingerprint, responseToVariant } from "@/features/products/adapters/variation-matrix";
import type { ProductFormValue, VariationType } from "@/features/products/types";
import { HateoasLink } from "@/types";

export function useMatrixSync(link: HateoasLink) {
    const { getValues, setValue, control } = useFormContext<ProductFormValue>();
    const generateMatrix = useVariationMatrixMutation(link);
    const initTypes = getValues("variationTypes");
    const isInitializedRef = useRef(false);
    const variationTypes = useWatch({
        control,
        name: "variationTypes",
        defaultValue: initTypes
    });
    const lastFingerprintRef = useRef<string>('');
    console.log("reload")

    const regenerate = useCallback(async (types: VariationType[]) => {
        const variants = getValues("product.variants");
        const request = buildMatrixRequest(types, variants);

        const hasValidOptions = request.variantTypes.some((t) => t.options.length > 0);
        if (!hasValidOptions) {
            setValue("product.variants", []);
            return;
        }

        try {
            const res = await generateMatrix.mutateAsync(request);
            const next = responseToVariant(res, variants, types);
            setValue("product.variants", next);
        } catch {

        }
    }, [generateMatrix, getValues, setValue]);

    useEffect(() => {
        if (!variationTypes) return;

        const fingerprint = buildStructuralFingerprint(variationTypes);

        if (variationTypes.length === 0) {
            return;
        }

        if (!isInitializedRef.current) {
            lastFingerprintRef.current = fingerprint;
            isInitializedRef.current = true;
            return;
        }

        if (fingerprint !== lastFingerprintRef.current) {
            lastFingerprintRef.current = fingerprint;
            regenerate(variationTypes);
        }
    }, [variationTypes]);
    return { isGenerating: generateMatrix.isPending };
}

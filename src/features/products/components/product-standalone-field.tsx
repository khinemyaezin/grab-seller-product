import { Input } from "@grab/seller-ui/components/index";
import { useController, UseControllerProps } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@grab/seller-ui/components/field";

export default function ProductStandaloneVariantField({ ...props }: UseControllerProps) {
    const { field, fieldState } = useController(props);
    return (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="input-standalone-sku">SKU (Stock Keeping Unit)</FieldLabel>
            <Input
                id="input-standalone-sku"
                aria-invalid={fieldState.invalid}
                {...field}
            />
            {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
            )}
        </Field>
    );
}

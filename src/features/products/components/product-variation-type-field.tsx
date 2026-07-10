
import { useController, UseControllerProps, useFieldArray, UseFormGetValues, useWatch } from "react-hook-form";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@khinemyaezin/seller-ui/components/field";
import { useVariationType } from "@/features/products/hooks/use-type";
import { VariationOptionField } from "./product-variation-option-field";
import { SearchIcon, Trash } from "lucide-react";
import type { ProductFormValue, VariationType, GetVariationTypeResult } from "@/features/products/types";
import { MagicSearch } from "@khinemyaezin/seller-ui/components/magic-search";
import { useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@khinemyaezin/seller-ui/components/input-group";
import { HateoasLink } from "@khinemyaezin/seller-api";

type VariationTypeRowProps = {
    typeSearchlink: HateoasLink;
    optionSearchLink: HateoasLink;
    index: number;
    onRemove: () => void;
    getValues: UseFormGetValues<ProductFormValue>
};

export function VariationTypeField({
    typeSearchlink,
    optionSearchLink,
    index,
    onRemove,
    control,
    getValues
}: UseControllerProps<ProductFormValue> & VariationTypeRowProps) {
    const { field, fieldState } = useController({
        control,
        name: `variationTypes.${index}`,
        rules: {
            validate: (value) => !!value?.uuid || "Variation Type is required.",
        }
    });
    const [query, setQuery] = useState<string>(field.value?.name);
    const { data } = useVariationType(typeSearchlink, query);

    const { fields, append, remove } = useFieldArray({
        control,
        name: `variationTypes.${index}.options`
    });

    const watchedOptions = useWatch({
        control,
        name: `variationTypes.${index}.options`
    });

    const watchedType = useWatch({
        control,
        name: `variationTypes.${index}`
    })

    useEffect(() => {
        if (!watchedOptions || watchedOptions.length === 0) return;

        const lastOption = watchedOptions[watchedOptions.length - 1];

        if (lastOption?.uuid !== "") {
            append({ uuid: "", name: "" }, { shouldFocus: false });
        }

        watchedOptions.forEach((option, optionIndex) => {
            if (optionIndex !== watchedOptions.length - 1 && option.uuid === "" && option.name === "") {
                remove(optionIndex);
            }
        });
    }, [watchedOptions]);

    useEffect(() => {
        if (watchedType.uuid && watchedType.uuid !== "" && fields.length === 0) {
            append({ uuid: "", name: "" });
        }
        if (watchedType.uuid == '' && fields.length > 0) {
            remove();
        }
    }, [watchedType])

    const getFilteredItems = (response: GetVariationTypeResult) => {
        const data: VariationType[] = response.types.map(t => ({
            uuid: t.id,
            name: t.name,
            options: []
        }));

        const types = getValues("variationTypes");
        const existingTypeIds = new Set(types.map((t) => t.uuid));
        return (data || [])
            .filter((t) => !existingTypeIds.has(t.uuid) || t.uuid === types[index].uuid)
            .map(t => ({ id: t.uuid, name: t.name }));
    };

    return (
        <Field className="border-b p-6" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`input-type-name-${index}`}>
                Option name
            </FieldLabel>
            <ButtonGroup>
                <MagicSearch
                    items={data ? getFilteredItems(data) : []}
                    initialQuery={field.value?.name}
                    onQueryChange={setQuery}
                    onQueryClear={() => {
                        field.onChange({ ...field.value, uuid: "", name: "" });
                    }}
                    onSelect={(item) => {
                        field.onChange({ ...field.value, uuid: item.id, name: item.name });
                    }}
                    renderInput={(props) => (
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                <SearchIcon className="text-muted-foreground" />
                            </InputGroupAddon>
                            <InputGroupInput
                                {...props}
                                id={`input-type-name-${index}`}
                                placeholder="Search variation option"
                                aria-invalid={fieldState.invalid}
                            />
                        </InputGroup>
                    )}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={onRemove}
                >
                    <Trash />
                </Button>
            </ButtonGroup>

            {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
            )}

            {fields.length > 0 && (
                <FieldSet>
                    <FieldLegend variant="label">Option values</FieldLegend>
                    <FieldGroup className="gap-3">
                        {fields.map((_option, optionIndex) => (
                            <VariationOptionField
                                key={_option.id}
                                index={optionIndex}
                                typeIndex={index}
                                control={control}
                                showTrash={optionIndex !== fields.length - 1}
                                onRemove={() => remove(optionIndex)} name={"product"}
                                getValues={getValues}
                                link={optionSearchLink} />
                        ))}
                    </FieldGroup>
                </FieldSet>
            )}
        </Field>
    );
}

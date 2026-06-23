
import { useEffect, useState } from "react";
import { FormProvider, useController, UseControllerProps, useForm, useWatch } from "react-hook-form";
import { SearchIcon, X } from "lucide-react";
import { useDebounce } from "@/features/products/hooks/use-debounce";
import { ProductFilterFormValue } from "@/features/products/types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@khinemyaezin/seller-ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";

export type ProductsFilterProps = {
  value: ProductFilterFormValue;
  pageSizes: number[];
  onChange: (filter: ProductFilterFormValue) => void;
};

export default function ProductsFilter({ onChange, pageSizes, value }: ProductsFilterProps) {
  const form = useForm<ProductFilterFormValue>({
    mode: "onChange",
    defaultValues: value,
  });
  const { control, trigger } = form;
  const watchedValues = useWatch({ control });

  useEffect(() => {
    let isSubscribed = true;

    async function notifyChange() {
      const isValid = await trigger();

      if (isSubscribed && isValid) {
        onChange({
          productName: watchedValues.productName ?? "",
          page: 0,
          size: Number(watchedValues.size ?? pageSizes[0]),
        });
      }
    }

    notifyChange();

    return () => {
      isSubscribed = false;
    };
  }, [onChange, pageSizes, trigger, watchedValues.productName, watchedValues.size]);

  return (
    <FormProvider {...form}>
      <InputGroup className="overflow-hidden">
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <ProductNameInput control={control} name="productName" />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-xs text-muted-foreground">Page size</InputGroupText>
          <SizeSelect control={control} name="size" pageSizes={pageSizes} />
        </InputGroupAddon>
      </InputGroup>
    </FormProvider>
  );
}

function ProductNameInput(props: UseControllerProps<ProductFilterFormValue>) {
  const { field } = useController(props);
  const [query, setQuery] = useState(String(field.value ?? ""));
  const { debounceFn } = useDebounce((value: string) => field.onChange(value), 300);

  useEffect(() => {
    debounceFn(query);
  }, [debounceFn, query]);

  return (
    <>
      <InputGroupInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search and filter"
      />

      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear product search"
            title="Clear product search"
            size="icon-xs"
            onClick={() => setQuery("")}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
      <InputGroupAddon align="inline-end">
        <div className="h-4 w-[1px] bg-border shrink-0" />
      </InputGroupAddon>
    </>
  );
}

function SizeSelect({
  pageSizes,
  ...controllerProps
}: UseControllerProps<ProductFilterFormValue> & { pageSizes: number[] }) {
  const { field } = useController(controllerProps);

  return (
    <Select
      value={String(field.value)}
      onValueChange={(value) => field.onChange(Number(value))}
    >
      <SelectTrigger className="font-mono border-0 focus:ring-0 focus:ring-offset-0 bg-transparent h-full rounded-l-none text-muted-foreground text-xs justify-end gap-1 -mr-2">
        <SelectValue placeholder="Page size" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          {pageSizes.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

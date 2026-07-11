
import { useEffect, useState } from "react";
import { FormProvider, useController, UseControllerProps, useForm, useWatch } from "react-hook-form";
import { SearchIcon, X } from "lucide-react";
import type { ProductSearchCriteria } from "@/features/products/hooks/use-product-filter";
import { useDebounce } from "@khinemyaezin/seller-ui";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import { ProductStatus } from "../types/catalog.model";

const PAGE_SIZES = [5, 10, 20]
const PRODUCT_STATUS: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED", "SUSPENDED"]

type FilterFormValue = {
  productName: string;
  productStatus: ProductStatus | null;
  size: number;
};

const DEFAULT_FILTER: FilterFormValue = {
  productName: "",
  productStatus: null,
  size: PAGE_SIZES[0],
};

export type ProductsFilterProps = {
  onChange: (criteria: ProductSearchCriteria) => void;
};

export default function ProductsFilter({ onChange }: ProductsFilterProps) {
  const form = useForm<FilterFormValue>({
    mode: "onChange",
    defaultValues: DEFAULT_FILTER,
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
          productStatus: watchedValues.productStatus ?? null,
          size: Number(watchedValues.size ?? PAGE_SIZES[0]),
        });
      }
    }

    notifyChange();

    return () => {
      isSubscribed = false;
    };
  }, [onChange, trigger, watchedValues.productName, watchedValues.productStatus, watchedValues.size]);

  return (
    <FormProvider {...form}>
      <InputGroup className="overflow-hidden">
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <ProductNameInput control={control} name="productName" />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-xs text-muted-foreground">Status</InputGroupText>
          <ProductStatusSelect control={control} name="productStatus" productStatus={PRODUCT_STATUS} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-xs text-muted-foreground">Page size</InputGroupText>
          <SizeSelect control={control} name="size" pageSizes={PAGE_SIZES} />
        </InputGroupAddon>
      </InputGroup>
    </FormProvider>
  );
}

function ProductNameInput(props: UseControllerProps<FilterFormValue>) {
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
}: UseControllerProps<FilterFormValue> & { pageSizes: number[] }) {
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

function ProductStatusSelect({
  productStatus,
  ...controllerProps
}: UseControllerProps<FilterFormValue, "productStatus"> & { productStatus: ProductStatus[] }) {
  const { field } = useController(controllerProps);

  return (
    <Select
      value={field.value ?? "ALL"}
      onValueChange={(value) => field.onChange(value === "ALL" ? null : value)}
    >
      <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent h-full rounded-none text-muted-foreground text-xs justify-end gap-1">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          <SelectLabel>Product Status</SelectLabel>
          <SelectItem value="ALL">All</SelectItem>
          {productStatus.map((item) => (
            <SelectItem key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}


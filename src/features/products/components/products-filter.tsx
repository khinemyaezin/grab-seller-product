
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FormProvider, useController, UseControllerProps, useForm, useWatch } from "react-hook-form";
import { SearchIcon, X } from "lucide-react";
import type { ProductSearchCriteria } from "@/features/products/hooks/use-product-filter";
import { useDebounce } from "@khinemyaezin/seller-ui";
import { Field, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
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
  const { control, reset, trigger } = form;
  const [resetCount, setResetCount] = useState(0);
  const watchedValues = useWatch({ control });
  const hasActiveFilters =
    Boolean(watchedValues.productName) ||
    (watchedValues.productStatus !== null && watchedValues.productStatus !== undefined) ||
    Number(watchedValues.size ?? DEFAULT_FILTER.size) !== DEFAULT_FILTER.size;
  const resetFilter = () => {
    reset(DEFAULT_FILTER);
    setResetCount((count) => count + 1);
  };

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
      <form
        className="flex w-full flex-col gap-3 rounded-md sm:flex-row sm:items-end sm:justify-between"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid w-full gap-3 sm:grid-cols-[minmax(16rem,1fr)_minmax(10rem,13rem)_minmax(8rem,10rem)]">
          <FilterField label="Search" htmlFor="product-name-filter">
            <ProductNameInput
              control={control}
              name="productName"
              inputId="product-name-filter"
              resetCount={resetCount}
            />
          </FilterField>
          <FilterField label="Status" htmlFor="product-status-filter">
            <ProductStatusSelect
              control={control}
              name="productStatus"
              productStatus={PRODUCT_STATUS}
              triggerId="product-status-filter"
            />
          </FilterField>
          <FilterField label="Rows" htmlFor="product-size-filter">
            <SizeSelect control={control} name="size" pageSizes={PAGE_SIZES} triggerId="product-size-filter" />
          </FilterField>
        </div>
      </form>
    </FormProvider>
  );
}

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <Field className="gap-1.5">
      <FieldLabel htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">{label}</FieldLabel>
      {children}
    </Field>
  );
}

function ProductNameInput({
  inputId,
  resetCount,
  ...controllerProps
}: UseControllerProps<FilterFormValue, "productName"> & { inputId: string; resetCount: number }) {
  const { field } = useController(controllerProps);
  const [query, setQuery] = useState(String(field.value ?? ""));
  const { debounceFn } = useDebounce((value: string) => field.onChange(value), 300);

  useEffect(() => {
    if (!field.value) {
      setQuery("");
    }
  }, [field.value]);

  useEffect(() => {
    setQuery("");
  }, [resetCount]);

  useEffect(() => {
    debounceFn(query);
  }, [debounceFn, query]);

  return (
    <InputGroup className="overflow-hidden">
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        id={inputId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
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
    </InputGroup>
  );
}

function SizeSelect({
  pageSizes,
  triggerId,
  ...controllerProps
}: UseControllerProps<FilterFormValue, "size"> & { pageSizes: number[]; triggerId: string }) {
  const { field } = useController(controllerProps);

  return (
    <Select
      value={String(field.value)}
      onValueChange={(value) => field.onChange(Number(value))}
    >
      <SelectTrigger id={triggerId} className="w-full">
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
  triggerId,
  ...controllerProps
}: UseControllerProps<FilterFormValue, "productStatus"> & { productStatus: ProductStatus[]; triggerId: string }) {
  const { field } = useController(controllerProps);

  return (
    <Select
      value={field.value ?? "ALL"}
      onValueChange={(value) => field.onChange(value === "ALL" ? null : (value as ProductStatus))}
    >
      <SelectTrigger id={triggerId} className="w-full">
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

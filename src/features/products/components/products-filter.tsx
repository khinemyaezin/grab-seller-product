import { useCallback } from "react";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import type { ProductSearchCriteria } from "@/features/products/hooks/use-product-filter";
import { ProductStatus } from "../types/catalog.model";

const PAGE_SIZES = [5, 10, 20];
const PRODUCT_STATUS: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED", "SUSPENDED"];
const ALL = "ALL";
const DEFAULT_SIZE = 5;

const FIELDS: FilterField[] = [
  {
    type: "input",
    name: "productName",
    label: "Search",
    placeholder: "Search products",
    debounceMs: 300,
  },
  {
    type: "select",
    name: "productStatus",
    label: "Status",
    placeholder: "Status",
    groupLabel: "Product Status",
    options: [
      { label: "All", value: ALL },
      ...PRODUCT_STATUS.map((status) => ({
        label: formatProductStatus(status),
        value: status,
      })),
    ],
  },
  {
    type: "select",
    name: "size",
    label: "Rows",
    placeholder: "Page size",
    options: PAGE_SIZES.map((size) => ({ label: String(size), value: String(size) })),
  },
];

const DEFAULT_VALUES: FilterValues = {
  productName: "",
  productStatus: ALL,
  size: String(DEFAULT_SIZE),
};

export type ProductsFilterProps = {
  onChange: (criteria: ProductSearchCriteria) => void;
};

export default function ProductsFilter({ onChange }: ProductsFilterProps) {
  const handleChange = useCallback(
    (values: FilterValues) => {
      const productName = typeof values.productName === "string" ? values.productName.trim() : "";
      const productStatus = values.productStatus === ALL ? null : (values.productStatus as ProductStatus);

      onChange({
        productName,
        productStatus,
        size: Number(values.size ?? DEFAULT_SIZE),
      });
    },
    [onChange]
  );

  return (
    <Filter
      fields={FIELDS}
      defaultValues={DEFAULT_VALUES}
      onChange={handleChange}
      className="lg:grid-cols-[minmax(16rem,1fr)_minmax(10rem,13rem)_minmax(8rem,10rem)]"
    />
  );
}

function formatProductStatus(status: ProductStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

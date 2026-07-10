
import { Link } from "react-router";
import { useCallback, useState } from "react";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { ProductFilterFormValue } from "@/features/products/types";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import ProductTable from "./product-table";
import ProductsFilter from "./products-filter";

const PAGE_SIZES = [5, 10];

function getInitialProductFilterFormValue(): ProductFilterFormValue {
  return {
    productName: "",
    page: 0,
    size: PAGE_SIZES[0],
  };
}

import type { ProductLifecycleEvent } from "@/features/products/types";

export type ProductsViewProps = {
  link: HateoasLink;
  canCreate: boolean;
  onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};

export default function ProductsView({ link, canCreate, onLifecycleEvent }: ProductsViewProps) {
  const [filter, setFilter] = useState<ProductFilterFormValue>(getInitialProductFilterFormValue());

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleFilterChange = useCallback((value: ProductFilterFormValue) => {
    setFilter(value);
  }, []);

  return (
    <Card >
      <CardHeader className="gap-3">
        <ProductsFilter
          value={filter}
          pageSizes={PAGE_SIZES}
          onChange={handleFilterChange} />
        <CardAction>
          {canCreate && (
            <Button variant="secondary" asChild>
              <Link to="new">Add product</Link>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">

        <ProductTable
          link={link}
          filter={filter}
          onPageChange={handlePageChange}
          onLifecycleEvent={onLifecycleEvent}
        />
      </CardContent>
    </Card>
  );
}

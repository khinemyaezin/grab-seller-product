
import { Link } from "react-router";
import { useCallback, useState } from "react";
import { routes } from "@khinemyaezin/seller-contracts";
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

export type ProductsViewProps = {
  link: HateoasLink;
  canCreate: boolean;
};

export default function ProductsView({ link, canCreate }: ProductsViewProps) {
  const [filter, setFilter] = useState<ProductFilterFormValue>(getInitialProductFilterFormValue());

  const handleFilterChange = useCallback((value: ProductFilterFormValue) => {
    setFilter(value);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  return (
    <Card >
      <CardHeader>
        <CardTitle>Product list</CardTitle>
        <CardAction>
          {canCreate && (
            <Button>
              <Link to={routes.newProduct}>Add product</Link>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        <ProductsFilter
          value={filter}
          pageSizes={PAGE_SIZES}
          onChange={handleFilterChange}
        />

        <ProductTable
          link={link}
          filter={filter}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}

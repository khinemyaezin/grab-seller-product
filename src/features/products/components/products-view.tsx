
import { Link } from "react-router";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Card, CardAction, CardContent, CardHeader } from "@khinemyaezin/seller-ui/components/card";
import ProductTable from "./product-table";
import ProductsFilter from "./products-filter";
import { useProductFilter } from "@/features/products/hooks/use-product-filter";

import type { ProductLifecycleEvent } from "@/features/products/types";

export type ProductsViewProps = {
  link: HateoasLink;
  canCreate: boolean;
  onLifecycleEvent?: (event: ProductLifecycleEvent) => void;
};

export default function ProductsView({ link, canCreate, onLifecycleEvent }: ProductsViewProps) {
  const { filter, updateCriteria, updatePage } = useProductFilter();

  return (
    <Card className="gap-3">
      <CardHeader className="gap-3">
        <ProductsFilter onChange={updateCriteria} />
        <CardAction>
          {canCreate && (
            <Button variant="outline" asChild>
              <Link to="new">Add product</Link>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        <ProductTable
          link={link}
          filter={filter}
          onPageChange={updatePage}
          onLifecycleEvent={onLifecycleEvent}
        />
      </CardContent>
    </Card>
  );
}

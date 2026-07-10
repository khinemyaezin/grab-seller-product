
import { Link } from "react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProductSearch, useProductDeleteMutation } from "@/features/products/hooks/use-products";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { GetFeaturedProductResponse, ProductFilterFormValue } from "@/features/products/types";
import { PageInfo } from "@khinemyaezin/seller-api";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Badge, Button } from "@khinemyaezin/seller-ui/components/index";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { Ellipsis } from "lucide-react";

const DEFAULT_PAGE_INFO: PageInfo = {
  number: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

type FeatureProduct = {
  productId: string;
  name: string;
  status: string;
  slug: string;
  categoryName: string;
  _links?: Record<string, HateoasLink>;
};

export type ProductTableProps = {
  link: HateoasLink;
  filter: ProductFilterFormValue;
  onPageChange?: (page: number) => void;
};

function transformToProducts(data?: GetFeaturedProductResponse): FeatureProduct[] {
  return data?._embedded ? data._embedded.productSummaryResponseList.map((product) => ({
    productId: product.id,
    name: product.name,
    status: product.status,
    slug: product.slug,
    categoryName: product.categoryName,
    _links: product._links
  })) : [];
}

export default function ProductTable({ link, filter, onPageChange }: ProductTableProps) {
  const { data } = useProductSearch(link, filter);
  const platform = usePlatform();
  const deleteProductMutation = useProductDeleteMutation();
  const [showPagination, setShowPagination] = useState<boolean>(false);
  const products = useMemo(() => transformToProducts(data), [data]);

  const handleArchive = useCallback(
    (deleteLink: HateoasLink, name: string) => {
      deleteProductMutation.mutate(
        { link: deleteLink },
        {
          onSuccess: () =>
            platform?.events.publish("shell:toast:v1", { type: "success", message: `${name} archived`, position: "top-center" }),
          onError: () =>
            platform?.events.publish("shell:toast:v1", { type: "error", message: `Failed to archive ${name}`, position: "top-center" }),
        },
      );
    },
    [deleteProductMutation, platform],
  );

  useEffect(() => {
    if (data) {
      setShowPagination(data.page.totalPages > 1)
    }
  },
    [data, filter]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell className="font-medium">
                {product.name}
              </TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell><Badge variant="secondary">{product.status}</Badge></TableCell>
              <TableCell>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-xs">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      {hasLink(product._links, "update-product") && (
                        <DropdownMenuItem asChild>
                          <Link to={product.productId}>Edit</Link>
                        </DropdownMenuItem>
                      )}

                      {resolveLink(product._links, "delete-product") && (
                        <DropdownMenuItem
                          disabled={deleteProductMutation.isPending}
                          onClick={() => handleArchive(resolveLink(product._links, "delete-product")!, product.name)}>
                          Archive
                        </DropdownMenuItem>
                      )}

                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-muted-foreground pointer-events-none text-center">
              No record found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showPagination && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1} className="text-muted-foreground">
              Showing {products.length} of {data?.page.totalElements} products
            </TableCell>
            <TableCell colSpan={3}>
              {data?.page && (
                <Pager
                  className="justify-end"
                  onPageChange={onPageChange}
                  {...data?.page}
                />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

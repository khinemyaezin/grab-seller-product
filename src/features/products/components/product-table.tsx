
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { routes } from "@khinemyaezin/seller-contracts";
import { useProductSearch } from "@/features/products/hooks/use-products";
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
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { hasLink } from "@khinemyaezin/seller-api";
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
  const [showPagination, setShowPagination] = useState<boolean>(false);
  const products = useMemo(() => transformToProducts(data), [data]);

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
              <TableCell>{product.status}</TableCell>
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
                          <Link to={routes.editProduct(product.productId)}>Edit</Link>
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
            <TableCell colSpan={2}>
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

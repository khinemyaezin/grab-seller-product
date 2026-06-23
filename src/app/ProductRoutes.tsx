import { Route, Routes } from "react-router";
import ProductListPage from "@/features/products/pages/product-list-page";
import ProductCreatePage from "@/features/products/pages/product-create-page";
import ProductEditPage from "@/features/products/pages/product-edit-page";
import { ProductLinkProvider } from "@/features/products/context/product-link-context";
import { HateoasLink } from "@khinemyaezin/seller-api";

export default function ProductRoutes({link}: {link: HateoasLink}) {
  return (
    <ProductLinkProvider link={link}>
      <Routes>
      <Route index element={<ProductListPage />} />
      <Route path="new" element={<ProductCreatePage />} />
      <Route path=":productId" element={<ProductEditPage />} />
    </Routes>
    </ProductLinkProvider>
  );
}

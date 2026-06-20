import { Route, Routes } from "react-router";
import ProductListPage from "@/features/products/pages/product-list-page";
import ProductCreatePage from "@/features/products/pages/product-create-page";
import ProductEditPage from "@/features/products/pages/product-edit-page";

export default function ProductRoutes() {
  return (
    <Routes>
      <Route index element={<ProductListPage />} />
      <Route path="new" element={<ProductCreatePage />} />
      <Route path=":productId" element={<ProductEditPage />} />
    </Routes>
  );
}

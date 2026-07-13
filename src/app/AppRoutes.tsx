import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { EntryLinkProvider, PlatformProvider, NotFoundPage } from "@khinemyaezin/seller-ui";
import { Route, Routes } from "react-router";
import ProductListPage from "@/features/products/pages/product-list-page";
import ProductCreatePage from "@/features/products/pages/product-create-page";
import ProductEditPage from "@/features/products/pages/product-edit-page";
import "../styles.css";

export default function AppRoutes({ link, platform }: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <div className="seller-product-mfe">
      <PlatformProvider platform={platform}>
        <EntryLinkProvider link={link}>
          <Routes>
            <Route index element={<ProductListPage />} />
            <Route path="new" element={<ProductCreatePage />} />
            <Route path=":productId" element={<ProductEditPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </EntryLinkProvider>
      </PlatformProvider>
    </div>
  )
}

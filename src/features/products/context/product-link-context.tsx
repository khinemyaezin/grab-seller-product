import { createContext, ReactNode, useContext } from "react";
import { HateoasLink } from "@khinemyaezin/seller-api";

const ProductLinkContext = createContext<HateoasLink | null>(null);

function ProductLinkProvider({ link, children }: { link: HateoasLink, children: ReactNode }) {
  return (
    <ProductLinkContext.Provider value={link}>
      {children}
    </ProductLinkContext.Provider>
  );
}

function useProductLink() {
  const context = useContext(ProductLinkContext);
  if (!context) {
    throw new Error("useProductLink must be used within an ProductLinkProvider");
  }
  return context;
}

export { ProductLinkProvider, useProductLink };
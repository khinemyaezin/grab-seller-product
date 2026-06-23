import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import ProductRoutes from "./ProductRoutes";

export default function StandaloneApp() {
  const [client] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <main className="min-h-screen bg-background p-8">
            <Toaster />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/products" replace />} />
              <Route path="/dashboard/products/*" element={
                <ProductRoutes link={{href: import.meta.env.VITE_CATALOG_API_URL}} />
                } />
            </Routes>
          </main>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

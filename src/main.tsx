import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TokenContwxtProvider } from "./context/tokenContwxtProvider.tsx";
import UserContextProvider from "./context/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TokenContwxtProvider>
      <UserContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </UserContextProvider>
    </TokenContwxtProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);

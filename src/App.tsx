import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoute from "./routes/AppRoute";
import LoadingWrapper from "./components/common/LoadingWrapper";
import SnackbarWrapper from "./components/common/SnackbarWrapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoadingWrapper>
          <SnackbarWrapper>
            <AppRoute />
          </SnackbarWrapper>
        </LoadingWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

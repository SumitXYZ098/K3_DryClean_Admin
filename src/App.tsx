import { BrowserRouter } from "react-router";
import AppRoute from "./routes/AppRoute";
import LoadingWrapper from "./components/common/LoadingWrapper";
import SnackbarWrapper from "./components/common/SnackbarWrapper";

function App() {
  return (
    <BrowserRouter>
      <LoadingWrapper>
        <SnackbarWrapper>
          <AppRoute />
        </SnackbarWrapper>
      </LoadingWrapper>
    </BrowserRouter>
  );
}

export default App;

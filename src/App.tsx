import { BrowserRouter } from "react-router";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;

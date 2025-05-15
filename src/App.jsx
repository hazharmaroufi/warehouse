import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;

import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState("login");
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;

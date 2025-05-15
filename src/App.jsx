import { Route, Routes } from "react-router";
import ProductsList from "./components/ProductsList";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsList />} />
    </Routes>
  );
}

export default App;

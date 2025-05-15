import { useQuery } from "@tanstack/react-query";
import api from "../services/axiosData";

function ProductsPage() {
  const queryKey = ["products"];
  const queryFn = () =>
    api.get(`/products?page=1&limit=10`).then((response) => response.data.data);

  const {
    isLoading,
    data: items,
    error,
  } = useQuery({
    queryKey,
    queryFn,
  });
  if (isLoading) return "Loading...";
  if (error) return "Error";
  return (
    <>
      {items?.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </>
  );
}

export default ProductsPage;

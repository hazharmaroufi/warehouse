import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const queryKey = ["getItems"];
  const queryFn = () => {
    axios
      .get("http://localhost:3000/products?page=1&limit=10")
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { isPending, data } = useQuery({
    queryKey,
    queryFn,
  });
  if (isPending) return "Loading...";
  return (
    <>
      {items?.data?.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </>
  );
}

export default App;

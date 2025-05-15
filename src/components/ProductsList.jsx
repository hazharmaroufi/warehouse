import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function ProductsList() {
  const [items, setItems] = useState([]);
  const queryKey = ["getItems"];
  const queryFn = () => {
    return axios
      .get("http://localhost:3000/products?page=1&limit=10")
      .then((response) => {
        setItems(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw err;
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

export default ProductsList;

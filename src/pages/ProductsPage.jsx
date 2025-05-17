import { useQuery } from "@tanstack/react-query";
import api from "../services/axiosData";
import { useState } from "react";

function ProductsPage() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
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

  const editHandler = (id) => {
    console.log("edit", id);
  };
  const deleteHandler = (id) => {
    console.log("delete", id);
  };

  return (
    <>
      <table className="table-auto w-3xl text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>نام کالا</th>
            <th>موجودی</th>
            <th>قیمت</th>
            <th>شناسه کالا</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr
              key={item.id}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.id}</td>
              <td>
                {isAuth ? (
                  <div className="flex">
                    <button onClick={() => editHandler(item.id)}>
                      <img src="edit.png" alt="" />
                    </button>
                    <button onClick={() => deleteHandler(item.id)}>
                      <img src="trash.png" alt="" />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductsPage;

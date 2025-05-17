import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axiosData";
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required("username required"),
    quantity: yup
      .number()
      .typeError("Quantity must be a number")
      .required("Quantity is required"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required"),
  })
  .required();

function ProductsPage() {
  const [productId, setProductId] = useState("");
  const [ed, setEd] = useState("add");

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    api
      .post("/products", {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
      })
      .then(() => {
        queryClient.invalidateQueries(["products"]);
        setEd("add");
        reset();
        close();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onEdit = (data) => {
    api
      .put(`/products/${productId}`, {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
      })
      .then(() => {
        queryClient.invalidateQueries(["products"]);
        setEd("add");
        reset();
        close();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }

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
    setProductId(id);
    setEd("edit");

    open();
  };
  const deleteHandler = (id) => {
    api.delete(`/products/${id}`).then(() => {
      queryClient.invalidateQueries(["products"]);
    });
  };

  return (
    <>
      {isAuth ? (
        <button
          onClick={() => {
            setEd("add");
            open();
          }}
          className=" bg-blue-400 rounded m-2 p-2 cursor-pointer "
        >
          اضافه کردن محصول
        </button>
      ) : (
        ""
      )}

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

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-gray-500 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              {ed === "add" ? (
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-white"
                >
                  اضافه کردن محصول
                </DialogTitle>
              ) : (
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-white"
                >
                  ویرایش محصول
                </DialogTitle>
              )}
              {ed === "add" ? (
                <form onSubmit={handleSubmit(onSubmit)} className="">
                  <label htmlFor="name"> نام کالا</label> <br />
                  <input
                    {...register("name")}
                    id="name"
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                  />
                  <br />
                  <p>{errors.name?.message}</p>
                  <label htmlFor="quantity"> تعداد موجودی</label> <br />
                  <input
                    {...register("quantity")}
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                  />
                  <br />
                  <p>{errors.quantity?.message}</p>
                  <label htmlFor="price"> قیمت</label> <br />
                  <input
                    {...register("price")}
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                  />
                  <br />
                  <p>{errors.price?.message}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    >
                      اضافه کردن
                    </button>
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                      onClick={close}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit(onEdit)} className="">
                  <label htmlFor="name"> نام کالا</label> <br />
                  <input
                    {...register("name")}
                    id="name"
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                    placeholder={
                      items?.find((item) => item.id === productId)?.name || ""
                    }
                  />
                  <br />
                  <p>{errors.name?.message}</p>
                  <label htmlFor="quantity"> تعداد موجودی</label> <br />
                  <input
                    id="quantity"
                    {...register("quantity")}
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                    placeholder={
                      items?.find((item) => item.id === productId)?.quantity ||
                      ""
                    }
                  />
                  <br />
                  <p>{errors.quantity?.message}</p>
                  <label htmlFor="price"> قیمت</label> <br />
                  <input
                    {...register("price")}
                    id="price"
                    placeholder={
                      items?.find((item) => item.id === productId)?.price || ""
                    }
                    className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
                  />
                  <br />
                  <p>{errors.price?.message}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    >
                      ویرایش
                    </button>
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                      onClick={close}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ProductsPage;

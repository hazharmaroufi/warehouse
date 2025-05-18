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
    formState: { errors },
    reset,
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
        reset();
        setEd("add");
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
  // if (isLoading) return "Loading...";
  // if (error) return "Error";

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
      <div className="bg-gray-50 h-screen ">
        <div className="container m-auto pt-8 ">
          <div className="flex justify-between bg-white py-2 px-8 ">
            <div>
              <input type="search" name="" id="" placeholder="جستجوی کالا" />
            </div>
            <div> هه ژار معروفی</div>
          </div>

          <div className="flex justify-between items-center justify-items-center mt-8 mb-8 ">
            <div>
              <p className="text-xl">مدیریت کالا</p>
            </div>
            <div>
              {isAuth ? (
                <button
                  onClick={() => {
                    setEd("add");
                    open();
                  }}
                  className="bg-blue-300 text-white w-full  p-2 rounded-md"
                >
                  افزودن محصول
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          <table className="table-auto w-full">
            <thead className="text-sm text-gray-700  bg-gray-200  ">
              <tr>
                <th className="p-2 ">نام کالا</th>
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
                  className="text-sm text-gray-700  bg-white border-t-0 border-l-0 border-r-0 border-b-1 border-gray-50"
                >
                  <td className="p-2">{item.name}</td>
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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-gray-50 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                >
                  {ed === "add" ? (
                    <DialogTitle
                      as="h3"
                      className="text-center mb-4 font-medium "
                    >
                      اضافه کردن محصول
                    </DialogTitle>
                  ) : (
                    <DialogTitle
                      as="h3"
                      className="text-center mb-4 font-medium "
                    >
                      ویرایش اطلاعات
                    </DialogTitle>
                  )}
                  {ed === "add" ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="">
                      <label htmlFor="name"> نام کالا</label> <br />
                      <input
                        {...register("name")}
                        id="name"
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                      />
                      <br />
                      <p>{errors.name?.message}</p>
                      <label htmlFor="quantity"> تعداد موجودی</label> <br />
                      <input
                        {...register("quantity")}
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                      />
                      <br />
                      <p>{errors.quantity?.message}</p>
                      <label htmlFor="price"> قیمت</label> <br />
                      <input
                        {...register("price")}
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                      />
                      <br />
                      <p>{errors.price?.message}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="bg-blue-300 text-white w-full mt-6 p-2 rounded-md"
                        >
                          ایجاد
                        </button>
                        <Button
                          className="bg-gray-300  w-full mt-6 p-2 rounded-md text-black "
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
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                        placeholder={
                          items?.find((item) => item.id === productId)?.name ||
                          ""
                        }
                      />
                      <br />
                      <p>{errors.name?.message}</p>
                      <label htmlFor="quantity"> تعداد موجودی</label> <br />
                      <input
                        id="quantity"
                        {...register("quantity")}
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                        placeholder={
                          items?.find((item) => item.id === productId)
                            ?.quantity || ""
                        }
                      />
                      <br />
                      <p>{errors.quantity?.message}</p>
                      <label htmlFor="price"> قیمت</label> <br />
                      <input
                        {...register("price")}
                        id="price"
                        placeholder={
                          items?.find((item) => item.id === productId)?.price ||
                          ""
                        }
                        className=" bg-gray-200 w-full  mt-1 mb-4 rounded-md p-1"
                      />
                      <br />
                      <p>{errors.price?.message}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="bg-blue-300 text-white w-full mt-6 p-2 rounded-md"
                        >
                          ثبت اطلاعات جدید
                        </button>
                        <Button
                          className="bg-gray-300  w-full mt-6 p-2 rounded-md text-black "
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
        </div>
      </div>
    </>
  );
}

export default ProductsPage;

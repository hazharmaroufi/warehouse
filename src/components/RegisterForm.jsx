import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/axiosData";
import { useState } from "react";

const schema = yup
  .object({
    username: yup.string().required("username required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

function RegisterForm({ setMode, loginHandler }) {
  const [registerMessage, setRegisterMessage] = useState("");
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
      .post("/auth/register", {
        username: data.username,
        password: data.password,
      })
      .then(function (response) {
        console.log(response);
        setRegisterMessage(() => "user registered successfull");
        reset();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <p className="text-center mb-8">فرم ثبت نام</p>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <input
          {...register("username")}
          className=" bg-gray-50 w-72  mt-2 rounded-md p-1"
          placeholder=" نام کاربری"
        />
        <br />
        <p>{errors.username?.message}</p>
        <input
          {...register("password")}
          type="password"
          className=" bg-gray-50 w-72  mt-4 rounded-md p-1"
          placeholder=" رمز عبور"
        />
        <br />
        <p>{errors.password?.message}</p>
        <input
          {...register("confirmPassword")}
          type="password"
          className=" bg-gray-50 w-72  mt-4 rounded-md p-1"
          placeholder=" تکرار رمز عبور"
        />
        <br />
        <p>{errors.confirmPassword?.message}</p>
        <button
          className="bg-blue-300 text-white w-full mt-6 p-2 rounded-md"
          type="submit"
        >
          ثبت نام
        </button>
        <p>{registerMessage}</p>
        <button
          className="mt-2 text-sm text-blue-300"
          type="button"
          onClick={loginHandler}
        >
          حساب کاربری دارید؟
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;

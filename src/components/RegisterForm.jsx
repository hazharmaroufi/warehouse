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

function RegisterForm() {
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
    <div className=" m-8 rounded-md bg-white p-16 ">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <input
          {...register("username")}
          className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
        />
        <br />
        <p>{errors.username?.message}</p>
        <input
          {...register("password")}
          type="password"
          className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
        />
        <br />
        <p>{errors.password?.message}</p>
        <input
          {...register("confirmPassword")}
          type="password"
          className=" bg-amber-200 border-gray-400 border-2 mt-2 rounded-md "
        />
        <br />
        <p>{errors.confirmPassword?.message}</p>
        <button type="submit">عضویت</button>
        <p>{registerMessage}</p>
      </form>
    </div>
  );
}

export default RegisterForm;

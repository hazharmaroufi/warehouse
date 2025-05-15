import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/axiosData";

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
        reset();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className=" bg-gray-50 flex justify-center items-center  min-h-screen ">
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
        <input type="submit" />
      </form>
    </div>
  );
}

export default RegisterForm;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/axiosData";
import { useNavigate } from "react-router";

const schema = yup
  .object({
    username: yup.string().required("username required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    api
      .post("/auth/login", {
        username: data.username,
        password: data.password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/products");
      })
      .catch((error) => {
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

        <button type="submit">ورود</button>
      </form>
    </div>
  );
}

export default LoginForm;

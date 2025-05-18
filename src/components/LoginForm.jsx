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

function LoginForm({ setMode, loginHandler }) {
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
    <div>
      <p className="text-center mb-8">فرم ورود</p>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <input
          {...register("username")}
          className=" bg-gray-50 w-72  mt-4 rounded-md p-1"
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

        <button
          type="submit"
          className="bg-blue-300 text-white w-full mt-6 p-2 rounded-md"
        >
          ورود
        </button>
        <button
          className="mt-2 text-sm text-blue-300"
          type="button"
          onClick={loginHandler}
        >
          ایجاد حساب کاربری!
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

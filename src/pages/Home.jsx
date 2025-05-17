import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

function Home() {
  const [mode, setMode] = useState("register");
  const loginHandler = () => {
    setMode("login");
  };
  return (
    <>
      <div className=" bg-gray-100 flex justify-center items-center  min-h-screen ">
        {mode === "register" ? <RegisterForm /> : <LoginForm />}

        <button onClick={loginHandler}> حساب کاربری دارید؟ </button>
      </div>
    </>
  );
}

export default Home;

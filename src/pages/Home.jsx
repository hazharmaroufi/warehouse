import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

function Home() {
  const [mode, setMode] = useState("register");

  const loginHandler = () => {
    setMode((prevMode) => (prevMode === "register" ? "login" : "register"));
  };
  return (
    <>
      <div className=" bg-gray-100 flex flex-col justify-evenly items-center  min-h-screen ">
        <h1 className="text-4xl font-vazirmatn font-bold ">
          بوت کمپ بوتو استارت
        </h1>
        <div className=" bg-white py-16 px-16 rounded-3xl">
          <img src="Union.png" alt="" className=" m-auto mb-4 " />
          {mode === "register" ? (
            <RegisterForm
              setMode={setMode}
              loginHandler={loginHandler}
              mode={mode}
            />
          ) : mode === "login" ? (
            <LoginForm
              setMode={setMode}
              loginHandler={loginHandler}
              mode={mode}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

function Home() {
  const [mode, setMode] = useState("register");
  return <>{mode === "register" ? <RegisterForm /> : <LoginForm />}</>;
}

export default Home;

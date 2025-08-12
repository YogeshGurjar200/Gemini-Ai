import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import AuthForm from "./features/auth/AuthForm";
import Dashboard from "./features/chatrooms/Dashboard";
import LoggingOut from "./components/LoggingOut ";

export default function App() {
  const isLoggedIn = useSelector((state) => state.auth?.userData?.isLoggedIn);
  const loadingLogout = useSelector((state) => state.auth?.loadingLogout);

  console.log(isLoggedIn);

  const theme = useSelector((state) => state.theme.value);
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {isLoggedIn ? <Dashboard /> : <AuthForm />}
      {loadingLogout && <LoggingOut />}
    </div>
  );
}

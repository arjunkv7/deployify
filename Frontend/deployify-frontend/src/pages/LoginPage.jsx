import React, { useEffect, useState } from "react";
import {  Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import axios from "axios";

const LoginPage = ({ isAuthenticated }) => {
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("hidden");
  let navigate = useNavigate();

  let userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${userServiceUrl}/login`,
        formData
      );
      console.log(response);
      if (response.status === 200) {
        setLoginError("hidden");
        let token = response.data.token;
        localStorage.setItem("token", token);
        setRedirect(true);
      }
      setLoginError("visible");
    } catch (error) {
      console.log(error.response.data);
      setLoginError("visible");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <LoginForm
        handleLogin={handleLogin}
        handleChange={handleChange}
        loginError={loginError}
      />
    </div>
  );
};

export default LoginPage;

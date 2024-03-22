import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import axios from "axios";

const SignupPage = ({ isAuthenticated }) => {
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({});

  let userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL


  let navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (redirect) {
    navigate("/");
  }
  async function handleSignup(e) {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${userServiceUrl}/signup`,
        formData
      );
      console.log(response);
      if (response.status === 200) {
        let token = response.data.token;
        localStorage.setItem("token", token);
        console.log(response)
        setRedirect(true);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <div>
      <SignupForm handleSignup={handleSignup} handleChange={handleChange} />
    </div>
  );
};

export default SignupPage;

import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import NewProjectForm from "../components/NewProjectForm";
import Layout from "../components/Layout";
import axios from "axios";
const DeployPage = ({ isAuthenticated }) => {
  const [formData, setFormData] = useState({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployId, setDeployId] = useState("");
  let token = localStorage.getItem("token");
  const navigate = useNavigate();

  let deployUrl = process.env.REACT_APP_DEPLOY_URL;
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleDeploy() {
    try {
      console.log("clicked");
      setIsDeploying(true);
      let response = await axios.post(
        deployUrl,
        formData,
        { headers: { token } }
      );
      if (response.status === 200) {
        let id = response.data.id;
        setDeployId(id);
        const interval = setInterval(async () => {
          const response = await axios.get(
            `${deployUrl}?id=${id}`,
            { headers: { token } }
          );

          if (response.data.status === "deployed") {
            clearInterval(interval);
            setIsDeployed(true);
          }
        }, 3000);
      }
    } catch (error) {
      // setIsDeployed(true)
      console.log(error);
    }
  }

  return (
    <>
      <Layout />
      <NewProjectForm
        handleDeploy={handleDeploy}
        handleChange={handleChange}
        isDeployed={isDeployed}
        isDeploying={isDeploying}
        uploadId={deployId}
      />
    </>
  );
};

export default DeployPage;

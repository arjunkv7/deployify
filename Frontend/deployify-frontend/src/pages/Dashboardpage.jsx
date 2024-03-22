import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import fetchProjects from "../services/projectServices";

const DashboardPage = ({ isAuthenticated }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData(); // Call the fetchData function to fetch and set projects
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <Dashboard projects={projects} />
    </>
  );
};

export default DashboardPage;

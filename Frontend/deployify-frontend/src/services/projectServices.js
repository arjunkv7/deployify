import axios from "axios";

export default async function fetchProjects() {
  try {
    let userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;
    let token = localStorage.getItem("token");
    const response = await axios.get(`${userServiceUrl}/deployments`, {
      headers: {
        token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

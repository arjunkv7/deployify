import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboardpage";
import DeployPage from "./pages/DeployPage";
import "./App.css";
import isAuthenticated from "./common/authentication";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<SignupPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/"
          element={<DashboardPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/deploy"
          element={<DeployPage isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

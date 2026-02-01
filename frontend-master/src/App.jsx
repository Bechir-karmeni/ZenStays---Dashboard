// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

// Public pages
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AcceptInvite from "./components/AcceptInvite";

// Layout / auth guard
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutComponent from "./components/LayoutModel/LayoutComponent";

// Dashboard & pages
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./components/Profile/Profile";
import Employees from "./pages/Employees";
import Scheduling from "./pages/Scheduling";
import MyAssessments from "./pages/MyAssessments";

function App() {
  return (
    <Router>
      <Routes>
        {/* ------- Public ------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        {/* ------- Protected with layout ------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutComponent>
                <Dashboard />
              </LayoutComponent>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LayoutComponent>
                <Profile />
              </LayoutComponent>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <LayoutComponent>
                <Employees />
              </LayoutComponent>
            </ProtectedRoute>
          }
        />

        {/* Client Dashboard */}
        <Route
          path="/my-assessments"
          element={
            <ProtectedRoute>
              <LayoutComponent>
                <MyAssessments />
              </LayoutComponent>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scheduling"
          element={
            <ProtectedRoute>
              <LayoutComponent>
                <Scheduling />
              </LayoutComponent>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

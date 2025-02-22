import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Help from "./page/Help";
import Contact from "./page/Contact";
import Aboutus from "./page/Aboutus";
import ComPage from "./page/ComPage";
import MoodIndex from "./page/moodIndex";
import Sphere from "./components/user/sphere";
import MoodEntry from "./page/moodEntry";
import MoodDashboard from "./page/moodDashboard";
import SuccessVerified from "./page/SucessVerified";
import TestAnxiety from "./page/testAnxiety";
import Recommend from "./page/recommend";
import CrisisSupport from "./page/CrisisSupport";
import TermsOfService from "./page/termsOfService";
import PrivacyPolicy from "./page/privacyPolicy";
import Authors from "./page/Authors";
import Siri from "./page/siri";
import DiaryEditor from "./page/Diary";
import UserLayout from "./components/user/Layout";
import ResetPassword from "./page/resetPassword";
import ResetPasswordRequest from "./page/resetPasswordRequest";
import AdminLayout from "./components/admin/Layout";
import AdminIndex from "./page/admin/index";
import AdminEmail from "./page/admin/email";
import AdminContact from "./page/admin/contacts";
import AdminProfile from "./page/admin/profile";
import AdminSpaces from "./page/admin/spaces";
import AdminUsers from "./page/admin/users";
import AdminPredictions from "./page/admin/Predictions";
import { ToastContainer } from "react-toastify";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes for user */}
        <Route
          path="/mood"
          element={<ProtectedRoute element={<MoodIndex />} />}
        />
        <Route path="/community" element={<ComPage />} />
        <Route index element={<Home />} />
        <Route path="/" element={<UserLayout />}>
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/author" element={<Authors />} />
          <Route path="/about" element={<Aboutus />} />

          <Route
            path="/mood-dashboard"
            element={<ProtectedRoute element={<MoodDashboard />} />}
          />

          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />

          <Route
            path="/test-anxiety"
            element={<ProtectedRoute element={<TestAnxiety />} />}
          />

          <Route path="/myDiary" element={<DiaryEditor />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/crisis-support" element={<CrisisSupport />} />
        </Route>

        <Route path="/success-verified/:token" element={<SuccessVerified />} />
        <Route path="/record-mood" element={<MoodEntry />} />
        <Route path="/sphere" element={<Sphere />} />
        <Route path="/siri" element={<Siri />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password-request"
          element={<ResetPasswordRequest />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/help" element={<Help />} />

        {/* Routes for admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminLayout />} adminOnly={true} />
          }
        >
          <Route index element={<AdminIndex />} />
          <Route path="email" element={<AdminEmail />} />
          <Route path="contacts" element={<AdminContact />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="spaces" element={<AdminSpaces />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="predictions" element={<AdminPredictions />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
};

export default App;

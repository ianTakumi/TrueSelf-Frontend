import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import { messaging } from "./configs/Firebase.config";

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
import Healthcare from "./page/articles/Healthcare";
import MentalHealth from "./page/articles/MentalHealth";
import DomesticAbuse from "./page/articles/DomesticAbuse";
import CreatePost from "./page/CreatePost";
import SexualHealth from "./page/articles/SexualHealth";
import SupportSystem from "./page/articles/SupportSystem";
import SelfCare from "./page/articles/SelfCare";
import Communities from "./page/Communities";
import Siri from "./page/siri";
import DiaryEditor from "./page/Diary";
import UserLayout from "./components/user/Layout";
import ResetPassword from "./page/resetPassword";
import ResetPasswordRequest from "./page/resetPasswordRequest";
import CommunityLayout from "./components/user/community/layout";
import Result from "./page/Result";

import AdminLayout from "./components/admin/Layout";
import AdminIndex from "./page/admin/index";
import AdminEmail from "./page/admin/email";
import AdminContact from "./page/admin/contacts";
import AdminProfile from "./page/admin/profile";
import AdminCommunity from "./page/admin/community";
import AdminUsers from "./page/admin/users";
import AdminPredictions from "./page/admin/Predictions";
import ReportsPage from "./page/admin/Reports";
import { ToastContainer } from "react-toastify";
import "./index.css";
import SingleCommunity from "./page/SingleCommunity";
import { notifyFirebase } from "../utils/helpers";

const App = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      notifyFirebase(payload.notification.title, payload.notification.body);
    });
  });

  return (
    <Router>
      <Routes>
        {/* Routes for user */}
        <Route
          path="/mood"
          element={<ProtectedRoute element={<MoodIndex />} />}
        />
        <Route path="/community" element={<UserLayout />}>
          <Route index element={<ComPage />} />
          <Route path="communities" element={<Communities />} />
          <Route path=":id" element={<SingleCommunity />} />
        </Route>

        <Route index element={<Home />} />
        <Route path="/" element={<UserLayout />}>
          <Route path="/article/healthcare" element={<Healthcare />} />
          <Route path="/article/mental-health" element={<MentalHealth />} />
          <Route path="/article/domestic-abuse" element={<DomesticAbuse />} />
          <Route path="/article/support-system" element={<SupportSystem />} />
          <Route path="/article/self-care" element={<SelfCare />} />
          <Route path="/article/sexual-health" element={<SexualHealth />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/author" element={<Authors />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/result" element={<Result />} />
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
          <Route path="/create-post/:id" element={<CreatePost />} />
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
          <Route path="communities" element={<AdminCommunity />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="predictions" element={<AdminPredictions />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
};

export default App;

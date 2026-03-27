import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SetupLayout from "./components/setup/SetupLayout";
import ProtectedSetup from "./components/setup/ProtectedSetup";
import HomePage from "./pages/HomePage";
import BlogsPage from "./pages/BlogsPage";
import BlogPostPage from "./pages/BlogPostPage";
import CareersPage from "./pages/CareersPage";
import { SETUP_SIGNUP_ENABLED } from "./config/setupFlags";
import LoginPage from "./pages/setup/LoginPage";
import SignupPage from "./pages/setup/SignupPage";
import SignupPausedPage from "./pages/setup/SignupPausedPage";
import SetupHomePage from "./pages/setup/SetupHomePage";
import SetupProfilePage from "./pages/setup/SetupProfilePage";
import SetupBlogPage from "./pages/setup/SetupBlogPage";
import SetupJobsPage from "./pages/setup/SetupJobsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupLayout />}>
        <Route
          index
          element={
            <ProtectedSetup>
              <SetupHomePage />
            </ProtectedSetup>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="signup"
          element={SETUP_SIGNUP_ENABLED ? <SignupPage /> : <SignupPausedPage />}
        />
        <Route
          path="dashboard"
          element={
            <ProtectedSetup>
              <SetupProfilePage />
            </ProtectedSetup>
          }
        />
        <Route
          path="blog"
          element={
            <ProtectedSetup>
              <SetupBlogPage />
            </ProtectedSetup>
          }
        />
        <Route
          path="jobs"
          element={
            <ProtectedSetup>
              <SetupJobsPage />
            </ProtectedSetup>
          }
        />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="services"
          element={<Navigate to={{ pathname: "/", hash: "services" }} replace />}
        />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogPostPage />} />
        <Route path="careers" element={<CareersPage />} />
      </Route>
    </Routes>
  );
}

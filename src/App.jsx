import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentLayout from "./layout/StudentLayout";
import OrganizerLayout from "./layout/OrganizerLayout";
import useAuthStore from "./context/auth-store";
import { Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import OrganizationIntellihub from "./pages/Organization/OrganizationIntellihub/OrganizationIntellihub";
import Organization_group from "./pages/Organization/Groups/Organization_group";
import LeaderboardVeiw from "./pages/Organization/components/LeaderboardView";
import StudentDetails from "./pages/Organization/components/StudentDetails/StudentDetails";
import ExamPage from "./pages/Exam/ExamPage";
import ExamDetailsPage from "./pages/Generic/ExamDetailsPage";
import UserDetailsPage from "./pages/Generic/UserDetailsPage";
import NotFoundPage from "./pages/Generic/NotFoundPage";
import LoadingPage from "./components/Loading/LoadingPage";
import ViewExamsPage from "./pages/Exam/ViewExamsPage";
import Notification from "./pages/Notification/Notification";
import Settings from "./pages/Settings/settings";

const App = () => {
  const { isAuthenticated, isInitializing, initializeAuth, user } =
    useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) return <LoadingPage />;

  return (
    <main style={{ backgroundColor: "#f7f9fc" }}>
      <Toaster position="top-center" richColors />

      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Login Route */}
          {!isAuthenticated ? (
            <Route path="/login" element={<LoginPage />} />
          ) : (
            <Route
              path="/login"
              element={
                <Navigate
                  to={user?.role === "student" ? "/student" : "/organization"}
                  replace
                />
              }
            />
          )}

          {/* Redirect root to appropriate dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "student" ? "/student" : "/organization"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Student Routes */}
          {isAuthenticated && user?.role === "student" && (
            <Route path="/student" element={<StudentLayout />}>
              <Route path="intellihub" element={<p>Intellihub</p>} />
              <Route path="tests" element={<p>Tests</p>} />
            </Route>
          )}

          {/* Organizer Routes */}
          {isAuthenticated && user?.role === "organizer" && (
            <Route path="/organization" element={<OrganizerLayout />}>
              <Route path="" element={<OrganizationIntellihub />} />
              <Route path="group" element={<Organization_group />} />
              <Route path="leaderboard" element={<LeaderboardVeiw />} />
              <Route path="student/:id" element={<StudentDetails />} />
              <Route path="exams" element={<ViewExamsPage />} />
              <Route path="notification" element={<Notification />} />
              <Route path="settings" element={<Settings />} />

              <Route
                path="exams/details/:examId"
                element={<ExamDetailsPage />}
              />
              <Route
                path="exams/results/:userId"
                element={<UserDetailsPage />}
              />
            </Route>
          )}

          {isAuthenticated && (
            <>
              <Route path="/exam/:examId" element={<ExamPage />} />
            </>
          )}

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;

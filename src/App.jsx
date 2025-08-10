import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentLayout from "./layout/StudentLayout";
import OrganizerLayout from "./layout/OrganizerLayout";
import useAuthStore from "./context/auth-store";
import { Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import OrganizationIntellihub from "./pages/Organization/OrganizationIntellihub/OrganizationIntellihub";

const App = () => {
  const { isAuthenticated, isInitializing, initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) return <div>Loading...</div>;

  return (
    <main>
      <Toaster position="top-center" richColors />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Login Route */}
          {!isAuthenticated ? (
            <Route path="/login" element={<LoginPage />} />
          ) : (
            <Route path="/login" element={<Navigate to={user?.role === "student" ? "/student" : "/organizer"} replace />} />
          )}

          {/* Redirect root to appropriate dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to={user?.role === "student" ? "/student" : "/organizer"} replace />
                : <Navigate to="/login" replace />
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
              <Route path="question" element={<p>Tests</p>} />
              <Route path="tests" element={<p>Tests</p>} />
            </Route>
          )}

          {/* 404 Route */}
          <Route path="*" element={<p>404 - Page Not Found</p>} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;

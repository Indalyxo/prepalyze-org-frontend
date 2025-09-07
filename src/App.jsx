import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect, lazy } from "react";
import { Toaster } from "sonner";
import useAuthStore from "./context/auth-store";

// ✅ Eagerly loaded essentials
import LoadingPage from "./components/Loading/LoadingPage";
import OfflineAlert from "./components/Generics/Connection/OfflineAlert";

// ✅ Lazy-loaded pages/layouts
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const StudentLayout = lazy(() => import("./layout/StudentLayout"));
const OrganizerLayout = lazy(() => import("./layout/OrganizerLayout"));
const OrganizationIntellihub = lazy(
  () => import("./pages/Organization/OrganizationIntellihub/OrganizationIntellihub")
);
const Organization_group = lazy(
  () => import("./pages/Organization/Groups/Organization_group")
);
const LeaderboardVeiw = lazy(
  () => import("./pages/Organization/components/LeaderboardView")
);
const StudentDetails = lazy(
  () => import("./pages/Organization/components/StudentDetails/StudentDetails")
);
const ExamPage = lazy(() => import("./pages/Exam/ExamPage"));
const ExamDetailsPage = lazy(() => import("./pages/Generic/ExamDetailsPage"));
const UserDetailsPage = lazy(() => import("./pages/Generic/UserDetailsPage"));
const NotFoundPage = lazy(() => import("./pages/Generic/NotFoundPage"));
const ViewExamsPage = lazy(() => import("./pages/Exam/ViewExamsPage"));
const Notification = lazy(() => import("./pages/Notification/Notification"));
const SettingsPage = lazy(() => import("./pages/Settings/Settings"));
const ExamQuestionsPage = lazy(
  () => import("./pages/Generic/ExamQuestions/ExamQuestions")
);
const ViewStudentsExamsPage = lazy(
  () => import("./pages/Students/ExamPage/StudentExamPage")
);
const ExamResult = lazy(
  () => import("./components/Exam/Helpers/ExamResult/ExamResult")
);
const StudentsViewDetailsPage = lazy(
  () => import("./pages/Students/ViewDetailsPage/StudentsViewDetailsPage")
);
const StudentIntellihub = lazy(() => import("./pages/Students/Intellihub"));
const PrintQuestions = lazy(() => import("./pages/Generic/PrintQuestions/PrintQuestions"));
const CheckingPage = lazy(() => import("./pages/Generic/CheckingPage"));
const PrepalyzeLanding = lazy(() => import("./pages/LandingPage"));

const App = () => {
  const { isAuthenticated, isInitializing, initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) return <LoadingPage />;

  return (
    <main style={{ backgroundColor: "#f7f9fc" }}>
      <Toaster position="top-center" richColors />
      <OfflineAlert />
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

          {/* Root redirect */}
          <Route
            path="/"
            index
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "student" ? "/student" : "/organization"}
                  replace
                />
              ) : (
                <PrepalyzeLanding />
              )
            }
          />

          {/* Student Routes */}
          {isAuthenticated && user?.role === "student" && (
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentIntellihub />} />
              <Route path="exams" element={<ViewStudentsExamsPage />} />
              <Route
                path="exams/details/:examId"
                element={<StudentsViewDetailsPage />}
              />
              <Route
                path="exams/details/:examId/questions"
                element={<ExamQuestionsPage />}
              />
              <Route
                path="exams/details/:examId/result/:resultId"
                element={<ExamResult />}
              />
            </Route>
          )}

          {/* Organizer Routes */}
          {isAuthenticated && user?.role === "organizer" && (
            <Route path="/organization" element={<OrganizerLayout />}>
              <Route index element={<OrganizationIntellihub />} />
              <Route path="group" element={<Organization_group />} />
              <Route path="leaderboard" element={<LeaderboardVeiw />} />
              <Route path="student/:id" element={<StudentDetails />} />
              <Route path="exams" element={<ViewExamsPage />} />
              <Route path="notification" element={<Notification />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="exams/details/:examId" element={<ExamDetailsPage />} />
              <Route
                path="exams/details/:examId/questions"
                element={<ExamQuestionsPage />}
              />
              <Route path="exams/results/:userId" element={<UserDetailsPage />} />
            </Route>
          )}

          {/* Common Authenticated Routes */}
          {isAuthenticated && (
            <>
              <Route path="/exam/:examId" element={<ExamPage />} />
              <Route path="/print/:examId" element={<PrintQuestions />} />
              <Route path="/check" element={<CheckingPage />} />
            </>
          )}

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;

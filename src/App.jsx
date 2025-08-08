import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentLayout from "./layout/StudentLayout";
import OrganizerLayout from "./layout/OrganizerLayout";

const App = () => {
  return (
    <main>
      <Routes>
        <Route index path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route path="intellihub" element={<p>Intellihub</p>} />
          <Route path="tests" element={<p>Tests</p>} />
          {/* <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} /> */}
        </Route>

        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route path="intellihub" element={<p>Intellihub</p>} />
          <Route path="tests" element={<p>Tests</p>} />
          {/* <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="profile" element={<OrganizerProfile />} /> */}
        </Route>
      </Routes>
    </main>
  );
};

export default App;

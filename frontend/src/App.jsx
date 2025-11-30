import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeLogin from './pages/auth/EmployeeLogin';
import ManagerLogin from './pages/auth/ManagerLogin';
import EmployeeRegister from './pages/auth/EmployeeRegister';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerAttendance from './pages/manager/ManagerAttendance';
import TeamCalendar from './pages/manager/TeamCalendar';
import Reports from './pages/manager/Reports';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import ManagerProfile from './pages/manager/ManagerProfile';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Redirect root to employee login */}
          <Route path="/" element={<Navigate to="/employee/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee/register" element={<EmployeeRegister />} />
          <Route path="/manager/login" element={<ManagerLogin />} />
          
          {/* Dashboard Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/attendance" element={<AttendanceHistory />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/attendance" element={<ManagerAttendance />} />
          <Route path="/manager/calendar" element={<TeamCalendar />} />
          <Route path="/manager/reports" element={<Reports />} />
          
          {/* Profile Routes */}
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/manager/profile" element={<ManagerProfile />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

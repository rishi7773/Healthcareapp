// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import FeaturesPage from "./pages/FeaturesPage";
import Login from "./pages/auth/Login";
import OnlineAppointment from "./pages/OnlineAppointment";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/Appointments";
import PatientMedicalRecords from "./pages/patient/MedicalRecords";
import PatientPrescriptions from "./pages/patient/Prescriptions";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorPatientsList from "./pages/doctor/PatientsList";

// Private Route Component
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Features */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />

        {/* Online Appointment (accessible from Features) */}
        <Route path="/online-appointment" element={<OnlineAppointment />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <PrivateRoute role="patient">
              <PatientAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/medical-records"
          element={
            <PrivateRoute role="patient">
              <PatientMedicalRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <PrivateRoute role="patient">
              <PatientPrescriptions />
            </PrivateRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <PrivateRoute role="doctor">
              <DoctorAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <PrivateRoute role="doctor">
              <DoctorPrescriptions />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <PrivateRoute role="doctor">
              <DoctorPatientsList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

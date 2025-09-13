// src/pages/FeaturesPage.jsx
import { useNavigate } from "react-router-dom";

export default function FeaturesPage() {
  const navigate = useNavigate();

  const features = [
    { name: "Online Appointments", path: "/online-appointment" },
    { name: "Electronic Health Records", path: "/patient/medical-records" },
    { name: "Prescription Management", path: "/patient/prescriptions" },
    { name: "Patient Dashboard", path: "/patient/dashboard" },
    { name: "Doctor Dashboard", path: "/doctor/dashboard" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select a Feature</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((f) => (
          <button
            key={f.name}
            onClick={() => navigate(f.path)}
            className="p-6 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}

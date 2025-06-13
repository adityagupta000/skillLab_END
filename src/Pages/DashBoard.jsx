// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/DashBoard.css";

export default function Dashboard() {
  const { user: authUser } = useAuthContext();
  const [user, setUser] = useState(authUser);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock user if no auth user found (run once)
  useEffect(() => {
    if (!authUser) {
      setUser({
        name: "Test User",
        role: "admin", // change to 'doctor' or 'pharmacy' to test other roles
      });
    }
  }, [authUser]);

  useEffect(() => {
    const dummyAlerts = [
      {
        _id: "1",
        title: "Test Alert",
        message: "This is a test alert message.",
        priority: "Low",
      },
      {
        _id: "2",
        title: "System Update",
        message: "Routine maintenance scheduled at midnight.",
        priority: "Medium",
      },
      {
        _id: "3",
        title: "Critical Drug Low",
        message: "Insulin stock is running low.",
        priority: "High",
      },
    ];

    setTimeout(() => {
      setAlerts(dummyAlerts);
      setLoading(false);
    }, 500);
  }, []);

  if (!user) {
    // Optional: you can return a loading state while user is not ready
    return <p>Loading user info...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="mb-4 text-gray-600">Role: {user.role}</p>

      {/* Role-based quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user.role === "admin" && (
          <>
            <QuickLink title="Manage Users" to="/users" />
            <QuickLink title="Manage Drugs" to="/drugs" />
            <QuickLink title="Manage Alerts" to="/alerts" />
          </>
        )}
        {user.role === "doctor" && (
          <>
            <QuickLink title="View OT Slots" to="/ot-management" />
            <QuickLink title="View Patient Tokens" to="/tokens" />
          </>
        )}
        {user.role === "pharmacy" && (
          <>
            <QuickLink title="Drug Stock Status" to="/drug-inventory" />
          </>
        )}
      </div>

      {/* Recent alerts */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Alerts</h2>
        {loading ? (
          <p>Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className="border rounded p-3 mb-2 bg-yellow-50 shadow-sm"
            >
              <p className="font-semibold">{alert.title}</p>
              <p>{alert.message}</p>
              <p className="text-sm text-gray-500">
                Priority: {alert.priority}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuickLink({ title, to }) {
  return (
    <Link
      to={to}
      className="block p-6 bg-blue-100 rounded shadow hover:bg-blue-200 transition text-center font-semibold"
    >
      {title}
    </Link>
  );
}

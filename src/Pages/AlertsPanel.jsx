import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import socket from "../utils/socket";
import "../styles/AlertsPanel.css"; // Assuming you have some styles for the panel
const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState({ type: "", priority: "" });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = () => {
    const params = {};
    if (filter.type) params.type = filter.type;
    if (filter.priority) params.priority = filter.priority;

    axiosInstance
      .get("/alerts", { params })
      .then((res) => {
        setAlerts(res.data);
        setUnreadCount(res.data.filter((a) => !a.read).length);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();

    socket.connect();
    socket.on("alert-update", fetchAlerts);

    return () => {
      socket.off("alert-update");
      socket.disconnect();
    };
  }, [filter]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/alerts/${id}/read`);
      fetchAlerts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark alert as read");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Alerts Panel</h1>

      <div className="mb-4 flex space-x-4">
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="system">System</option>
          <option value="emergency">Emergency</option>
          <option value="stock">Stock</option>
          {/* Add more types as per backend */}
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="ml-auto font-semibold">
          Unread Alerts:{" "}
          <span className="text-red-600">{unreadCount}</span>
        </div>
      </div>

      <ul className="space-y-4">
        {alerts.length === 0 && (
          <li className="text-center text-gray-500">No alerts found.</li>
        )}

        {alerts.map((alert) => (
          <li
            key={alert._id}
            className={`border p-4 rounded shadow-sm ${
              alert.read ? "bg-gray-100" : "bg-yellow-100"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold capitalize">{alert.type}</div>
              <div className={`px-2 py-0.5 rounded text-sm ${
                alert.priority === "high"
                  ? "bg-red-600 text-white"
                  : alert.priority === "medium"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-400 text-black"
              }`}>
                {alert.priority}
              </div>
            </div>

            <p className="mb-2">{alert.message}</p>
            <small className="text-gray-600">
              {new Date(alert.createdAt).toLocaleString()}
            </small>

            {!alert.read && (
              <button
                onClick={() => markAsRead(alert._id)}
                className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsPanel;

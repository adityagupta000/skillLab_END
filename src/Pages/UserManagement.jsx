import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: "", isActive: "" });

  const fetchUsers = () => {
    const params = {};
    if (filter.role) params.role = filter.role;
    if (filter.isActive) params.isActive = filter.isActive === "true";

    axiosInstance
      .get("/users", { params })
      .then((res) => setUsers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await axiosInstance.patch(`/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Management (Admin)</h1>

      <div className="mb-6 flex space-x-4">
        <select
          value={filter.role}
          onChange={(e) => setFilter({ ...filter, role: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Roles</option>
          <option value="doctor">Doctor</option>
          <option value="counselor">Counselor</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={filter.isActive}
          onChange={(e) => setFilter({ ...filter, isActive: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Name</th>
            <th className="border border-gray-300 p-3 text-left">Email</th>
            <th className="border border-gray-300 p-3 text-left">Role</th>
            <th className="border border-gray-300 p-3 text-left">Active</th>
            <th className="border border-gray-300 p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3 capitalize">{user.role}</td>
              <td className="border border-gray-300 p-3 text-center">
                {user.isActive ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-3">
                <button
                  onClick={() => toggleStatus(user._id, user.isActive)}
                  className={`px-3 py-1 rounded ${
                    user.isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

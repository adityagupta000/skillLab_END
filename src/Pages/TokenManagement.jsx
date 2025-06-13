import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import socket from "../utils/socket";
 import DoctorSelector from "../component/DoctorSelector";

const TokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    patientName: "",
    department: "",
    priority: "normal",
    doctorId: "",
    caseType: "",
  });

  // Fetch tokens
  const fetchTokens = () => {
    axiosInstance
      .get(`/tokens?department=${department}&status=${status}`)
      .then((res) => setTokens(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTokens();
  }, [department, status]);

  useEffect(() => {
    socket.connect();
    socket.on("token-update", () => {
      fetchTokens();
    });
    return () => {
      socket.off("token-update");
      socket.disconnect();
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/tokens", form);
      setForm({
        patientName: "",
        department: "",
        priority: "normal",
        doctorId: "",
        caseType: "",
      });
      fetchTokens();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create token");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/tokens/${id}/status`, { status: newStatus });
      fetchTokens();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update token status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Token Management</h1>

      <form
        onSubmit={handleCreate}
        className="border p-4 rounded mb-8 max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-3">Add New Token</h2>

        <label className="block mb-1 font-semibold">Patient Name</label>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Department</label>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Priority</label>
        <select
          className="border p-2 mb-3 w-full rounded"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        <label className="block mb-1 font-semibold">Assign Doctor</label>
        <DoctorSelector
          value={form.doctorId}
          onChange={(doctorId) => setForm({ ...form, doctorId })}
        />

        <label className="block mb-1 font-semibold">Case Type</label>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          value={form.caseType}
          onChange={(e) => setForm({ ...form, caseType: e.target.value })}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition w-full"
        >
          Add Token
        </button>
      </form>

      <div className="mb-6">
        <label className="mr-4 font-semibold">Filter by Department:</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-1 rounded mr-4"
          placeholder="Department"
        />

        <label className="mr-4 font-semibold">Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All</option>
          <option value="waiting">Waiting</option>
          <option value="in-treatment">In Treatment</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Patient</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Priority</th>
            <th className="border border-gray-300 p-2">Doctor</th>
            <th className="border border-gray-300 p-2">Case Type</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token._id} className="text-center">
              <td className="border border-gray-300 p-2">{token.patientName}</td>
              <td className="border border-gray-300 p-2">{token.department}</td>
              <td
                className={`border border-gray-300 p-2 font-semibold ${
                  token.priority === "emergency"
                    ? "text-red-600"
                    : token.priority === "urgent"
                    ? "text-yellow-600"
                    : "text-gray-700"
                }`}
              >
                {token.priority}
              </td>
              <td className="border border-gray-300 p-2">
                {token.doctor?.name || "N/A"}
              </td>
              <td className="border border-gray-300 p-2">{token.caseType}</td>
              <td className="border border-gray-300 p-2">{token.status}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                {token.status !== "completed" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        token._id,
                        token.status === "waiting"
                          ? "in-treatment"
                          : "completed"
                      )
                    }
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    {token.status === "waiting" ? "Start Treatment" : "Complete"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenManagement;

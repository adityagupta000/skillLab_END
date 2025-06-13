import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import socket from "../utils/socket";
import "../styles/OTSlotManagement.css"; // Assuming you have some styles for the OT slot management
const OTSlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    doctorId: "",
    status: "available",
  });

  const fetchSlots = () => {
    axiosInstance
      .get("/ot")
      .then((res) => setSlots(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSlots();
    socket.connect();
    socket.on("ot-slot-update", fetchSlots);
    return () => {
      socket.off("ot-slot-update");
      socket.disconnect();
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/ot", form);
      setForm({
        date: "",
        startTime: "",
        endTime: "",
        doctorId: "",
        status: "available",
      });
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create OT slot");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/ot/${id}/status`, { status: newStatus });
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update OT slot status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">OT Slot Management</h1>

      <form
        onSubmit={handleCreate}
        className="border p-4 rounded mb-8 max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-3">Add OT Slot</h2>

        <label className="block mb-1 font-semibold">Date</label>
        <input
          type="date"
          className="border p-2 mb-3 w-full rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Start Time</label>
        <input
          type="time"
          className="border p-2 mb-3 w-full rounded"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">End Time</label>
        <input
          type="time"
          className="border p-2 mb-3 w-full rounded"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Doctor ID</label>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Status</label>
        <select
          className="border p-2 mb-3 w-full rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition w-full"
        >
          Add OT Slot
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Start Time</th>
            <th className="border border-gray-300 p-2">End Time</th>
            <th className="border border-gray-300 p-2">Doctor ID</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No OT slots found.
              </td>
            </tr>
          )}
          {slots.map((slot) => (
            <tr key={slot._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{slot.date}</td>
              <td className="border border-gray-300 p-2">{slot.startTime}</td>
              <td className="border border-gray-300 p-2">{slot.endTime}</td>
              <td className="border border-gray-300 p-2">{slot.doctorId}</td>
              <td className="border border-gray-300 p-2 capitalize">{slot.status}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                {slot.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(slot._id, "cancelled")}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
                {slot.status !== "available" && (
                  <button
                    onClick={() => updateStatus(slot._id, "available")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Make Available
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

export default OTSlotManagement;

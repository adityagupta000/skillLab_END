import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import socket from "../utils/socket";

const DrugInventoryManagement = () => {
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    expirationDate: "",
  });

  const fetchDrugs = () => {
    axiosInstance
      .get("/drugs")
      .then((res) => setDrugs(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchDrugs();
    socket.connect();
    socket.on("drug-update", fetchDrugs);
    return () => {
      socket.off("drug-update");
      socket.disconnect();
    };
  }, []);

  const handleAddDrug = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/drugs", form);
      setForm({ name: "", quantity: 0, expirationDate: "" });
      fetchDrugs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add drug");
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      await axiosInstance.patch(`/drugs/${id}/quantity`, { quantity: newQuantity });
      fetchDrugs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Drug Inventory Management</h1>

      <form onSubmit={handleAddDrug} className="border p-4 rounded mb-8 max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Add New Drug</h2>

        <label className="block mb-1 font-semibold">Drug Name</label>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label className="block mb-1 font-semibold">Quantity</label>
        <input
          type="number"
          className="border p-2 mb-3 w-full rounded"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          required
          min={0}
        />

        <label className="block mb-1 font-semibold">Expiration Date</label>
        <input
          type="date"
          className="border p-2 mb-3 w-full rounded"
          value={form.expirationDate}
          onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition w-full"
        >
          Add Drug
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Expiration Date</th>
            <th className="border border-gray-300 p-2">Update Quantity</th>
          </tr>
        </thead>
        <tbody>
          {drugs.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No drugs in inventory.
              </td>
            </tr>
          )}
          {drugs.map((drug) => (
            <DrugRow key={drug._id} drug={drug} onUpdate={handleUpdateQuantity} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DrugRow = ({ drug, onUpdate }) => {
  const [newQty, setNewQty] = useState(drug.quantity);

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 p-2">{drug.name}</td>
      <td className="border border-gray-300 p-2">{drug.quantity}</td>
      <td className="border border-gray-300 p-2">{new Date(drug.expirationDate).toLocaleDateString()}</td>
      <td className="border border-gray-300 p-2 flex space-x-2 items-center">
        <input
          type="number"
          min={0}
          value={newQty}
          onChange={(e) => setNewQty(Number(e.target.value))}
          className="border p-1 rounded w-20"
        />
        <button
          onClick={() => onUpdate(drug._id, newQty)}
          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default DrugInventoryManagement;

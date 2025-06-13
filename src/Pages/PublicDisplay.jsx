import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import socket from "../utils/socket";

const PublicDisplay = () => {
  const [tokens, setTokens] = useState([]);
  const [ongoingOTs, setOngoingOTs] = useState([]);
  const [emergencyOT, setEmergencyOT] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const fetchTokens = async () => {
    try {
      const res = await axiosInstance.get("/tokens", {
        params: { department: "cardiology" },
      });
      setTokens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOngoingOTs = async () => {
    try {
      const res = await axiosInstance.get("/ot", {
        params: { status: "ongoing" },
      });
      setOngoingOTs(res.data);
      setEmergencyOT(res.data.some((ot) => ot.priority === "emergency"));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLowStockAlerts = async () => {
    try {
      const res = await axiosInstance.get("/drugs", {
        params: { lowStock: true },
      });
      setLowStockAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTokens();
    fetchOngoingOTs();
    fetchLowStockAlerts();

    socket.connect();

    socket.on("token-update", fetchTokens);
    socket.on("ot-urgent", () => setEmergencyOT(true));
    socket.on("low-stock", fetchLowStockAlerts);

    return () => {
      socket.off("token-update");
      socket.off("ot-urgent");
      socket.off("low-stock");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-6">Public Display Board</h1>

      {emergencyOT && (
        <div className="bg-red-700 text-white text-center py-4 rounded font-bold text-xl animate-pulse">
          Code Red: Emergency OT in Progress!
        </div>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">Current Tokens (Cardiology)</h2>
        {tokens.length === 0 ? (
          <p>No tokens available currently.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <li
                key={token._id}
                className={`border rounded p-4 shadow ${
                  token.priority === "emergency"
                    ? "bg-red-100 border-red-600"
                    : token.priority === "urgent"
                    ? "bg-yellow-100 border-yellow-500"
                    : "bg-white"
                }`}
              >
                <div className="font-bold text-lg">Token #{token.tokenNumber}</div>
                <div>Patient: {token.patientName}</div>
                <div>Status: {token.status}</div>
                <div>Priority: {token.priority}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Ongoing OT Slots</h2>
        {ongoingOTs.length === 0 ? (
          <p>No ongoing OT slots currently.</p>
        ) : (
          <ul className="space-y-3">
            {ongoingOTs.map((ot) => (
              <li key={ot._id} className="border p-4 rounded shadow">
                <div>Patient: {ot.patientName}</div>
                <div>Doctor: {ot.doctorName}</div>
                <div>Case Type: {ot.caseType}</div>
                <div>Status: {ot.status}</div>
                <div>Priority: {ot.priority}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Low Stock Drug Alerts</h2>
        {lowStockAlerts.length === 0 ? (
          <p>No low stock drugs.</p>
        ) : (
          <ul className="space-y-2 text-red-700 font-semibold">
            {lowStockAlerts.map((drug) => (
              <li key={drug._id}>
                {drug.name} - Only {drug.stock} left in stock!
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PublicDisplay;

import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const DoctorSelector = ({ value, onChange, disabled }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/users/doctors");
        setDoctors(res.data.filter((doc) => doc.isActive));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      className="border rounded p-2 w-full"
    >
      <option value="">Select Doctor</option>
      {doctors.map((doctor) => (
        <option key={doctor._id} value={doctor._id}>
          {doctor.name}
        </option>
      ))}
    </select>
  );
};

export default DoctorSelector;

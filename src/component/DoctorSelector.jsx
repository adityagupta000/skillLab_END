// src/components/DoctorSelector.jsx
import React from 'react';

const DoctorSelector = ({ doctors, selectedDoctor, onChange }) => (
  <select value={selectedDoctor} onChange={onChange}>
    {doctors.map((doc) => (
      <option key={doc.id} value={doc.id}>{doc.name}</option>
    ))}
  </select>
);

export default DoctorSelector;

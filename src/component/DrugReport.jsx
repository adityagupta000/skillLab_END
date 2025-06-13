import React from 'react';

const DrugReport = ({ drugs = [] }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto my-4">
      <h2 className="text-xl font-semibold mb-4">Drug Inventory Report</h2>
      {drugs.length === 0 ? (
        <p>No drug data available.</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {drugs.map((drug, idx) => (
              <tr key={idx}>
                <td className="border p-2">{drug.name}</td>
                <td className="border p-2">{drug.quantity}</td>
                <td className="border p-2">{drug.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DrugReport;

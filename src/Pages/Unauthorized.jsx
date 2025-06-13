import React from "react";
import { Link } from "react-router-dom";
import "../styles/Unauthorized.css"; // Assuming you have some styles for the Unauthorized page
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-5xl font-bold mb-4 text-red-600">403</h1>
      <h2 className="text-2xl mb-6">Unauthorized Access</h2>
      <p className="mb-6">You do not have permission to view this page.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;

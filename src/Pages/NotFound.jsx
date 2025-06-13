import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css"; // Assuming you have some styles for the Not Found page
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-5xl font-bold mb-4 text-gray-700">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

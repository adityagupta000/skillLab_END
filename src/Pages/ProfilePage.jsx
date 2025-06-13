import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/ProfilePage.css"; // Assuming you have some styles for the profile page
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-red-600">Unable to load profile.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Name: </span> {profile.name}
        </div>
        <div>
          <span className="font-semibold">Email: </span> {profile.email}
        </div>
        <div>
          <span className="font-semibold">Role: </span> {profile.role}
        </div>
        <div>
          <span className="font-semibold">Department: </span> {profile.department || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Last Login: </span> {new Date(profile.lastLogin).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

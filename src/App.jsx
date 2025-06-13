import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/DashBoard";
import TokenManagement from "./Pages/TokenManagement";
import OTManagement from "./Pages/OTSlotManagement";
import DrugInventory from "./Pages/DrugInventoryManagement";
import AlertsPanel from "./Pages/AlertsPanel";
import UserManagement from "./Pages/UserManagement";
import ProfilePage from "./Pages/ProfilePage";
import PublicDisplay from "./Pages/PublicDisplay";
import Unauthorized from "./Pages/Unauthorized";
import NotFound from "./Pages/NotFound";
import TokenStats from "./component/TokenStats";
import DrugReport from "./component/DrugReport";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tokens" element={<TokenManagement />} />
            <Route path="/ot" element={<OTManagement />} />
            <Route path="/drugs" element={<DrugInventory />} />
            <Route path="/alerts" element={<AlertsPanel />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/public-display" element={<PublicDisplay />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/manage-users" element={<UserManagement />} />
          </Route>

          {/* Optional Chart Pages */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "doctor"]} />}>
            <Route path="/token-stats" element={<TokenStats />} />
            <Route path="/drug-report" element={<DrugReport />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

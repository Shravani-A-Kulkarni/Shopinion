import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AdminUsers from "./AdminUsers";
import OwnerStores from "./OwnerStores";
import UserDashboard from "./UserDashboard";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    // Fetch user profile from backend
    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        setError({ error: "Session expired. Login again" });
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p> Loading... </p>;
  return (
    <Layout user={user} onLogout={handleLogout}>
      <h2>Welcome, {user.name}!</h2>

      {user.role === "admin" && <AdminUsers />}
      {user.role === "owner" && <OwnerStores />}
      {user.role === "user" && (
        <UserDashboard
          token={localStorage.getItem("token")}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
}

export default Dashboard;

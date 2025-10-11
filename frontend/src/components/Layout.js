// src/components/Layout.js
import { useState } from "react";
import axios from "axios";

function Layout({ user, onLogout, children }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    // Make axios call
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "${process.env.REACT_APP_API_URL}/api/auth/update-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        "${process.env.REACT_APP_API_URL}/api/auth/delete-account",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Account deleted successfully");
      localStorage.clear();
      onLogout();
    } catch (err) {
      alert(err.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="col-3 bg-light p-3">
        <h4>Dashboard</h4>
        <p>
          <strong>{user?.name}</strong>
        </p>
        <p>Your Role: {user?.role}</p>

        {/* Logout */}
        <button className="btn btn-danger w-100 mb-2" onClick={onLogout}>
          Logout
        </button>

        {/* Update Password */}
        {!showPasswordForm ? (
          <button
            className="btn btn-warning w-100"
            onClick={() => setShowPasswordForm(true)}
          >
            Update Password
          </button>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="mt-3">
            <div className="mb-2">
              <input
                type="password"
                placeholder="Old password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="New password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm">Update</button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Delete Account */}
        <button
          onClick={handleDeleteAccount}
          className="btn btn-danger mt-2 w-100"
        >
          {" "}
          Delete Account{" "}
        </button>
      </div>

      {/* Main content */}
      <div className="col-9 p-4">{children}</div>
    </div>
  );
}

export default Layout;

import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (password.length < 8 || password.length > 16) {
      return "Password should be in length 8-16 characters";
    }
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain at least one uppercase letter and one special character";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          newPassword: password,
        }
      );
      alert("Password reset successfully.", res.data.message);
    } catch (err) {
      alert("Error resetting password:", err.response.data.message);
    }
  };

  return (
    <div className="row justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <h2 className="mb-3 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email,
    });
    alert(
      "If that email is registered on this platform, then you will get the reset password link"
    );
  };

  return (
    <div className="row justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <h2 className="mb-3 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Registered email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <button type="submit">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
}

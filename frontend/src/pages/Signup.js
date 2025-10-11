import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // default
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, address, password } = formData;

    //Name
    if (name.length < 6 || name.length > 60) {
      return "Name must be between 6 and 60 characters";
    }

    //Address
    if (address.length > 400) {
      return "Addresss should be less than 400 characters";
    }

    //Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }

    //Password
    if (password.length < 8 || password.length > 16) {
      return "Password must be between 8 and 16 characters";
    }
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must conatin at least one uppercase letter and one special character";
    }

    return null;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );
      setSuccess(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 1500); // redirect after success
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="row justify-content-center">
      <p className="mt-1 text-left">
        <Link to="/">🏠</Link>
      </p>
      <div
        className="card shadow p-4 mt-5"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <h2 className="mb-3">Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              8–16 chars, must include 1 uppercase & 1 special character
            </small>
          </div>

          <div className="mb-3">
            <label>Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Signup
          </button>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;

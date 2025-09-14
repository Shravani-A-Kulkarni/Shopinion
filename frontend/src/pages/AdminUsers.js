import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle inputs
  const handleUserChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleStoreChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  // Filter users
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value.toLowerCase() };
    setFilters(newFilters);

    const filtered = users.filter((u) => {
      return (
        u.name.toLowerCase().includes(newFilters.name) &&
        u.email.toLowerCase().includes(newFilters.email) &&
        u.address.toLowerCase().includes(newFilters.address) &&
        (newFilters.role === "" || u.role.toLowerCase() === newFilters.role)
      );
    });

    setFilteredUsers(filtered);
  };

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key] ?? "";
    let bVal = b[sortConfig.key] ?? "";

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Create new user
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/admin/create-user",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      setShowUserForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  };

  // Create new store
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/stores",
        storeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`Store created: ${res.data.name}`);
      setStoreData({ name: "", email: "", address: "", ownerId: "" });
      setShowStoreForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create store");
    }
  };

  return (
    <div>
      <h3>Manage Users</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div className="card p-3 mb-3">
        <h5>Filters</h5>
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              placeholder="Filter by Name"
              className="form-control"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="email"
              placeholder="Filter by Email"
              className="form-control"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="address"
              placeholder="Filter by Address"
              className="form-control"
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <select
              name="role"
              className="form-select"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <h5>Existing Users</h5>
      {sortedUsers.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                ID{" "}
                {sortConfig.key === "id"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("email")}
                style={{ cursor: "pointer" }}
              >
                Email{" "}
                {sortConfig.key === "email"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("role")}
                style={{ cursor: "pointer" }}
              >
                Role{" "}
                {sortConfig.key === "role"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("address")}
                style={{ cursor: "pointer" }}
              >
                Address{" "}
                {sortConfig.key === "address"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                Created At{" "}
                {sortConfig.key === "createdAt"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.address}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}

      {/* Create User Form */}
      <button
        className="btn btn-primary mt-3 me-2"
        onClick={() => setShowUserForm(!showUserForm)}
      >
        {showUserForm ? "Cancel" : "+ Create User"}
      </button>

      {showUserForm && (
        <div className="card p-3 mt-3">
          <h5>Create New User</h5>
          <form onSubmit={handleUserSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control mb-2"
              value={formData.name}
              onChange={handleUserChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              value={formData.email}
              onChange={handleUserChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-2"
              value={formData.password}
              onChange={handleUserChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="form-control mb-2"
              value={formData.address}
              onChange={handleUserChange}
            />
            <select
              name="role"
              className="form-select mb-2"
              value={formData.role}
              onChange={handleUserChange}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-success">
              Create User
            </button>
          </form>
        </div>
      )}

      {/* Create Store Form Toggle */}
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowStoreForm(!showStoreForm)}
      >
        {showStoreForm ? "Cancel" : "+ Create Store"}
      </button>

      {showStoreForm && (
        <div className="card p-3 mt-3">
          <h5>Create New Store</h5>
          <form onSubmit={handleStoreSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              className="form-control mb-2"
              value={storeData.name}
              onChange={handleStoreChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              className="form-control mb-2"
              value={storeData.email}
              onChange={handleStoreChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Store Address"
              className="form-control mb-2"
              value={storeData.address}
              onChange={handleStoreChange}
            />
            <input
              type="number"
              name="ownerId"
              placeholder="Owner ID"
              className="form-control mb-2"
              value={storeData.ownerId}
              onChange={handleStoreChange}
              required
            />
            <button type="submit" className="btn btn-success">
              Create Store
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

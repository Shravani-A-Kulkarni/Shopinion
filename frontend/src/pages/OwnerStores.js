import { useEffect, useState } from "react";
import axios from "axios";

function OwnerStores() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(null); // storeId where form is open
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/owner/stores/ratings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handlePasswordChange = async (e, storeId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/owner/update-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setPasswords({ oldPassword: "", newPassword: "" });
      setShowPasswordForm(null); // close form
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div>
      <h3>My Stores</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      {stores.length > 0 ? (
        stores.map((store) => (
          <div key={store.storeId} className="card mb-3 p-3">
            <h5>{store.storeName}</h5>
            <p>
              <b>Average Rating:</b>{" "}
              {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
            </p>
            <p>
              <b>Total Ratings:</b> {store.ratingsCount}
            </p>

            {store.ratings && store.ratings.length > 0 ? (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td>{r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No ratings yet</p>
            )}
          </div>
        ))
      ) : (
        <p>No stores found</p>
      )}
    </div>
  );
}

export default OwnerStores;

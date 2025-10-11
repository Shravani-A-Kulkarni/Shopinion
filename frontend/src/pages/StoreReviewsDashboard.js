import { useEffect, useState } from "react";
import axios from "axios";

function StoreReviewsDashboard() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  const fetchAllStoreReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/stores/reviews",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load store reviews");
    }
  };

  useEffect(() => {
    fetchAllStoreReviews();
  }, []);

  return (
    <div>
      <h3>All Store Reviews</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      {stores.length > 0 ? (
        stores.map((store) => (
          <div key={store.storeId} className="card mb-3 p-3">
            <h5>{store.storeName}</h5>
            <p>
              <b>Owner:</b> {store.ownerName || "N/A"} <br />
              <b>Average Rating:</b>{" "}
              {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}{" "}
              <br />
              <b>Total Ratings:</b> {store.ratingsCount}
            </p>

            {store.ratings && store.ratings.length > 0 ? (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        ))
      ) : (
        <p>No store reviews found</p>
      )}
    </div>
  );
}

export default StoreReviewsDashboard;

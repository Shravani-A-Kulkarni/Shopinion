// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard({ token, onLogout, user }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [textReviews, setTextReviews] = useState({});
  const [showReviewBox, setShowReviewBox] = useState({});

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const listRes = await axios.get("http://localhost:5000/api/stores", {
          headers: authHeader(),
        });
        const storesList = listRes.data || [];

        const detailed = await Promise.all(
          storesList.map(async (s) => {
            try {
              const detailRes = await axios.get(
                `http://localhost:5000/api/stores/${s.id}/details`,
                { headers: authHeader() }
              );
              return detailRes.data;
            } catch {
              return {
                storeId: s.id,
                storeName: s.name,
                address: s.address,
                averageRating: null,
                userRating: null,
              };
            }
          })
        );

        const initialRatings = {};
        detailed.forEach((d) => {
          if (d.userRating !== null && d.userRating !== undefined) {
            initialRatings[d.storeId] = d.userRating;
          }
        });

        setStores(detailed);
        setRatings(initialRatings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores. Please try again.");
        setLoading(false);
      }
    };

    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    fetchAll();
  }, [token]);

  const handleRatingSubmit = async (storeId) => {
    const ratingValue = Number(ratings[storeId]);
    const reviewText = textReviews?.[storeId] || "";

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please enter ratings between 1 to 5");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/ratings/${storeId}`,
        { rating: ratingValue, reviewText },
        { headers: authHeader() }
      );
      const detailRes = await axios.get(
        `http://localhost:5000/api/stores/${storeId}/details`,
        { headers: authHeader() }
      );
      const updated = detailRes.data;
      setStores((prev) =>
        prev.map((s) => (s.storeId === updated.storeId ? updated : s))
      );

      alert("Rating and review submitted/updated!");
      setTextReviews({ ...textReviews, [storeId]: "" });
      setShowReviewBox({ ...showReviewBox, [storeId]: false });
    } catch (err) {
      console.error("Error submitting review: ", err);
      alert(err.response?.data?.error || "Error submitting rating/review");
    }
  };

  const filtered = stores.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.storeName || "").toLowerCase().includes(q) ||
      (s.address || "").toLowerCase().includes(q)
    );
  });

  if (loading) return <p>Loading stores...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Main Content */}
        <div className="col-9 p-3">
          <h3>User Dashboard</h3>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Search stores by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5">No stores found</td>
                </tr>
              )}

              {filtered.map((store) => (
                <tr key={store.storeId}>
                  <td>{store.storeName}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.averageRating !== null
                      ? Number(store.averageRating).toFixed(1)
                      : "N/A"}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="5"
                      value={ratings[store.storeId] ?? ""}
                      onChange={(e) =>
                        setRatings({
                          ...ratings,
                          [store.storeId]: e.target.value,
                        })
                      }
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRatingSubmit(store.storeId)}
                    >
                      Submit
                    </button>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() =>
                        setShowReviewBox((prev) => ({
                          ...prev,
                          [store.storeId]: !prev[store.storeId],
                        }))
                      }
                    >
                      {showReviewBox[store.storeId]
                        ? "Cancel"
                        : "Write a Review"}
                    </button>

                    {showReviewBox[store.storeId] && (
                      <div className="mt-2">
                        <textarea
                          className="form-control mb-2"
                          rows="2"
                          placeholder="Write your review..."
                          value={textReviews[store.storeId] || ""}
                          onChange={(e) =>
                            setTextReviews({
                              ...textReviews,
                              [store.storeId]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleRatingSubmit(store.storeId)}
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

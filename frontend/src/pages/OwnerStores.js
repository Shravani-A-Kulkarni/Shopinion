import { useEffect, useState } from "react";
import axios from "axios";
import SentimentChart from "../components/SentimentChart";

function OwnerStores() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);

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
  const fetchStoreDetails = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/ratings/${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStoreDetails(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load store details");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h3>My Stores</h3>
      {error && <div className="alert alert-danger">{error}</div>}

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

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setSelectedStore(store.storeId);
                fetchStoreDetails(store.storeId);
              }}
            >
              View Details
            </button>
            {selectedStore === store.storeId && storeDetails && (
              <div className="mt-3">
                <h6>Sentiment Analysis</h6>
                <SentimentChart
                  sentimentCounts={storeDetails.sentimentCounts}
                />
                <b>Average Sentiment Score:</b>{" "}
                {storeDetails.avgSentimentScore
                  ? storeDetails.avgSentimentScore.toFixed(2)
                  : "N/A"}
              </div>
            )}

            {store.ratings && store.ratings.length > 0 ? (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Sentiment</th>
                  </tr>
                </thead>

                <tbody>
                  {store.ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td>{r.rating}</td>
                      <td>{r.reviewText || "-"}</td>
                      <td>{r.sentimentLabel || "-"}</td>
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

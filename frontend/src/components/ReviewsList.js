import React from "react";

function SentimentBadge({ label }) {
  const normalized = (label || "neutral").toLowerCase();
  const style = {
    positive: {
      background: "#d4edda",
      color: "#155724",
      padding: "4px 8px",
      borderRadius: 6,
    },
    neutral: {
      background: "#fff3cd",
      color: "#856404",
      padding: "4px 8px",
      borderRadius: 6,
    },
    negative: {
      background: "#f8d7da",
      color: "#721c24",
      padding: "4px 8px",
      borderRadius: 6,
    },
  };
  return <span style={style[normalized] || style.neutral}>{normalized}</span>;
}

export default function ReviewsList({ ratings }) {
  if (!ratings || ratings.length === 0) return <div>No reviews yet.</div>;

  return (
    <div>
      {ratings.map((r) => (
        <div
          key={r.id || r.userId + "-" + r.createdAt}
          style={{
            border: "1px solid #eee",
            padding: 12,
            marginBottom: 8,
            borderRadius: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{r.user ? r.user.name : "User"}</strong> &nbsp;
              <span style={{ fontSize: 14 }}>({r.rating} ★)</span>
            </div>
            <div>
              <SentimentBadge label={r.sentimentLabel} />
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            {r.reviewText ? r.reviewText : <i>No text review</i>}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            {new Date(r.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

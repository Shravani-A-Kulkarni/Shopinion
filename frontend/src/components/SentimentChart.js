import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ sentimentCounts }) {
  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentimentCounts.positive || 0,
          sentimentCounts.neutral || 0,
          sentimentCounts.negative || 0,
        ],
        backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h4 style={{ marginBottom: 8 }}>Review Sentiment</h4>
      <Pie data={data} />
      <div style={{ marginTop: 8 }}>
        <small>
          Total reviews:{" "}
          {(sentimentCounts.positive || 0) +
            (sentimentCounts.neutral || 0) +
            (sentimentCounts.negative || 0)}
        </small>
      </div>
    </div>
  );
}

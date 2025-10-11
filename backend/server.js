const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
//middleware
app.use(cors());
app.use(express.json());

// Routes
const ownerRoutes = require("./routes/owner");
const adminRoutes = require("./routes/admin");

app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stores", require("./routes/store"));
app.use("/api/ratings", require("./routes/rating"));

// Start server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Shopinion backend is running successfully!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

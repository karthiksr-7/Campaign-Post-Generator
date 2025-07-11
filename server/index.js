// server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ Use the port provided by Render (important)
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api", require("./routes/generate-cover")); // Serves /api/generate-cover

// ✅ Optional: Health check route (good for uptime monitoring)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

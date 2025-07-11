// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/generate-cover")); // ✅ this MUST match your frontend URL

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

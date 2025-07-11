const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS config for Render
const allowedOrigins = ['https://campaign-post-generator.onrender.com'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// ✅ API route
app.use("/api", require("./routes/generate-cover"));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is live");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

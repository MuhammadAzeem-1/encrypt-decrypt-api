const express = require("express");
const { execFile } = require("child_process");
require("dotenv").config();

const app = express();
app.use(express.json());

// Encrypt endpoint
app.post("/encrypt", (req, res) => {
  const payload = JSON.stringify(req.body);
  execFile("node", ["encrypt.js", payload], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({ result: stdout.trim() });
  });
});

// Decrypt endpoint
app.post("/decrypt", (req, res) => {
  const payload = req.body
  execFile("node", ["decrypt.js", payload.data], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({ result: stdout.trim() });
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

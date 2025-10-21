import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 🔹 Simple health check / ping endpoint
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// GET proxy
app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    // Extract custom headers from request
    const customHeaders = {};
    Object.keys(req.headers).forEach(key => {
      // Skip Express-specific headers and CORS headers
      if (!key.startsWith('x-forwarded-') &&
          !key.startsWith('x-real-') &&
          key !== 'host' &&
          key !== 'connection' &&
          key !== 'content-length' &&
          key !== 'content-type' &&
          key !== 'origin' &&
          key !== 'referer' &&
          key !== 'user-agent') {
        customHeaders[key] = req.headers[key];
      }
    });

    const response = await axios.get(targetUrl, {
      headers: customHeaders,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

// POST proxy
app.post("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    // Extract custom headers from request
    const customHeaders = {};
    Object.keys(req.headers).forEach(key => {
      // Skip Express-specific headers and CORS headers
      if (!key.startsWith('x-forwarded-') &&
          !key.startsWith('x-real-') &&
          key !== 'host' &&
          key !== 'connection' &&
          key !== 'content-length' &&
          key !== 'content-type' &&
          key !== 'origin' &&
          key !== 'referer' &&
          key !== 'user-agent') {
        customHeaders[key] = req.headers[key];
      }
    });

    const response = await axios.post(targetUrl, req.body, {
      headers: customHeaders,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

// Helper for consistent error messages
function handleError(error, res) {
  if (error.response) {
    res.status(error.response.status).json(error.response.data);
  } else {
    res.status(500).json({ error: error.message });
  }
}

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

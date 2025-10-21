import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET proxy
app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    const response = await axios.get(targetUrl, {
      headers: {
        // Add your custom headers if needed
      },
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

    const response = await axios.post(targetUrl, req.body, {
      headers: {
        // Add your custom headers if needed
        // Example: "Authorization": "Bearer YOUR_TOKEN"
      },
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

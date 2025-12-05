import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Analyze this recyclable material. Identify type and recyclability." },
                { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log("AI Proxy running at port 8080"));

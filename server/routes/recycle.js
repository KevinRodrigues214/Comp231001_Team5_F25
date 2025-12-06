const express = require('express');
const router = express.Router();
const multer = require('multer');
require('dotenv').config();


const storage = multer.memoryStorage();
const upload = multer({ storage });

const API_KEY = process.env.GEMINI_API_KEY;

// POST /api/recycle/analyze
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    
    const imageBase64 = req.file.buffer.toString('base64');

    
    const bodyJSON = {
  contents: [
    {
      parts: [
        {
          text: `
Analyze this image and identify recyclable materials. 
Return a simple, single line answer in this exact format: 
material = ..., quantity = ..., value = ... like USD but you dont need to usee USD juts float.
- Count the number of recyclable items in the image.
- Calculate the total value using an average value per item (no ranges, just a single number).
- If the image contains no recyclable items, return: material = None, quantity = 0, value = 0 .
- Only return this single line, nothing else.
        `
        },
        { inline_data: { mime_type: req.file.mimetype, data: imageBase64 } }
      ]
    }
  ]
};


    console.log("🚀 Sending request to Gemini API...");

    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyJSON)
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Gemini API error:", text);
      return res.status(500).json({ error: 'Failed to fetch data from Gemini API', details: text });
    }

    const data = await response.json();

    
    const analysisText = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || "No analysis returned";

    
    const materialMatch = analysisText.match(/material\s*=\s*(.+)/i);
    const valueMatch = analysisText.match(/value\s*=\s*(.+)/i);

    
    const material = materialMatch ? materialMatch[1].split(/\n|,/)[0].trim() : "Unknown";
    const value = valueMatch ? valueMatch[1].split(/\n|,/)[0].trim() : "Unknown";

    
    res.json({ material, value });

  } catch (err) {
    console.log("🔹 Request file:", req.file ? req.file.originalname : "No file");
    console.log("🔹 API_KEY:", API_KEY ? "OK" : "MISSING");

    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

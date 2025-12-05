import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserPhotoAI({ fullPage = false }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [resultText, setResultText] = useState(""); // Aqui vai mostrar material + value
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileData(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setResultText("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    setLoading(true);
    setResultText("");

    try {
      const formData = new FormData();
      formData.append("image", fileData);

      // Chamada para o backend
      const res = await axios.post(
        "http://localhost:5000/api/recycle/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Backend retorna { material: "...", value: "..." }
      const { material, value } = res.data;
      setResultText(`material = ${material}\nvalue = ${value}`);

    } catch (err) {
      console.error(err);
      setResultText("Error: Could not analyze item.");
    }

    setLoading(false);
  };

  return (
    <section className="photo-section">
      <div className="photo-header-row">
        <div>
          <h2 className="photo-title">Photo / AI Recognition</h2>
          <p className="photo-subtitle">
            Upload a picture of an item to get a suggestion on how to dispose of it.
          </p>
        </div>
        {!fullPage && (
          <button
            type="button"
            className="section-link"
            onClick={() => navigate("/photo-ai")}
          >
            Open page
          </button>
        )}
      </div>

      <div className="photo-layout">
        <div className="photo-upload">
          <div className="photo-upload-box">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded preview" />
            ) : (
              <div className="photo-upload-placeholder">
                Drop an image here or click to browse
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <button
            type="button"
            className="photo-analyze-btn"
            onClick={handleAnalyze}
            disabled={!fileData || loading}
          >
            {loading ? "Analyzing..." : "Analyze item"}
          </button>
        </div>

        <div className="photo-result">
          <div className="photo-result-card">
            <h3>Result</h3>
            {resultText ? (
              <pre style={{ whiteSpace: "pre-wrap" }}>{resultText}</pre>
            ) : (
              <p className="photo-note photo-result-empty">
                Upload a photo and click <strong>“Analyze item”</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

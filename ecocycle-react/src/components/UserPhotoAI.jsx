import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserPhotoAI({ fullPage = false }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [resultText, setResultText] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [extractedValue, setExtractedValue] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const userId = user.id;

      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        const userData = res.data;

        
        const roundedBalance = Number((userData.balance || 0).toFixed(3));
        setUserBalance(roundedBalance);

        
        sessionStorage.setItem("user", JSON.stringify({ ...userData, balance: roundedBalance }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileData(file);
    setResultText("");
    setExtractedValue(0);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    setLoading(true);
    setResultText("");
    setExtractedValue(0);

    try {
      const formData = new FormData();
      formData.append("image", fileData);

      const res = await axios.post(
        "http://localhost:5000/api/recycle/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { material, value } = res.data;
      const numericValue = Number(String(value).replace(/[^0-9.]+/g, ""));
      const roundedValue = Number(numericValue.toFixed(3));
      setExtractedValue(roundedValue);

      setResultText(`material = ${material}\nvalue = ${value}`);
    } catch (err) {
      console.error(err);
      setResultText("Error: Could not analyze item.");
    }

    setLoading(false);
  };

  const handleAddPoints = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("User not logged in!");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    try {
      await axios.post("http://localhost:5000/api/users/add-points", {
        userId,
        points: extractedValue,
      });

      alert(`Added ${extractedValue} points!`);

      
      const newBalance = Number(((user.balance || 0) + extractedValue).toFixed(3));
      setUserBalance(newBalance);

      
      sessionStorage.setItem("user", JSON.stringify({ ...user, balance: newBalance }));

      setExtractedValue(0);
    } catch (err) {
      console.error(err);
      alert("Error adding points.");
    }
  };

  return (
    <section className="photo-section">
      <div className="photo-header-row">
        <div>
          <h2 className="photo-title">Photo / AI Recognition</h2>
          <p className="photo-subtitle">
            Upload a picture of an item to get a suggestion on how to dispose of it.
          </p>
          <p><strong>Your Balance:</strong> {userBalance} points</p>
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

          {extractedValue > 0 && (
            <button
              type="button"
              className="photo-analyze-btn"
              onClick={handleAddPoints}
            >
              Add Points
            </button>
          )}
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

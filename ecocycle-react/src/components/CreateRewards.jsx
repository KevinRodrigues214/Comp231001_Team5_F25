import React, { useState } from "react";
import "../components/style/CreateRewards.css"; // Certifique que o caminho está correto

export default function CreateRewards() {
  const [reward, setReward] = useState({
    name: "",
    description: "",
    pointsRequired: "",
    couponCode: "",
    storeName: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setReward({ ...reward, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reward),
      });

      if (response.ok) {
        setMessage("🎉 Reward created successfully!");
        setReward({
          name: "",
          description: "",
          pointsRequired: "",
          couponCode: "",
          storeName: "",
        });
      } else {
        const err = await response.json();
        setMessage(`❌ Error: ${err.message || "Failed to create reward."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Could not connect to the server.");
    }
  };

  return (
    <div className="create-rewards-container">
      <h2>Create Reward / Coupon</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Reward or Coupon Name"
          value={reward.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={reward.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pointsRequired"
          placeholder="Points Required"
          value={reward.pointsRequired}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="couponCode"
          placeholder="Coupon Code (optional)"
          value={reward.couponCode}
          onChange={handleChange}
        />

        <input
          type="text"
          name="storeName"
          placeholder="Store Name (optional)"
          value={reward.storeName}
          onChange={handleChange}
        />

        <button type="submit">Create Reward</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

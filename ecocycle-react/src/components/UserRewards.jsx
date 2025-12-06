import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRewards({ showViewAll = true }) {
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/rewards")
      .then((res) => res.json())
      .then((data) => {
       
        const storedRewards = JSON.parse(sessionStorage.getItem("revealedRewards")) || [];
        const mapped = (data || []).map((r) => ({
          ...r,
          revealed: storedRewards.includes(r._id),
        }));
        setRewards(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load rewards.");
      });
  }, []);

  const handleRedeem = (rewardId, pointsRequired) => {
    if (!user) return;
    if ((user.balance || 0) < pointsRequired) {
      alert("You don't have enough points!");
      return;
    }

    
    const newBalance = Number(user.balance) - Number(pointsRequired);
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("authChanged"));

    
    setRewards((prev) =>
      prev.map((r) =>
        r._id === rewardId ? { ...r, revealed: true } : r
      )
    );

    
    const storedRewards = JSON.parse(sessionStorage.getItem("revealedRewards")) || [];
    if (!storedRewards.includes(rewardId)) {
      sessionStorage.setItem(
        "revealedRewards",
        JSON.stringify([...storedRewards, rewardId])
      );
    }
  };

  
  const visible = rewards.slice(0, 1);

  return (
    <section className="rewards-section">
      <div className="rewards-header-row">
        <div>
          <h2 className="rewards-title">Rewards & Points</h2>
          <p className="rewards-subtitle">
            See what you can earn with your EcoPoints.
          </p>
        </div>

        {showViewAll && (
          <button
            type="button"
            className="section-link"
            onClick={() => navigate("/rewards")}
          >
            View all
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="rewards-grid">
        {visible.map((r) => (
          <article key={r._id} className="reward-card">
            <div className="reward-card-header">
              <div className="reward-icon">🏅</div>
              <div>
                <div className="reward-name">{r.name}</div>
                <div className="reward-store">{r.storeName}</div>
              </div>
            </div>

            <p className="reward-description">{r.description}</p>

            <div className="reward-meta-row">
              <span className="reward-tag">
                Requires {r.pointsRequired} points
              </span>

              {r.couponCode && (
                <span className="reward-code">
                  {r.revealed ? `Code: ${r.couponCode}` : "Code: ****"}
                </span>
              )}
            </div>

            <button
              className="reward-btn"
              type="button"
              onClick={() => handleRedeem(r._id, r.pointsRequired)}
              disabled={r.revealed || (user?.balance || 0) < r.pointsRequired}
            >
              {r.revealed ? "Redeemed" : "Redeem"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

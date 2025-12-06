import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserChallenges({ showViewAll = true }) {
  const [challenges, setChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch("http://localhost:5000/api/challenges")
      .then((res) => res.json())
      .then((data) => setChallenges(data || []))
      .catch((err) => {
        console.error(err);
        setError("Could not load challenges.");
      });

    
    const storedJoined = sessionStorage.getItem("joinedChallenges");
    if (storedJoined) {
      setJoinedChallenges(JSON.parse(storedJoined));
    }
  }, []);

  const handleJoinChallenge = async (challengeId, rewardPoints) => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return alert("User not logged in!");
    
    const user = JSON.parse(storedUser);
    const userId = user.id;

    try {
      
      await axios.post("http://localhost:5000/api/users/add-points", {
        userId,
        points: rewardPoints,
      });

      const newBalance = Number(((user.balance || 0) + rewardPoints).toFixed(3));
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, balance: newBalance })
      );

      
      const newJoined = [...joinedChallenges, challengeId];
      setJoinedChallenges(newJoined);
      sessionStorage.setItem("joinedChallenges", JSON.stringify(newJoined));

      alert(`You joined the challenge! ${rewardPoints} points added!`);
    } catch (err) {
      console.error(err);
      alert("Error joining challenge.");
    }
  };

  const visible = challenges.slice(0, 2); 

  return (
    <section className="weekly-section">
      <div className="weekly-header-row">
        <div>
          <h2 className="weekly-title">Weekly Challenges</h2>
          <p className="weekly-subtitle">
            Complete eco-tasks this week and earn points for rewards.
          </p>
        </div>

        {showViewAll && (
          <button
            type="button"
            className="section-link"
            onClick={() => navigate("/challenges")}
          >
            View all
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="challenges-grid">
        {visible.map((ch) => (
          <article key={ch._id} className="challenge-card">
            <div className="challenge-card-header">
              <div className="challenge-icon">♻️</div>
              <div>
                <div className="challenge-name">{ch.name}</div>
                <div className="challenge-points">
                  {ch.reward_points} points
                </div>
              </div>
            </div>
            <p className="challenge-description">{ch.description}</p>
            <div className="challenge-meta-row">
              <span className="challenge-tag">
                Duration: {ch.duration_days} days
              </span>
            </div>
           
            {!joinedChallenges.includes(ch._id) && (
              <button
                className="challenge-btn"
                type="button"
                onClick={() => handleJoinChallenge(ch._id, ch.reward_points)}
              >
                Join challenge
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

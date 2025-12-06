import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function useUser() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(storedUser || null);
      } catch {
        setUser(null);
      }
    };

    
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === "user") handleStorage();
    };

    
    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChanged", handleStorage);

    return () => {
      sessionStorage.setItem = originalSetItem;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChanged", handleStorage);
    };
  }, []);

  return user;
}

export default function UserHeader() {
  const navigate = useNavigate();
  const user = useUser();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" className="logo" alt="EcoCycle logo" />
      </div>

      <nav className="header-nav">
        <a onClick={() => navigate("/home")}>Dashboard</a>
        <a onClick={() => navigate("/challenges")}>Challenges</a>
        <a onClick={() => navigate("/events")}>Events</a>
        <a onClick={() => navigate("/rewards")}>Rewards</a>
        <a onClick={() => navigate("/recycling-map")}>Map</a>
        <a onClick={() => navigate("/photo-ai")}>Photo AI</a>
        <a onClick={() => navigate("/pickup-requests")}>Pick-ups</a>
        <a onClick={() => navigate("/help-page")}>Help</a>
      </nav>

      <div
        className="header-right"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        <div
          className="user-info-header"
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
        >
          <span className="user-name">
            Hi, {user?.name || user?.email || "User"}!
          </span>
          {user?.balance !== undefined && (
            <span className="user-balance" style={{ fontSize: "12px", color: "#2a9d8f" }}>
  💰 Balance: {Number(user.balance).toFixed(1)} pts
</span>

          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

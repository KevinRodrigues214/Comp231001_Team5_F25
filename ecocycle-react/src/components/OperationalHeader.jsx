import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OperationalHeader({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(sessionStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };

    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") syncUser();
    };

    const onAuthChanged = () => syncUser();

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" className="logo" alt="EcoCycle Logo" />
      </div>

      <nav className="header-nav">
        <a
          className={activeTab === "recycling" ? "active" : ""}
          onClick={() => setActiveTab("recycling")}
        >
          Add/Edit Recycling
        </a>

        <a
          className={activeTab === "stations" ? "active" : ""}
          onClick={() => setActiveTab("stations")}
        >
          Recycling Stations
        </a>

        <a
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          View Events
        </a>

        <a
          className={activeTab === "rewards" ? "active" : ""}
          onClick={() => setActiveTab("rewards")}
        >
          Rewards
        </a>

        <a
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </a>

        <a
          className={activeTab === "help" ? "active" : ""}
          onClick={() => setActiveTab("help")}
        >
          Help
        </a>
      </nav>

   
      <div className="header-right">
        <span className="user-name">
          Hi, Operational Admin!
        </span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

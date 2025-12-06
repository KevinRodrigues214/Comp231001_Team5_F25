import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CommunityHeader({ activeTab, setActiveTab }) {
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
      {/* LEFT: LOGO */}
      <div className="header-left">
        <img src="/logo.png" className="logo" alt="EcoCycle Logo" />
      </div>

      {/* CENTER NAVIGATION */}
      <nav className="header-nav">
        <a
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          Events
        </a>

        <a
          className={activeTab === "rewards" ? "active" : ""}
          onClick={() => setActiveTab("rewards")}
        >
          Rewards
        </a>

        <a
          className={activeTab === "help" ? "active" : ""}
          onClick={() => setActiveTab("help")}
        >
          Help
        </a>
      </nav>

      {/* RIGHT: USER + LOGOUT */}
      <div className="header-right">
        <span className="user-name">Hi, Community Admin!</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

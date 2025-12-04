import { useState } from "react";
import PendingApprovals from "./PendingApprovals";
import "../components/style/OperationalHome.css";

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <button
        onClick={() => setActiveTab("recycling")}
        className={activeTab === "recycling" ? "active" : ""}
      >
        Add/Edit Recycling
      </button>

      <button
        onClick={() => setActiveTab("stations")}
        className={activeTab === "stations" ? "active" : ""}
      >
        Recycling Stations
      </button>

      <button
        onClick={() => setActiveTab("events")}
        className={activeTab === "events" ? "active" : ""}
      >
        View Events
      </button>

      <button
        onClick={() => setActiveTab("rewards")}
        className={activeTab === "rewards" ? "active" : ""}
      >
        Rewards
      </button>

      <button
        onClick={() => setActiveTab("users")}
        className={activeTab === "users" ? "active" : ""}
      >
        Manage Users
      </button>

      <button
        onClick={() => setActiveTab("help")}
        className={activeTab === "help" ? "active" : ""}
      >
        Help
      </button>
    </nav>
  );
}

export default function OperationalHome() {
  const [activeTab, setActiveTab] = useState("recycling");

  const renderContent = () => {
    switch (activeTab) {
      case "recycling":
        return <div>Add/Edit Recycling Form Here</div>;
      case "stations":
        return <div>Recycling Stations Table Here</div>;
      case "events":
        return <div>Events Page Here</div>;
      case "rewards":
        return <div>Rewards Page Here</div>;
      case "users":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <PendingApprovals />
          </div>
        );
      case "help":
        return <div>Help Page Here</div>;
      default:
        return <div>Add/Edit Recycling Form Here</div>;
    }
  };

  return (
    <div className="operational-container">
      <h1 className="operational-title">Painel Operacional</h1>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="operational-card">{renderContent()}</div>
    </div>
  );
}

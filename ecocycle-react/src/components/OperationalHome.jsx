import { useState } from "react";
import PendingApprovals from "./PendingApprovals";
import "../components/style/OperationalHome.css";
import HelpPage from "./HelpPage";
import OperationalHeader from "../components/OperationalHeader";

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
        return <HelpPage />;
      default:
        return <div>Add/Edit Recycling Form Here</div>;
    }
  };

  return (
    <>
      <OperationalHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="operational-container">
        <h1 className="operational-title">Operational</h1>

        <div className="operational-card">{renderContent()}</div>
      </div>
    </>
  );
}

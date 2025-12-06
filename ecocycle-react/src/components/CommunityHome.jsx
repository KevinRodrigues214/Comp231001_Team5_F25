import { useState } from "react";
import CreateEvents from "./CreateEvents";
import CreateRewards from "./CreateRewards";
import HelpPage from "./HelpPage";
import CommunityHeader from "../components/CommunityHeader";

export default function CommunityHome() {
  const [activeTab, setActiveTab] = useState("events");

  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return <CreateEvents />;
      case "rewards":
        return <CreateRewards />;
      case "help":
        return <HelpPage />;
      default:
        return <CreateEvents />;
    }
  };

  return (
    <>
      <CommunityHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="community-container">
        <h2 className="community-title">Community Dashboard</h2>

<style jsx>{`
  .community-title {
    text-align: center;
  }
`}</style>

        <div className="community-card">{renderContent()}</div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import PendingApprovals from "./PendingApprovals";
import "../components/style/OperationalHome.css";
// You can still use HelpPage elsewhere for end users if you want
// import HelpPage from "./HelpPage";

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
        Help / Questions
      </button>
    </nav>
  );
}

/**
 * 🔹 Operational Help Questions Panel
 * This is the "OperationalUserPage" logic, embedded as a tab.
 * It:
 *  - fetches all questions from /api/questions
 *  - lets the ops user filter unanswered/all
 *  - lets them select a question & save an answer
 */
function HelpQuestionsPanel() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("unanswered"); // "all" | "unanswered"

  // Load all questions from the backend
  async function fetchQuestions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/questions");
      if (!res.ok) {
        throw new Error("Failed to load questions");
      }
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      setError("Could not load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function handleSelectQuestion(q) {
    setSelectedQuestion(q);
    setAnswerText(q.answer || "");
  }

  async function handleSaveAnswer() {
    if (!selectedQuestion || !answerText.trim()) return;

    try {
      setSaving(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/questions/${selectedQuestion._id}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answerText }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save answer");
      }

      // Update in local state
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === selectedQuestion._id ? { ...q, answer: answerText } : q
        )
      );

      setSelectedQuestion((prev) =>
        prev ? { ...prev, answer: answerText } : prev
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save answer.");
    } finally {
      setSaving(false);
    }
  }

  const filteredQuestions =
    filter === "unanswered"
      ? questions.filter((q) => !q.answer || q.answer.trim() === "")
      : questions;

  return (
    <div className="help-page">
      <div className="help-container">
        <h1 className="help-title">User Questions (Operational View)</h1>
        <p className="help-subtitle">
          Review questions submitted from the in-app Help page and respond to
          users.
        </p>

        <div className="help-grid ops-grid">
          {/* Left: question list */}
          <section className="help-faqs">
            <div className="ops-header">
              <h2>Inbox</h2>
              <div className="ops-actions">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="unanswered">Unanswered only</option>
                  <option value="all">All questions</option>
                </select>
                <button onClick={fetchQuestions}>Refresh</button>
              </div>
            </div>

            {loading && <p>Loading questions…</p>}
            {error && <p className="help-error">{error}</p>}

            {!loading && !error && filteredQuestions.length === 0 && (
              <p className="help-subtitle">No questions to show.</p>
            )}

            <div className="ops-list">
              {filteredQuestions.map((q) => (
                <button
                  key={q._id}
                  className={`ops-item ${
                    selectedQuestion && selectedQuestion._id === q._id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleSelectQuestion(q)}
                >
                  <div className="ops-item-main">
                    <div className="ops-item-user">
                      <strong>{q.name || "Anonymous"}</strong>{" "}
                      <span className="ops-item-email">
                        {q.email || "No email"}
                      </span>
                    </div>
                    <div className="ops-item-question">
                      {q.question?.slice(0, 80) || ""}
                      {q.question && q.question.length > 80 ? "…" : ""}
                    </div>
                  </div>
                  <div className="ops-item-status">
                    {q.answer && q.answer.trim() !== "" ? (
                      <span className="badge badge-answered">Answered</span>
                    ) : (
                      <span className="badge badge-pending">Pending</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Right: detail + reply box */}
          <aside className="help-form-aside">
            {!selectedQuestion ? (
              <div className="ops-empty-state">
                <h2>Select a question</h2>
                <p className="help-subtitle">
                  Click a question on the left to view details and respond.
                </p>
              </div>
            ) : (
              <>
                <h2>Question details</h2>
                <div className="ops-question-meta">
                  <p>
                    <strong>From:</strong>{" "}
                    {selectedQuestion.name || "Anonymous"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedQuestion.email || "No email provided"}
                  </p>
                  {selectedQuestion.createdAt && (
                    <p>
                      <strong>Received:</strong>{" "}
                      {new Date(selectedQuestion.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="ops-question-body">
                  <h3>User Question</h3>
                  <p>{selectedQuestion.question}</p>
                </div>

                <div className="ops-answer-section">
                  <h3>Your Answer</h3>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your response to the user here..."
                  />

                  {error && <div className="help-error">{error}</div>}

                  <div className="help-form-actions">
                    <button
                      type="button"
                      className="send-btn"
                      disabled={saving || !answerText.trim()}
                      onClick={handleSaveAnswer}
                    >
                      {saving ? "Saving..." : "Save answer"}
                    </button>
                    <button
                      type="button"
                      className="clear-btn"
                      onClick={() => setAnswerText("")}
                    >
                      Clear
                    </button>
                  </div>

                  {selectedQuestion.answer && (
                    <p className="help-subtitle">
                      ✅ This question currently has a saved answer.
                    </p>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
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
        // 🔹 Now shows the operational questions inbox
        return <HelpQuestionsPanel />;
      default:
        return <div>Add/Edit Recycling Form Here</div>;
    }
  };

  return (
    <div className="operational-container">
      <h1 className="operational-title">Operational</h1>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="operational-card">{renderContent()}</div>
    </div>
  );
}

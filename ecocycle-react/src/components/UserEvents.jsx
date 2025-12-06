import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserEvents({ showViewAll = false }) {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) throw new Error("Failed to load events");

        const data = await res.json();
        setEvents(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();

    
    const storedJoined = sessionStorage.getItem("joinedEvents");
    if (storedJoined) {
      setJoinedEvents(JSON.parse(storedJoined));
    }
  }, []);

  const handleJoinEvent = async (eventId, eventPoints) => {
  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) return alert("User not logged in!");

  const user = JSON.parse(storedUser);
  const userId = user.id;

  try {
    await axios.post("http://localhost:5000/api/users/add-points", {
      userId,
      points: eventPoints,
    });

    const currentBalance = Number(user.balance) || 0;
    const pointsToAdd = Number(eventPoints) || 0;
    const newBalance = Number((currentBalance + pointsToAdd).toFixed(3));

    sessionStorage.setItem(
      "user",
      JSON.stringify({ ...user, balance: newBalance })
    );

    const newJoined = [...joinedEvents, eventId];
    setJoinedEvents(newJoined);
    sessionStorage.setItem("joinedEvents", JSON.stringify(newJoined));

    alert(`You joined the event! ${pointsToAdd} points added!`);
  } catch (err) {
    if (err.response?.data?.error === "ErroJoinInEvent") {
      const newJoined = [...joinedEvents, eventId];
      setJoinedEvents(newJoined);
      sessionStorage.setItem("joinedEvents", JSON.stringify(newJoined));
    } else {
      console.error(err);
      alert("Error joining event.");
    }
  }
};


  if (loading) return <div className="events-section">Loading events...</div>;
  if (error) return <div className="events-section error-text">{error}</div>;

  return (
    <section className="events-section">
      <div className="events-header-row">
        <div>
          <h2 className="events-title">Upcoming Events</h2>
          <p className="events-subtitle">
            Join local clean-ups and recycling activities in your community.
          </p>
        </div>

        {showViewAll && (
          <button
            type="button"
            className="section-link-btn"
            onClick={() => navigate("/events")}
          >
            View all
          </button>
        )}
      </div>

      {events.length === 0 && <p>No events available right now.</p>}

      <div className="events-grid">
        {events.map((e) => (
          <article key={e._id} className="event-card">
            <div className="event-card-header">
              <div className="event-icon">📍</div>
              <div>
                <h3 className="event-name">{e.eventName || e.name}</h3>
                <p className="event-location">{e.eventLocation}</p>
              </div>
            </div>

            <p className="event-description">{e.eventDescription}</p>

            <div className="event-meta-row">
              <span className="event-tag">
                {e.eventDate} • {e.eventTime}
              </span>
              {e.eventPoints && (
                <span className="event-points">+{e.eventPoints} pts</span>
              )}
            </div>

            
            {e.eventPoints && !joinedEvents.includes(e._id) && (
              <button
                className="event-btn"
                type="button"
                onClick={() => handleJoinEvent(e._id, e.eventPoints)}
              >
                Join event
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default UserEvents;

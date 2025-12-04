import React, { useState } from "react";


export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const faqs = [
    { q: "How do I get points?", a: "Complete challenges, scan objects, and participate in events." },
    { q: "Where can I find recycling stations?", a: "Recycling stations are under the Map icon." },
    { q: "How do I get my rewards based on my points?", a: "Open Rewards and check whether you have enough points to redeem." },
  ];

  function toggleFaq(i) {
    setOpenIndex(openIndex === i ? null : i);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.message.trim()) return "Please enter a message.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }

    setStatus({ type: "sending", message: "Sending..." });

    try {
      const res = await fetch("http://localhost:5000/api/support/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Send failed" });
        return;
      }

      setStatus({ type: "success", message: "Thanks — your message has been sent!" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Server error. Try again later." });
    }
  }

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-grid">
          {/* Left: FAQs */}
          <section className="help-faqs">
            <h1 className="help-title">Help & Support</h1>
            <p className="help-subtitle">Find answers to common questions or send us a message.</p>

            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {f.q}
                    <span className={`faq-arrow ${openIndex === i ? "rotate" : ""}`}>▼</span>
                  </button>
                  <div className="faq-answer">{f.a}</div>
                </div>
              ))}
            </div>

            <div className="faq-contact">
              <strong>Still need help?</strong>
              <p>Contact us directly:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:support@example.com">support@example.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+18001234567">+1 (800) 123‑4567</a></li>
                <li><strong>Hours:</strong> Mon–Fri, 9:00 AM — 6:00 PM (ET)</li>
              </ul>
            </div>
          </section>

          {/* Right: Contact Form */}
          <aside className="help-form-aside">
            <h2>Send us a question</h2>
            <p className="help-subtitle">We'll get back to you within 1–2 business days.</p>

            <form className="help-form" onSubmit={handleSubmit} noValidate>
              <label>Your name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />

              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" />

              <label>Question</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your question here..." />

              {status.type === "error" && <div className="help-error">{status.message}</div>}
              {status.type === "success" && <div className="help-success">{status.message}</div>}

              <div className="help-form-actions">
                <button type="submit" className="send-btn" disabled={status.type === "sending"}>
                  {status.type === "sending" ? "Sending..." : "Send message"}
                </button>
                <button type="button" className="clear-btn" onClick={() => { setForm({ name: "", email: "", message: "" }); setStatus({ type: "idle", message: "" }); }}>
                  Clear
                </button>
              </div>
              <div className="help-privacy">By sending a message you agree to our <a href="#">privacy policy</a>.</div>
            </form>
          </aside>
        </div>

        <footer className="help-footer">© {new Date().getFullYear()} EcoCycle — Help Center</footer>
      </div>
    </div>
  );
}

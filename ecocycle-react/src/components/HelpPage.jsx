import React, { useState } from "react";

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

   const faqs = [
    { q: "How do I get points?", a: "Complete challenges, scan objects, and participate in event" },
    { q: "Where can I find recycling stations?", a: "Recycling stations are under the Map icon" },
    { q: "How do get my rewards based on my points?", a: "Open Rewards and check whether you have enough points to redeem" }
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Left: FAQs */}
          <section>
            <h1 className="text-2xl md:text-3xl font-semibold">Help & Support</h1>
            <p className="mt-2 text-slate-600">Find answers to common questions or send us a message.</p>

            <div className="mt-6 space-y-3" role="list">
              {faqs.map((f, i) => (
                <div key={i} className="border rounded-lg" role="listitem">
                  <button
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                    aria-expanded={openIndex === i}
                    onClick={() => toggleFaq(i)}
                  >
                    <span className="text-left font-medium">{f.q}</span>
                    <svg className={`w-5 h-5 transform ${openIndex === i ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openIndex === i && (
                    <div className="px-4 pb-4 text-slate-700 text-sm">{f.a}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-6 text-sm text-slate-600">
              <strong>Still need help?</strong>
              <p className="mt-2">Contact us directly:</p>
              <ul className="mt-3 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:support@example.com" className="text-sky-600">support@example.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+18001234567" className="text-sky-600">+1 (800) 123‑4567</a></li>
                <li><strong>Hours:</strong> Mon–Fri, 9:00 AM — 6:00 PM (ET)</li>
              </ul>
            </div>
          </section>

          {/* Right: Contact Form */}
          <aside>
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 h-full flex flex-col">
              <h2 className="text-lg font-medium">Send us a question</h2>
              <p className="text-sm text-slate-600 mt-1">We'll get back to you within 1–2 business days.</p>

              <form className="mt-4 flex-1 flex flex-col" onSubmit={handleSubmit} noValidate>
                <label className="text-sm">Your name</label>
                <input name="name" value={form.name} onChange={handleChange} className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-sky-300" placeholder="Jane Doe" />

                <label className="text-sm mt-3">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-sky-300" placeholder="you@company.com" />

                <label className="text-sm mt-3">Question</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-sky-300 min-h-[120px] resize-none" placeholder="Write your question here..." />

                {status.type === "error" && <div className="mt-3 text-sm text-red-600">{status.message}</div>}
                {status.type === "success" && <div className="mt-3 text-sm text-green-600">{status.message}</div>}

                <div className="mt-4 flex items-center gap-3">
                  <button type="submit" className="px-4 py-2 rounded-md bg-sky-600 text-white font-medium shadow-sm hover:opacity-95 disabled:opacity-50" disabled={status.type === "sending"}>
                    {status.type === "sending" ? "Sending..." : "Send message"}
                  </button>
                  <button type="button" className="px-3 py-2 rounded-md border" onClick={() => { setForm({ name: "", email: "", message: "" }); setStatus({ type: "idle", message: "" }); }}>Clear</button>
                </div>

                <div className="mt-6 text-xs text-slate-500">By sending a message you agree to our <a href="#" className="underline">privacy policy</a>.</div>
              </form>
            </div>
          </aside>
        </div>

        <div className="border-t bg-slate-50 p-4 text-xs text-center text-slate-500">© {new Date().getFullYear()} EcoCycle — Help Center</div>
      </div>
    </div>
  );
}

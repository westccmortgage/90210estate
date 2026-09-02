"use client";

import { FormEvent, useState } from "react";

const INBOX = "westccmortgage@gmail.com";

/** Posts to the schema declared in public/__forms.html — see the note there. */
export function ContactForm({ subject = "" }: { subject?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mailto, setMailto] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("form-name", "contact");
    data.set("subject", subject || "90210 Estate — website enquiry");
    data.set("page", typeof window === "undefined" ? "" : window.location.href);
    setStatus("sending");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, value.toString()));
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      // Never leave someone at a dead end: hand them a prefilled email instead.
      const lines = [
        `Name: ${data.get("name") ?? ""}`,
        `Email: ${data.get("email") ?? ""}`,
        `Phone: ${data.get("phone") ?? ""}`,
        "",
        String(data.get("message") ?? ""),
      ];
      setMailto(
        `mailto:${INBOX}?subject=${encodeURIComponent("90210 Estate — website enquiry")}&body=${encodeURIComponent(lines.join("\n"))}`
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="notice" role="status">
        Thank you — your message reached us. We reply within one business day.
      </p>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
      />
      <div className="form-grid">
        <div className="field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field full">
          <label htmlFor="cf-message">How can we help?</label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            required
            placeholder="A neighborhood, a property, a financing question…"
          />
        </div>
      </div>
      <div className="form-actions">
        <button className="button navy" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="form-note">We never share your details.</span>
      </div>
      {status === "error" && (
        <p className="notice" role="alert" style={{ marginTop: 22 }}>
          Sending failed. <a href={mailto}>Send it from your email app instead →</a>
        </p>
      )}
    </form>
  );
}

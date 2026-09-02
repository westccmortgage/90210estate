"use client";

import { FormEvent, useState } from "react";

export function ListingSubmission() {
  const [status, setStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const lines = [
      `Agent: ${data.get("agent")}`,
      `Brokerage: ${data.get("brokerage")}`,
      `DRE license: ${data.get("license")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Property: ${data.get("property")}`,
      `MLS / listing URL: ${data.get("url")}`,
      `Notes: ${data.get("notes")}`,
    ];
    setStatus("sending");
    const body = new URLSearchParams();
    body.append("form-name", "listing-submission");
    data.forEach((value, key) => body.append(key, value.toString()));
    fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus("Submission received. We review every listing before it is published.");
      })
      .catch(() => {
        // Fall back to the visitor's mail client rather than losing the listing.
        window.location.href = `mailto:westccmortgage@gmail.com?subject=${encodeURIComponent("90210 Estate — listing submission")}&body=${encodeURIComponent(lines.join("\n"))}`;
        setStatus("Your email app has been opened with the submission details. Attach listing photos or a media link before sending.");
      });
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="agent">Agent name</label><input id="agent" name="agent" required /></div>
        <div className="field"><label htmlFor="brokerage">Brokerage</label><input id="brokerage" name="brokerage" required /></div>
        <div className="field"><label htmlFor="license">California DRE license</label><input id="license" name="license" required /></div>
        <div className="field"><label htmlFor="email">Business email</label><input id="email" name="email" type="email" required /></div>
        <div className="field"><label htmlFor="phone">Business phone</label><input id="phone" name="phone" type="tel" /></div>
        <div className="field"><label htmlFor="property">Property address</label><input id="property" name="property" required /></div>
        <div className="field full"><label htmlFor="url">MLS or public listing URL</label><input id="url" name="url" type="url" required /></div>
        <div className="field full"><label htmlFor="notes">Notes for the feature</label><textarea id="notes" name="notes" rows={4} placeholder="Open house date, special features, preferred contact method…" /></div>
      </div>
      <div className="form-actions">
        <button className="button navy" type="submit">Prepare submission email</button>
        <span className="form-note">No fee. Submission is reviewed before publication.</span>
      </div>
      {status && <p className="notice" role="status" style={{ marginTop: 22 }}>{status}</p>}
    </form>
  );
}

"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function LoginForm({ nextPath = "/admin" }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("Checking...");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      window.location.href = nextPath;
      return;
    }
    setMessage("That password did not work.");
  }

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="login-icon"><LockKeyhole aria-hidden="true" size={22} /></div>
        <h1>Admin login</h1>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
        </label>
        <button className="solid-button full">Open admin</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}

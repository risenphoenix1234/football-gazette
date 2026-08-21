// app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hardcoded for now — swap for real API later
    if (email === "admin@footballgazette.com" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#2d1a6e",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Football Gazette
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Admin Portal
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#111827" }}>Sign In</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Email</label>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                style={{ fontSize: 14, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Password</label>
              <input
                type="password" value={password} required
                onChange={e => setPassword(e.target.value)}
                style={{ fontSize: 14, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, outline: "none", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <button type="submit" style={{
              background: "#7c3aed", color: "#fff", border: "none",
              padding: "11px", borderRadius: 8, fontSize: 14,
              fontWeight: 600, cursor: "pointer", width: "100%",
            }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
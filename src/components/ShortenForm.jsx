"use client";

import { useState } from "react";
import axios from "axios";

export default function ShortenForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiration, setExpiration] = useState("10min");
  const [customDatetime, setCustomDatetime] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const predefinedOptions = {
    "10min": "10 Minutes",
    "1hour": "1 Hour",
    "1day": "1 Day",
    "1week": "1 Week",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const payload = {
        original_url: originalUrl,
        custom_alias: customAlias || undefined,
        expiration: expiration || "1day",
      };

      // If customDatetime is set, use it instead of preset durations
      if (customDatetime) {
        payload.expires_at = new Date(customDatetime).toISOString();
        delete payload.expiration;
      }

      const res = await axios.post(`${baseURL}/shorten`, payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleCopy = async () => {
    if (result?.short_url) {
      try {
        await navigator.clipboard.writeText(result.short_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Shorten Your URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          required
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          Please select your URL's expiration time:
        </p>
        <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {Object.entries(predefinedOptions).map(([value, label]) => (
            <button
              type="button"
              key={value}
              onClick={() => {
                setExpiration(value);
                setCustomDatetime("");
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: expiration === value ? "#0070f3" : "#e0e0e0",
                color: expiration === value ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 font-medium">Or enter custom expiration date:</p>
        <input
          type="datetime-local"
          value={customDatetime}
          onChange={(e) => {
            setCustomDatetime(e.target.value);
            setExpiration("");
          }}
          placeholder="Or enter custom expiration date"
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Shorten
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
            textAlign: "center",
          }}
        >
          <p>
            <strong>Short URL: </strong>
            <span
              style={{
                cursor: "pointer",
                color: "#0070f3",
                textDecoration: "underline",
              }}
              onClick={handleCopy}
            >
              {result.short_url}
            </span>
          </p>
          {copied && <p style={{ color: "green" }}>Copied to clipboard!</p>}
          {result.qr_code_base64 && (
            <img
              src={`data:image/png;base64,${result.qr_code_base64}`}
              alt="QR Code"
              style={{ width: "180px", marginTop: "10px", borderRadius: "4px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
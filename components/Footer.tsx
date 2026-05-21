"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  }

  const linkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Nunito Sans', sans-serif",
    fontWeight: 400,
    fontSize: "0.9375rem",
    color: "#6b7280",
    padding: "4px 0",
    textAlign: "left",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #2d501640",
        padding: "96px 0 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Main grid: 3 cols desktop, stacked mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "48px 32px",
            marginBottom: "64px",
          }}
        >
          {/* Column 1 — Brand */}
          <div>
            <button
              onClick={() => router.push("/")}
              aria-label="Large Scoop — go to homepage"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {/* Bowl icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <ellipse cx="16" cy="20" rx="12" ry="5" fill="#2d5016" />
                <path
                  d="M5 20c0 3.866 4.925 7 11 7s11-3.134 11-7H5z"
                  fill="#2d5016"
                />
                <ellipse cx="16" cy="13" rx="9" ry="9" fill="#a8d5a2" />
                <ellipse cx="16" cy="13" rx="7" ry="7" fill="#c5e8c0" />
                <circle cx="13" cy="10" r="1.2" fill="#4a7a3f" />
                <circle cx="18" cy="11" r="1" fill="#3d6b34" />
                <circle cx="15" cy="14" r="0.9" fill="#4a7a3f" />
                <circle cx="11" cy="13" r="0.8" fill="#3d6b34" />
                <circle cx="19" cy="14" r="1.1" fill="#4a7a3f" />
              </svg>
              <span
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1875rem",
                  color: "#f5f5f5",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Large Scoop
              </span>
            </button>

            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.9375rem",
                color: "#6b7280",
                lineHeight: 1.7,
                maxWidth: "280px",
                marginBottom: "24px",
              }}
            >
              Boldly crafted, unapologetically creamy. Made in India with
              love for real ingredients and generous portions.
            </p>

            {/* Trust pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {["Made in India", "Free shipping ₹499+", "No preservatives"].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#f59e0b",
                      background: "#f59e0b18",
                      border: "1px solid #f59e0b40",
                      borderRadius: "9999px",
                      padding: "4px 12px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#f5f5f5",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {[
                  { label: "Home", path: "/" },
                  { label: "Shop", path: "/shop" },
                  { label: "Flavors", path: "/flavors" },
                  { label: "About", path: "/about" },
                  { label: "Gifting", path: "/gifting" },
                  { label: "Contact", path: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => router.push(item.path)}
                      aria-label={`Go to ${item.label}`}
                      style={linkStyle}
                      onMouseEnter={(e) =>
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.color = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.color = "#6b7280")
                      }
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 — Newsletter */}
          <div>
            <h3
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#f5f5f5",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              New flavors, limited drops, and scoops of joy — right to
              your inbox.
            </p>

            {subscribed ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px",
                  background: "#2d501640",
                  border: "1px solid #2d5016",
                  borderRadius: "12px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: "0.9375rem",
                    color: "#f5f5f5",
                  }}
                >
                  You&apos;re on the list!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label
                    htmlFor="footer-email"
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: 0,
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  >
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-invalid={!!emailError}
                    aria-describedby={
                      emailError ? "footer-email-error" : undefined
                    }
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.9375rem",
                      background: "#1a1a1a",
                      border: emailError
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #2d501660",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      color: "#f5f5f5",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  {emailError && (
                    <p
                      id="footer-email-error"
                      role="alert"
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.8125rem",
                        color: "#ef4444",
                        margin: 0,
                      }}
                    >
                      {emailError}
                    </p>
                  )}
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      background: "#f59e0b",
                      color: "#0a0a0a",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 24px",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                      transition:
                        "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #f59e0b";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                        "2px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "#2d501640",
            marginBottom: "40px",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Large Scoop. All rights reserved.
            Payments via Razorpay.
          </p>

          {/* Social icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Large Scoop on Instagram"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "#1a1a1a",
                borderRadius: "12px",
                color: "#6b7280",
                border: "1px solid #2d501640",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#f59e0b40";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b10";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#2d501640";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#1a1a1a";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Large Scoop on Twitter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "#1a1a1a",
                borderRadius: "12px",
                color: "#6b7280",
                border: "1px solid #2d501640",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#f59e0b40";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b10";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#2d501640";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#1a1a1a";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4l16 16M4 20L20 4" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Large Scoop on WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "#1a1a1a",
                borderRadius: "12px",
                color: "#6b7280",
                border: "1px solid #2d501640",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#f59e0b40";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b10";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#2d501640";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#1a1a1a";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
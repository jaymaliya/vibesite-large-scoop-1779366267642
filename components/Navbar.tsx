"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems !== prevTotalRef.current) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const navBg = scrolled ? "#0a0a0a" : "transparent";
  const navShadow = scrolled
    ? "0 2px 24px 0 rgba(10,10,10,0.72)"
    : "none";

  const linkBase: React.CSSProperties = {
    fontFamily: "'Nunito Sans', sans-serif",
    fontWeight: 500,
    fontSize: "0.9375rem",
    color: "#f5f5f5",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 4px",
    letterSpacing: "0.01em",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  function navPush(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: navBg,
          boxShadow: navShadow,
          transition:
            "background 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => navPush("/")}
            aria-label="Large Scoop — go to homepage"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Bowl icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <ellipse cx="16" cy="20" rx="12" ry="5" fill="#2d5016" />
              <path
                d="M5 20c0 3.866 4.925 7 11 7s11-3.134 11-7H5z"
                fill="#2d5016"
              />
              <ellipse cx="16" cy="13" rx="9" ry="9" fill="#a8d5a2" />
              <ellipse cx="16" cy="13" rx="7" ry="7" fill="#c5e8c0" />
              {/* pistachio bits */}
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
                fontSize: "1.25rem",
                color: "#f5f5f5",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Large Scoop
            </span>
          </button>

          {/* Desktop nav links + icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="hidden-mobile"
          >
            <button
              onClick={() => navPush("/shop")}
              style={linkBase}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f59e0b")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5")
              }
              aria-label="Shop"
            >
              Shop
            </button>
            <button
              onClick={() => navPush("/flavors")}
              style={{ ...linkBase, marginLeft: "16px" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f59e0b")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5")
              }
              aria-label="Flavors"
            >
              Flavors
            </button>
            <button
              onClick={() => navPush("/about")}
              style={{ ...linkBase, marginLeft: "16px" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f59e0b")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5")
              }
              aria-label="About"
            >
              About
            </button>
            <button
              onClick={() => navPush("/gifting")}
              style={{ ...linkBase, marginLeft: "16px" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f59e0b")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5")
              }
              aria-label="Gifting"
            >
              Gifting
            </button>

            {/* Divider */}
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "1px",
                height: "20px",
                background: "#6b728040",
                margin: "0 16px",
              }}
            />

            {/* Search icon */}
            <button
              onClick={() => navPush("/search")}
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                borderRadius: "12px",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#f59e0b18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart icon with badge */}
            <button
              onClick={() => navPush("/cart")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                position: "relative",
                borderRadius: "12px",
                marginLeft: "4px",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#f59e0b18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "16px",
                    height: "16px",
                    background: "#ef4444",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                    transform: badgeBump ? "scale(1.35)" : "scale(1)",
                    transition:
                      "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile right — cart + hamburger */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="visible-mobile"
          >
            <button
              onClick={() => navPush("/cart")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                position: "relative",
                borderRadius: "12px",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "16px",
                    height: "16px",
                    background: "#ef4444",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                    transform: badgeBump ? "scale(1.35)" : "scale(1)",
                    transition:
                      "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#f5f5f5",
                  borderRadius: "2px",
                  transform: menuOpen
                    ? "translateY(7px) rotate(45deg)"
                    : "none",
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#f5f5f5",
                  borderRadius: "2px",
                  opacity: menuOpen ? 0 : 1,
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#f5f5f5",
                  borderRadius: "2px",
                  transform: menuOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "96px 32px 48px",
          gap: "0",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition:
            "opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {[
          { label: "Shop", path: "/shop" },
          { label: "Flavors", path: "/flavors" },
          { label: "About", path: "/about" },
          { label: "Gifting", path: "/gifting" },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={() => navPush(item.path)}
            aria-label={item.label}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
              fontSize: "2rem",
              color: "#f5f5f5",
              padding: "12px 0",
              letterSpacing: "-0.02em",
              transform: menuOpen
                ? "translateY(0)"
                : "translateY(24px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 0.35s cubic-bezier(0.4,0,0.2,1) ${i * 60}ms, opacity 0.35s cubic-bezier(0.4,0,0.2,1) ${i * 60}ms, color 0.2s cubic-bezier(0.4,0,0.2,1)`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#f59e0b")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5")
            }
          >
            {item.label}
          </button>
        ))}

        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "2px",
            background: "#f59e0b",
            margin: "32px 0 24px",
            borderRadius: "2px",
          }}
        />

        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.875rem",
            color: "#6b7280",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Boldly crafted, unapologetically creamy.
        </p>
      </div>

      {/* Responsive style injection via globals assumption — using Tailwind-like class override via a global approach */}
      {/* We use a data-attribute trick for responsive visibility without inline style tags */}
    </>
  );
}
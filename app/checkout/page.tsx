"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition =
        "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin))
      newErrors.pin = "Enter a valid 6-digit PIN code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsPlacing(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      const win = window as typeof window & { Razorpay: any };
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new win.Razorpay({
          key: "rzp_test_",
          amount: order.amount,
          currency: "INR",
          name: "Large Scoop",
          description: "Premium Artisan Ice Cream",
          order_id: order.id,
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#f59e0b" },
          handler: () => {
            clearCart?.();
            router.push("/");
          },
        });
        rzp.open();
        setIsPlacing(false);
      };
      script.onerror = () => setIsPlacing(false);
      document.body.appendChild(script);
    } catch {
      setIsPlacing(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: errors[field]
      ? "1.5px solid #ef4444"
      : "1.5px solid rgba(245,245,245,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    fontSize: "1rem",
    fontFamily: "'Nunito Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "0.8125rem",
    marginTop: "6px",
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  ];

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap"
        />
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "var(--text)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: 1.7,
            maxWidth: "320px",
            textAlign: "center",
            margin: 0,
          }}
        >
          Looks like you haven't added any scoops yet. Explore our flavors!
        </p>
        <button
          onClick={() => router.push("/shop")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.98)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          style={{
            padding: "16px 40px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "#f59e0b",
            color: "#0a0a0a",
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: "0.02em",
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 10px 30px -10px rgba(245,158,11,0.5)",
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap"
      />

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(10,10,10,0.96)"
            : "rgba(10,10,10,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(245,245,245,0.08)"
            : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#0a0a0a"
              >
                <ellipse cx="12" cy="10" rx="8" ry="6" />
                <path
                  d="M4 10 Q4 20 12 22 Q20 20 20 10"
                  fill="#0a0a0a"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Large Scoop
            </span>
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            {[
              { label: "Shop", path: "/shop" },
              { label: "Flavors", path: "/shop" },
              { label: "About", path: "/" },
              { label: "Gifting", path: "/" },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.path)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: "0.9375rem",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 500,
                  padding: "4px 0",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "var(--text)",
            }}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileNavOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile overlay */}
        {mobileNavOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(10,10,10,0.97)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {[
              { label: "Shop", path: "/shop" },
              { label: "Flavors", path: "/shop" },
              { label: "About", path: "/" },
              { label: "Gifting", path: "/" },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileNavOpen(false);
                  router.push(link.path);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: "2rem",
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN CHECKOUT */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "80px 48px 96px",
        }}
      >
        {/* Page header */}
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 600,
              color: "#f59e0b",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Almost there
          </span>
          <h1
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              color: "var(--text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "12px 0 0",
            }}
          >
            Checkout
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "64px",
            alignItems: "start",
          }}
        >
          {/* LEFT — FORM */}
          <div className="reveal">
            {/* Trust bar */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                marginBottom: "40px",
                padding: "16px 20px",
                borderRadius: "12px",
                background: "rgba(45,80,22,0.3)",
                border: "1px solid rgba(45,80,22,0.6)",
              }}
            >
              {[
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  text: "Secure Payment",
                },
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  ),
                  text: "Free delivery over ₹500",
                },
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ),
                  text: "Made in India 🇮🇳",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  {t.icon}
                  {t.text}
                </div>
              ))}
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handlePlaceOrder();
              }}
              noValidate
            >
              <h2
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                  marginBottom: "28px",
                  marginTop: 0,
                  paddingBottom: "16px",
                  borderBottom: "1px solid rgba(245,245,245,0.08)",
                }}
              >
                Contact Information
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    style={inputStyle("fullName")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#f59e0b";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.fullName
                        ? "#ef4444"
                        : "rgba(245,245,245,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.fullName && (
                    <p style={errorStyle}>{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="arjun@example.com"
                    style={inputStyle("email")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#f59e0b";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.email
                        ? "#ef4444"
                        : "rgba(245,245,245,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.email && (
                    <p style={errorStyle}>{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: "1rem",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 500,
                      pointerEvents: "none",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    style={{ ...inputStyle("phone"), paddingLeft: "52px" }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#f59e0b";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.phone
                        ? "#ef4444"
                        : "rgba(245,245,245,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>

              <h2
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                  marginBottom: "28px",
                  marginTop: "40px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid rgba(245,245,245,0.08)",
                }}
              >
                Delivery Address
              </h2>

              {/* Street Address */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Street Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Flat 4B, Sunflower Apartments, MG Road"
                  rows={3}
                  style={{
                    ...inputStyle("address"),
                    resize: "none",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#f59e0b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(245,158,11,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.address
                      ? "#ef4444"
                      : "rgba(245,245,245,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.address && (
                  <p style={errorStyle}>{errors.address}</p>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* City */}
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    style={inputStyle("city")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#f59e0b";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.city
                        ? "#ef4444"
                        : "rgba(245,245,245,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.city && <p style={errorStyle}>{errors.city}</p>}
                </div>

                {/* PIN */}
                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input
                    type="text"
                    name="pin"
                    value={form.pin}
                    onChange={handleChange}
                    placeholder="560001"
                    maxLength={6}
                    style={inputStyle("pin")}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#f59e0b";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.pin
                        ? "#ef4444"
                        : "rgba(245,245,245,0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
                </div>
              </div>

              {/* State */}
              <div style={{ marginBottom: "40px" }}>
                <label style={labelStyle}>State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  style={{
                    ...inputStyle("state"),
                    appearance: "none",
                    WebkitAppearance: "none",
                    cursor: "pointer",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "44px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#f59e0b";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(245,158,11,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.state
                      ? "#ef4444"
                      : "rgba(245,245,245,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="" disabled style={{ background: "#0a0a0a" }}>
                    Select state
                  </option>
                  {states.map((s) => (
                    <option key={s} value={s} style={{ background: "#0a0a0a" }}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>

              {/* Payment section */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  background: "rgba(45,80,22,0.2)",
                  border: "1px solid rgba(45,80,22,0.5)",
                  marginBottom: "32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    Pay via Razorpay
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "0.8125rem",
                      color: "var(--muted)",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    UPI, Cards, Net Banking, Wallets — all supported
                  </p>
                </div>
              </div>

              {/* CTA button (desktop hidden — shown in right column on desktop) */}
              <button
                type="submit"
                disabled={isPlacing}
                onMouseEnter={(e) => {
                  if (!isPlacing)
                    e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                style={{
                  width: "100%",
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: isPlacing ? "not-allowed" : "pointer",
                  background: isPlacing ? "#6b7280" : "#f59e0b",
                  color: "#0a0a0a",
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: "0.02em",
                  transition:
                    "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s ease",
                  boxShadow: isPlacing
                    ? "none"
                    : "0 10px 40px -10px rgba(245,158,11,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {isPlacing ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order — Pay ₹{total.toLocaleString("en-IN")}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div
            className="reveal"
            style={{
              position: "sticky",
              top: "104px",
            }}
          >
            <div
              style={{
                borderRadius: "20px",
                background: "rgba(45,80,22,0.18)",
                border: "1px solid rgba(45,80,22,0.45)",
                overflow: "hidden",
                boxShadow: "0 24px 64px -16px rgba(10,10,10,0.6)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "24px 28px",
                  borderBottom: "1px solid rgba(245,245,245,0.06)",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1875rem",
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Order Summary
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  {items.length} item{items.length !== 1 ? "s" : ""} in your
                  cart
                </p>
              </div>

              {/* Items */}
              <div style={{ padding: "8px 0" }}>
                {items.map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 28px",
                      borderBottom: "1px solid rgba(245,245,245,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "rgba(45,80,22,0.4)",
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "var(--text)",
                          letterSpacing: "-0.01em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "0.8125rem",
                          color: "var(--muted)",
                          fontFamily: "'Nunito Sans', sans-serif",
                        }}
                      >
                        Qty: {item.quantity ?? 1}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "#f59e0b",
                        flexShrink: 0,
                      }}
                    >
                      ₹
                      {(
                        (item.price ?? 0) * (item.quantity ?? 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                style={{
                  padding: "24px 28px",
                  borderTop: "1px solid rgba(245,245,245,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--muted)",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--muted)",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    Delivery
                  </span>
                  {shipping === 0 ? (
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#4ade80",
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      FREE
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--text)",
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      ₹{shipping.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {shipping > 0 && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      fontSize: "0.8125rem",
                      color: "#f59e0b",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for
                    free delivery
                  </div>
                )}

                <div
                  style={{
                    height: "1px",
                    background: "rgba(245,245,245,0.08)",
                    margin: "4px 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.0625rem",
                      color: "var(--text)",
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "1.375rem",
                      color: "#f59e0b",
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Trust badge */}
              <div
                style={{
                  padding: "16px 28px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  256-bit SSL encrypted checkout
                </span>
              </div>

              {/* Rating */}
              <div
                style={{
                  margin: "0 28px 24px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(245,245,245,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#f59e0b"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  4.9 · 12,000+ happy customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Spin keyframe via a hidden element trick */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<style>@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } .nav-links { display: none !important; } .hamburger { display: flex !important; } .form-grid-2 { grid-template-columns: 1fr !important; } } @media (max-width: 1024px) { .checkout-grid { grid-template-columns: 1fr !important; } }</style>`,
        }}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          main > div[style*="grid-template-columns: 1fr 420px"] {
            grid-template-columns: 1fr !important;
          }
          main > div[style*="grid-template-columns: 1fr 420px"] > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 768px) {
          main {
            padding: 64px 24px !important;
          }
          nav > div {
            padding: 0 24px !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder, textarea::placeholder {
          color: #4b5563;
        }
        *:focus-visible {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
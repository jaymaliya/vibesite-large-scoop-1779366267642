"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "large scoop pale", description: "A large scoop of pale green ice cream topped with chopped pistachios in a light green", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Six scoops yellow", description: "Six scoops of yellow ice cream with orange chunks in a shallow, matte beige ceramic bowl.", price: 30, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "small, off-white ceramic", description: "A small, off-white ceramic bowl holds multiple scoops of textured chocolate ice cream.", price: 40, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "premium product", description: "a premium product", price: 50, badge: "" }
];

const FILTERS = ["All", "Nutty", "Fruity", "Classic", "Vegan", "Dairy-Free"];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [activeFilter, setActiveFilter] = useState("All");
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  // Font injection
  useEffect(() => {
    const existing = document.querySelector("#large-scoop-fonts");
    if (!existing) {
      const link = document.createElement("link");
      link.id = "large-scoop-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Sticky nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const els = revealRefs.current.filter(Boolean) as HTMLElement[];
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null, idx: number) => {
    revealRefs.current[idx] = el;
  };

  const handleAddToCart = (e: React.MouseEvent, p: typeof products[0]) => {
    e.stopPropagation();
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.tags.includes(activeFilter));

  return (
    <div
      style={{
        backgroundColor: "var(--bg, #0a0a0a)",
        minHeight: "100vh",
        fontFamily: "'Nunito Sans', sans-serif",
        color: "var(--text, #f5f5f5)",
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.35s ease, box-shadow 0.35s ease",
          background: scrolled ? "#0a0a0aee" : "transparent",
          boxShadow: scrolled ? "0 2px 24px #0a0a0a80" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div
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
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l9-9 9 9" />
                <path d="M9 21V11h6v10" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "-0.01em",
                color: "var(--text, #f5f5f5)",
              }}
            >
              Large Scoop
            </span>
          </button>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
            }}
            className="desktop-nav"
          >
            {["Shop", "Flavors", "About", "Gifting"].map((item) => (
              <button
                key={item}
                onClick={() => router.push(`/${item.toLowerCase()}`)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: item === "Shop" ? 700 : 500,
                  color: item === "Shop" ? "var(--accent, #f59e0b)" : "var(--text, #f5f5f5)",
                  transition: "color 0.2s ease",
                  padding: "4px 0",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (item !== "Shop") (e.currentTarget.style.color = "var(--accent, #f59e0b)");
                }}
                onMouseLeave={(e) => {
                  if (item !== "Shop") (e.currentTarget.style.color = "var(--text, #f5f5f5)");
                }}
              >
                {item}
              </button>
            ))}
            {/* Search icon */}
            <button
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text, #f5f5f5)",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            {/* Cart icon */}
            <button
              aria-label="Cart"
              onClick={() => router.push("/cart")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text, #f5f5f5)",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>

          {/* Hamburger (mobile) */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text, #f5f5f5)",
              padding: "4px",
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "#0a0a0af8",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {["Shop", "Flavors", "About", "Gifting"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${item.toLowerCase()}`);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: item === "Shop" ? "var(--accent, #f59e0b)" : "var(--text, #f5f5f5)",
                  letterSpacing: "-0.01em",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Responsive CSS injected via style element alternative — using a hidden element trick */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
        }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #f59e0b;
          outline-offset: 3px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          minHeight: "600px",
          overflow: "hidden",
        }}
      >
        <img
          src="/product-1.jpg"
          alt="Large scoop of pale green pistachio ice cream in a light green ceramic bowl"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 8s ease",
          }}
        />
        {/* Gradient scrim — bottom third only */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            background:
              "linear-gradient(to top, #0a0a0a 0%, #0a0a0aaa 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Hero content in lower third */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: 0,
            right: 0,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 600,
              color: "var(--accent, #f59e0b)",
              marginBottom: "16px",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Boldly Crafted · Unapologetically Creamy · Made in India
          </p>
          <h1
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text, #f5f5f5)",
              marginBottom: "24px",
              maxWidth: "700px",
            }}
          >
            Every Flavor,
            <br />
            <span style={{ color: "var(--accent, #f59e0b)" }}>A Statement.</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
              <span style={{ fontSize: "0.875rem", color: "var(--text, #f5f5f5)", marginLeft: "4px", fontFamily: "'Nunito Sans', sans-serif" }}>
                4.9 / 5
              </span>
            </div>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontFamily: "'Nunito Sans', sans-serif" }}>
              8,400+ happy customers
            </span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontFamily: "'Nunito Sans', sans-serif" }}>
              Free shipping over ₹999
            </span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("shop-grid");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "16px 44px",
              borderRadius: "12px",
              border: "2px solid var(--accent, #f59e0b)",
              cursor: "pointer",
              background: "var(--accent, #f59e0b)",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: "1rem",
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: "0.02em",
              boxShadow: "0 10px 32px -8px #f59e0b60",
              transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 16px 40px -8px #f59e0b80";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 32px -8px #f59e0b60";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Shop Flavors
          </button>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div
        ref={(el) => addRevealRef(el, 0)}
        style={{
          background: "var(--surface, #2d5016)",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "56px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            label: "100% Natural Ingredients",
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            ),
            label: "Free Delivery above ₹999",
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            ),
            label: "8,400+ Happy Customers",
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            ),
            label: "Handcrafted in Small Batches",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text, #f5f5f5)",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* ── SHOP GRID ── */}
      <section
        id="shop-grid"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 48px",
        }}
      >
        {/* Section header */}
        <div
          ref={(el) => addRevealRef(el, 1)}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "56px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--accent, #f59e0b)",
                marginBottom: "12px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Our Collection
            </p>
            <h2
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text, #f5f5f5)",
                margin: 0,
              }}
            >
              All Flavors
            </h2>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              lineHeight: 1.7,
              maxWidth: "320px",
              fontFamily: "'Nunito Sans', sans-serif",
              margin: 0,
            }}
          >
            Crafted from the finest ingredients. Each scoop, an experience worth savoring.
          </p>
        </div>

        {/* Filter pills */}
        <div
          ref={(el) => addRevealRef(el, 2)}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "56px",
          }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  border: `1.5px solid ${active ? "var(--accent, #f59e0b)" : "#2d2d2d"}`,
                  background: active ? "var(--accent, #f59e0b)" : "transparent",
                  color: active ? "#0a0a0a" : "var(--muted, #6b7280)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  letterSpacing: "0.02em",
                  transition: "background 0.22s ease, color 0.22s ease, border-color 0.22s ease, transform 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--accent, #f59e0b)";
                    e.currentTarget.style.color = "var(--text, #f5f5f5)";
                  }
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.color = "var(--muted, #6b7280)";
                  }
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div
          ref={(el) => addRevealRef(el, 3)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {products.map((p) => {
            const isHovered = hoveredCard === p.id;
            const isAdded = !!addedMap[p.id];
            return (
              <article
                key={p.id}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  background: "var(--surface, #2d5016)",
                  overflow: "hidden",
                  boxShadow: isHovered
                    ? "0 24px 56px -12px #2d501680, 0 4px 16px -4px #0a0a0a80"
                    : "0 8px 32px -8px #0a0a0a60",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  position: "relative",
                }}
              >
                {/* Badge */}
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      zIndex: 10,
                      background: "var(--accent, #f59e0b)",
                      color: "#0a0a0a",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      fontFamily: "'Nunito Sans', sans-serif",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: "9999px",
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                {/* Image */}
                <div style={{ overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1a" }}>
                  <img
                    src={p.img}
                    alt={p.description}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>

                {/* Card body */}
                <div style={{ padding: "24px 24px 28px" }}>
                  {/* Flavor tags */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          fontFamily: "'Nunito Sans', sans-serif",
                          color: "var(--accent, #f59e0b)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          background: "#f59e0b18",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--text, #f5f5f5)",
                      letterSpacing: "-0.01em",
                      marginBottom: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      lineHeight: 1.6,
                      marginBottom: "20px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "1.375rem",
                        fontWeight: 700,
                        color: "var(--accent, #f59e0b)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>

                    {/* Add to Cart — appears on hover (always visible on mobile) */}
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        background: isAdded ? "#22c55e" : isHovered ? "var(--accent, #f59e0b)" : "#1a1a1a",
                        color: isAdded ? "#fff" : isHovered ? "#0a0a0a" : "#6b7280",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        fontFamily: "'Nunito Sans', sans-serif",
                        transition:
                          "background 0.25s ease, color 0.25s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
                        opacity: isHovered || isAdded ? 1 : 0.45,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    >
                      {isAdded ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                          Added
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state for filtered */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "#6b7280",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "1rem",
            }}
          >
            No flavors found for this category.
          </div>
        )}
      </section>

      {/* ── BOTTOM CTA BAND ── */}
      <section
        ref={(el) => addRevealRef(el, 4)}
        style={{
          background: "var(--surface, #2d5016)",
          padding: "80px 48px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontWeight: 600,
            color: "var(--accent, #f59e0b)",
            marginBottom: "16px",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Crafted with Intention
        </p>
        <h2
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text, #f5f5f5)",
            marginBottom: "16px",
            lineHeight: 1.15,
          }}
        >
          Not sure which flavor to pick?
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            lineHeight: 1.7,
            maxWidth: "440px",
            margin: "0 auto 32px",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Let us build you the perfect box. Explore our gifting sets curated for every occasion.
        </p>
        <button
          onClick={() => router.push("/gifting")}
          style={{
            padding: "16px 48px",
            borderRadius: "12px",
            border: "2px solid var(--accent, #f59e0b)",
            cursor: "pointer",
            background: "transparent",
            color: "var(--accent, #f59e0b)",
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: "0.02em",
            transition: "background 0.22s ease, color 0.22s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent, #f59e0b)";
            e.currentTarget.style.color = "#0a0a0a";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--accent, #f59e0b)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        >
          Explore Gifting
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #1f1f1f",
          padding: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--accent, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-9 9 9" />
              <path d="M9 21V11h6v10" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text, #f5f5f5)",
            }}
          >
            Large Scoop
          </span>
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#6b7280",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          © {new Date().getFullYear()} Large Scoop. Made in India with love.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Shipping"].map((l) => (
            <button
              key={l}
              onClick={() => router.push(`/${l.toLowerCase()}`)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8125rem",
                color: "#6b7280",
                fontFamily: "'Nunito Sans', sans-serif",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text, #f5f5f5)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              {l}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
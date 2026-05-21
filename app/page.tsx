"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const PRODUCTS = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "large scoop pale",
    description: "A large scoop of pale green ice cream topped with chopped pistachios in a light green ceramic bowl.",
    price: 349,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Six scoops yellow",
    description: "Six scoops of yellow ice cream with orange chunks in a shallow, matte beige ceramic bowl.",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "small, off-white ceramic",
    description: "A small, off-white ceramic bowl holds multiple scoops of textured chocolate ice cream.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "premium product",
    description: "a premium product",
    price: 50,
  },
];

const BLOG_CARDS = [
  {
    img: "/product-1.jpg",
    tag: "Ingredient Sourcing",
    title: "Why We Only Use Telangana Pistachios",
    excerpt: "The nuttiest, freshest kernels from India's heartland — here's how they make it into every batch.",
  },
  {
    img: "/product-2.jpg",
    tag: "Flavor Development",
    title: "Building the Perfect Mango Saffron Scoop",
    excerpt: "Three seasons, forty test batches, one unforgettable summer flavor.",
  },
  {
    img: "/product-3.jpg",
    tag: "Brand Values",
    title: "No Stabilisers. No Shortcuts. Here's Why.",
    excerpt: "What 'clean label' actually means at Large Scoop and the sacrifices it demands.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredBlog, setHoveredBlog] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Google Fonts inject
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  // Sticky nav transparency
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(28px)";
      (el as HTMLElement).style.transition =
        "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, img: p.img, quantity: 1 });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const goProduct = (p: typeof PRODUCTS[0]) =>
    router.push(
      `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
    );

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f5f5f5",
        fontFamily: "'Nunito Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: navSolid ? "rgba(10,10,10,0.96)" : "transparent",
          backdropFilter: navSolid ? "blur(12px)" : "none",
          borderBottom: navSolid ? "1px solid rgba(245,245,245,0.06)" : "none",
          transition: "background-color 0.4s ease, border-color 0.4s ease",
          padding: "0 32px",
          height: "68px",
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
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#f59e0b" />
            <ellipse cx="14" cy="10" rx="7" ry="7" fill="#2d5016" />
            <ellipse cx="14" cy="10" rx="5" ry="5" fill="#4a7c20" />
          </svg>
          <span
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#f5f5f5",
              letterSpacing: "-0.01em",
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
            gap: "36px",
          }}
          className="desktop-nav"
        >
          {["Shop", "Flavors", "About", "Gifting"].map((link) => (
            <button
              key={link}
              onClick={() => router.push(link === "Shop" ? "/shop" : `/${link.toLowerCase()}`)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f5f5f5",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "4px 0",
                borderBottom: "1px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
                (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "#f59e0b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
                (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "transparent";
              }}
            >
              {link}
            </button>
          ))}
          {/* Search icon */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f5f5f5",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {/* Cart icon */}
          <button
            onClick={() => router.push("/cart")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f5f5f5",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#f5f5f5",
            display: "none",
          }}
          className="hamburger"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f5f5f5",
            }}
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {["Shop", "Flavors", "About", "Gifting"].map((link) => (
            <button
              key={link}
              onClick={() => {
                setMenuOpen(false);
                router.push(link === "Shop" ? "/shop" : `/${link.toLowerCase()}`);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f5f5f5",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "2rem",
                letterSpacing: "-0.01em",
              }}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────── */}
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
          alt="Large scoop of pale green pistachio ice cream in a ceramic bowl"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.8s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
        />
        {/* Gradient scrim — lower third only */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            background:
              "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.55) 55%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Trust strip */}
        <div
          style={{
            position: "absolute",
            top: "88px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
              backgroundColor: "rgba(10,10,10,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(245,159,11,0.25)",
              borderRadius: "9999px",
              padding: "8px 28px",
              fontSize: "0.78rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "#f5f5f5",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              4.9 / 5 Rating
            </span>
            <span>18,000+ Scoops Served</span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              Made in India
            </span>
            <span>Free Shipping above ₹799</span>
          </div>
        </div>
        {/* Hero copy — lower third */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 48px 72px",
            maxWidth: "720px",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 600,
              color: "#f59e0b",
              display: "block",
              marginBottom: "16px",
            }}
          >
            Boldly crafted. Unapologetically creamy.
          </span>
          <h1
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.025em",
              color: "#f5f5f5",
              margin: "0 0 24px",
            }}
          >
            Every Scoop
            <br />
            <span style={{ color: "#f59e0b" }}>Tells a Story.</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "rgba(245,245,245,0.75)",
              maxWidth: "480px",
              marginBottom: "36px",
            }}
          >
            Hand-crafted, small-batch ice cream using the finest Indian ingredients. No stabilisers. No shortcuts. Just pure, obsessive craft.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/shop")}
              style={{
                padding: "16px 44px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#f59e0b",
                color: "#0a0a0a",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
                boxShadow: "0 12px 32px -8px #f59e0b60",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
            >
              Shop Flavors
            </button>
            <button
              onClick={() => router.push("/about")}
              style={{
                padding: "16px 36px",
                borderRadius: "12px",
                border: "1px solid rgba(245,245,245,0.25)",
                cursor: "pointer",
                background: "transparent",
                color: "#f5f5f5",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.25)";
              }}
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: FEATURED FLAVORS CAROUSEL ─────── */}
      <section
        className="reveal"
        style={{
          padding: "96px 0",
          backgroundColor: "#0a0a0a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
            marginBottom: "48px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#f59e0b",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              The Line-up
            </span>
            <h2
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#f5f5f5",
                margin: 0,
              }}
            >
              Featured Flavors
            </h2>
          </div>
          <button
            onClick={() => router.push("/shop")}
            style={{
              background: "none",
              border: "1px solid rgba(245,245,245,0.2)",
              borderRadius: "9999px",
              padding: "10px 28px",
              cursor: "pointer",
              color: "#f5f5f5",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b";
              (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
            }}
          >
            View All →
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingBottom: "16px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <article
              key={p.id}
              onClick={() => goProduct(p)}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                flex: "0 0 320px",
                scrollSnapAlign: "start",
                cursor: "pointer",
                borderRadius: "16px",
                background: "#2d5016",
                overflow: "hidden",
                transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)",
                boxShadow:
                  hoveredCard === p.id
                    ? "0 20px 48px -12px #2d501660"
                    : "0 4px 20px -8px #2d501640",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img
                  src={p.img}
                  alt={p.description}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    display: "block",
                    transform: hoveredCard === p.id ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "#f59e0b",
                    color: "#0a0a0a",
                    borderRadius: "9999px",
                    padding: "4px 14px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {i === 0 ? "Best Seller" : i === 1 ? "New" : i === 2 ? "Classic" : "Limited"}
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "#f5f5f5",
                    margin: "0 0 8px",
                    letterSpacing: "-0.01em",
                    textTransform: "capitalize",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "rgba(245,245,245,0.65)",
                    margin: "0 0 20px",
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
                      color: "#f59e0b",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    style={{
                      padding: "9px 22px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      background: addedId === p.id ? "#4a7c20" : "#f59e0b",
                      color: addedId === p.id ? "#f5f5f5" : "#0a0a0a",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      letterSpacing: "0.02em",
                      transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                    }}
                  >
                    {addedId === p.id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: OUR CRAFT & INGREDIENTS ─────── */}
      <section
        className="reveal"
        style={{
          backgroundColor: "#0d0d0d",
          padding: "96px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Left: lifestyle image */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "24px",
              boxShadow: "0 40px 80px -20px #2d501650",
              position: "relative",
            }}
          >
            <img
              src="/product-2.jpg"
              alt="Artisanal ice cream being crafted with fresh ingredients"
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(245,159,11,0.3)",
                borderRadius: "16px",
                padding: "16px 22px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "1.5rem", fontFamily: "'Raleway', sans-serif", fontWeight: 700, color: "#f59e0b" }}>100%</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(245,245,245,0.65)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Natural Ingredients</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "rgba(245,245,245,0.1)" }} />
              <div>
                <div style={{ fontSize: "1.5rem", fontFamily: "'Raleway', sans-serif", fontWeight: 700, color: "#f59e0b" }}>0</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(245,245,245,0.65)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Stabilisers</div>
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#f59e0b",
                fontWeight: 600,
              }}
            >
              Our Craft
            </span>
            <h2
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#f5f5f5",
                margin: 0,
              }}
            >
              Ingredient obsession
              <br />
              <span style={{ color: "#2d5016", WebkitTextStroke: "1px #4a7c20" }}>runs deep.</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "#6b7280",
                margin: 0,
              }}
            >
              Every flavor starts with a question: what's the finest version of this ingredient we can source in India? Telangana pistachios. Alphonso mangoes. Kodaikanal strawberries. We work directly with farmers and spend entire seasons perfecting each batch.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "#6b7280",
                margin: 0,
              }}
            >
              No stabilisers, no artificial flavors, no shortcuts. The result is ice cream that tastes like the ingredient itself — bold, honest, and deeply satisfying.
            </p>
            {/* Attributes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              {[
                { label: "Small-batch churned", desc: "Never mass-produced" },
                { label: "Farm to scoop", desc: "Direct sourcing from Indian farms" },
                { label: "Clean label", desc: "Ingredients you can pronounce" },
              ].map((attr) => (
                <div key={attr.label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#2d501640",
                      border: "1px solid #2d501680",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#f5f5f5" }}>{attr.label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{attr.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/about")}
              style={{
                alignSelf: "flex-start",
                padding: "14px 36px",
                borderRadius: "12px",
                border: "1px solid #2d5016",
                cursor: "pointer",
                background: "#2d5016",
                color: "#f5f5f5",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "0.92rem",
                boxShadow: "0 8px 24px -8px #2d501660",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              Read Our Story
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: GIFT THE EXPERIENCE ─────────── */}
      <section
        className="reveal"
        style={{
          padding: "0 48px 96px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            position: "relative",
            minHeight: "460px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Background image */}
          <img
            src="/product-3.jpg"
            alt="Curated ice cream gift packaging and bundles"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(105deg, rgba(10,10,10,0.88) 40%, rgba(10,10,10,0.3) 100%)",
            }}
          />
          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "64px",
              maxWidth: "560px",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#f59e0b",
                fontWeight: 600,
                display: "block",
                marginBottom: "16px",
              }}
            >
              Gifting
            </span>
            <h2
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#f5f5f5",
                margin: "0 0 20px",
              }}
            >
              Gift someone
              <br />a perfect scoop.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "rgba(245,245,245,0.7)",
                marginBottom: "36px",
              }}
            >
              Curated bundles, seasonal selections, and bespoke gift packs — designed to delight. Same-day delivery in Bangalore. Pan-India shipping available.
            </p>
            <button
              onClick={() => router.push("/gifting")}
              style={{
                padding: "16px 44px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#f59e0b",
                color: "#0a0a0a",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 12px 32px -8px #f59e0b60",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
            >
              Explore Gifting
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BEHIND THE SCOOP (Blog) ─────── */}
      <section
        className="reveal"
        style={{
          backgroundColor: "#0d0d0d",
          padding: "96px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "56px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <span
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#f59e0b",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Stories
              </span>
              <h2
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#f5f5f5",
                  margin: 0,
                }}
              >
                Behind the Scoop
              </h2>
            </div>
            <button
              onClick={() => router.push("/journal")}
              style={{
                background: "none",
                border: "1px solid rgba(245,245,245,0.15)",
                borderRadius: "9999px",
                padding: "10px 28px",
                cursor: "pointer",
                color: "#f5f5f5",
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b";
                (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
              }}
            >
              All Articles →
            </button>
          </div>

          {/* Blog grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {BLOG_CARDS.map((blog, i) => (
              <article
                key={i}
                onMouseEnter={() => setHoveredBlog(i)}
                onMouseLeave={() => setHoveredBlog(null)}
                onClick={() => router.push("/journal")}
                style={{
                  background: "#111111",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid rgba(245,245,245,0.05)",
                  transform: hoveredBlog === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hoveredBlog === i
                      ? "0 20px 48px -12px #0a0a0a80"
                      : "0 4px 20px -8px #0a0a0a60",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={blog.img}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      display: "block",
                      transform: hoveredBlog === i ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <div style={{ padding: "28px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      fontWeight: 700,
                      color: "#f59e0b",
                      background: "#f59e0b15",
                      border: "1px solid #f59e0b30",
                      borderRadius: "9999px",
                      padding: "3px 12px",
                      marginBottom: "14px",
                    }}
                  >
                    {blog.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      color: "#f5f5f5",
                      margin: "0 0 12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {blog.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "#6b7280",
                      margin: "0 0 20px",
                    }}
                  >
                    {blog.excerpt}
                  </p>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#f59e0b",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Read Article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#080808",
          borderTop: "1px solid rgba(245,245,245,0.06)",
          padding: "64px 48px 48px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#f59e0b" />
                <ellipse cx="14" cy="10" rx="7" ry="7" fill="#2d5016" />
                <ellipse cx="14" cy="10" rx="5" ry="5" fill="#4a7c20" />
              </svg>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#f5f5f5" }}>Large Scoop</span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6b7280", maxWidth: "280px" }}>
              Boldly crafted, unapologetically creamy. Small-batch ice cream using the finest Indian ingredients.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {["instagram", "twitter", "facebook"].map((social) => (
                <button
                  key={social}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(245,245,245,0.06)",
                    border: "1px solid rgba(245,245,245,0.1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.1)";
                  }}
                  aria-label={social}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    {social === "instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                    {social === "twitter" && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>}
                    {social === "facebook" && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { heading: "Shop", links: ["All Flavors", "Bestsellers", "New Arrivals", "Gift Packs"] },
            { heading: "Company", links: ["Our Story", "Sustainability", "Careers", "Press"] },
            { heading: "Support", links: ["FAQ", "Shipping Info", "Returns", "Contact Us"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#f5f5f5",
                  margin: "0 0 20px",
                }}
              >
                {col.heading}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map((link) => (
                  <button
                    key={link}
                    onClick={() => router.push("/shop")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      fontFamily: "'Nunito Sans', sans-serif",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                    }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: "1280px",
            margin: "48px auto 0",
            paddingTop: "32px",
            borderTop: "1px solid rgba(245,245,245,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>
            © 2024 Large Scoop. Made with love in India.
          </p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>
            Free shipping on orders above ₹799 · All prices in ₹ INR
          </p>
        </div>
      </footer>

      {/* Responsive styles via style tag alternative — using a global style element */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 3fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
          section > div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          section > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        button:focus-visible { outline: 2px solid #f59e0b; outline-offset: 3px; }
        a:focus-visible { outline: 2px solid #f59e0b; outline-offset: 3px; }
      `}</style>
    </div>
  );
}
"use client";
import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useCart } from "../../components/CartContext"

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "large scoop pale",
    description: "A large scoop of pale green ice cream topped with chopped pistachios in a light green ceramic bowl.",
    price: 549
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Six scoops yellow",
    description: "Six scoops of yellow ice cream with orange chunks in a shallow, matte beige ceramic bowl.",
    price: 30
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "small, off-white ceramic",
    description: "A small, off-white ceramic bowl holds multiple scoops of textured chocolate ice cream.",
    price: 40
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "premium product",
    description: "a premium product",
    price: 50
  }
]

const flavorProfile = [
  {
    label: "Base",
    value: "Whole Milk & Cream",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6l3 13h12l3-13H3z"/><path d="M3 6h18"/>
      </svg>
    )
  },
  {
    label: "Hero Ingredient",
    value: "Iranian Pistachios",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M12 7v10"/><path d="M3 12h18"/>
      </svg>
    )
  },
  {
    label: "Sweetener",
    value: "Unrefined Cane Sugar",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    label: "Finish",
    value: "Rosewater & Sea Salt",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    )
  },
  {
    label: "Texture",
    value: "Churned Slow & Cold",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/><path d="M12 12C12 6 6 2 6 2s0 4 6 10z"/><path d="M12 12C12 6 18 2 18 2s0 4-6 10z"/>
      </svg>
    )
  }
]

const reviews = [
  {
    name: "Priya Sharma",
    date: "March 2025",
    rating: 5,
    text: "Honestly the best pistachio ice cream I've had in India. You can actually taste the pistachios — not that artificial green flavour. The texture is incredibly smooth and creamy. Worth every rupee."
  },
  {
    name: "Arjun Menon",
    date: "February 2025",
    rating: 5,
    text: "Ordered for a dinner party and it was the highlight of the evening. Everyone asked where I got it. The ceramic bowl presentation is gorgeous — we reused it for months after."
  },
  {
    name: "Meera Iyer",
    date: "January 2025",
    rating: 5,
    text: "Large Scoop delivers fast and the ice cream arrives perfectly frozen. The pistachio flavour is deep and nutty without being overwhelming. This is now my go-to dessert for any occasion."
  },
  {
    name: "Kabir Bose",
    date: "December 2024",
    rating: 4,
    text: "Beautiful product, beautiful packaging. The ice cream itself is phenomenal. Took one star off only because I wish there was a slightly larger portion — it disappears too fast!"
  }
]

const variants = ["250ml", "500ml", "1 Litre"]

function ProductContent() {
  const searchParams = useSearchParams()
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null

  const displayImg = paramImg ?? "/product-1.jpg"
  const displayName = paramName ?? "large scoop pale"
  const rawPrice = paramPrice && paramPrice > 0 ? paramPrice : 549
  const displayPrice = rawPrice

  const router = useRouter()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState("500ml")
  const [added, setAdded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const styleEl = document.createElement("style")
    styleEl.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap');
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .btn-main:hover { transform: scale(1.02); }
      .btn-main:active { transform: scale(0.98); }
      .btn-ghost:hover { transform: scale(1.02); }
      .btn-ghost:active { transform: scale(0.98); }
      :focus-visible { outline: 2px solid #f59e0b; outline-offset: 3px; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #0a0a0a; }
    `
    document.head.appendChild(styleEl)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.12 }
    )
    revealRefs.current.forEach((el) => {
      if (el) {
        el.classList.add("reveal")
        observer.observe(el)
      }
    })

    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll)

    const razorpayScript = document.createElement("script")
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js"
    razorpayScript.async = true
    document.body.appendChild(razorpayScript)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      document.head.removeChild(styleEl)
    }
  }, [])

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  const handleAddToCart = () => {
    addItem({
      id: `product-${displayImg}`,
      name: displayName,
      price: displayPrice,
      quantity
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    addItem({
      id: `product-${displayImg}`,
      name: displayName,
      price: displayPrice,
      quantity
    })
    router.push("/checkout")
  }

  const handleRazorpay = async () => {
    const totalAmount = displayPrice * quantity * 100
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" })
      })
      const data = await res.json()
      const options = {
        key: "rzp_test_",
        amount: totalAmount,
        currency: "INR",
        name: "Large Scoop",
        description: displayName,
        order_id: data.id,
        handler: function () {
          router.push("/checkout")
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#f59e0b" }
      }
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch {
      console.error("Razorpay error")
    }
  }

  const relatedProducts = products.filter((p) => p.img !== displayImg).slice(0, 3)

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif", color: "var(--text)" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: isScrolled ? "rgba(10,10,10,0.97)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(245,245,245,0.06)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "1.375rem", color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            Large<span style={{ color: "var(--accent)" }}>Scoop</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            {["Shop", "Flavors", "About", "Gifting"].map((link) => (
              <button
                key={link}
                onClick={() => router.push(`/${link.toLowerCase()}`)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => router.push("/cart")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center" }}
              aria-label="Cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* PRODUCT HERO */}
      <section style={{ paddingTop: "96px", paddingBottom: "0", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 96px", display: "grid", gridTemplateColumns: "55% 45%", gap: "64px", alignItems: "flex-start" }}>

          {/* LEFT: IMAGE */}
          <div>
            <div style={{ overflow: "hidden", borderRadius: "24px", background: "var(--surface)", boxShadow: "0 40px 80px -20px rgba(10,10,10,0.6)" }}>
              <img
                src={displayImg}
                alt={displayName}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              {[displayImg, "/product-2.jpg", "/product-3.jpg"].map((thumb, i) => (
                <div key={i} style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", border: i === 0 ? "2px solid var(--accent)" : "2px solid transparent", cursor: "pointer", transition: "border-color 0.2s" }}>
                  <img src={thumb} alt={`Thumbnail ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "16px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>
                Craft Ice Cream · Made in India
              </span>
              <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--text)", margin: "12px 0 0", textTransform: "capitalize" }}>
                {displayName}
              </h1>
            </div>

            {/* TRUST ROW */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "0.8125rem", color: "var(--muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                4.9 / 5 (1,240+ reviews)
              </span>
              <span>Free shipping over ₹999</span>
              <span style={{ color: "#4ade80" }}>In Stock</span>
            </div>

            {/* PRICE */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--accent)" }}>
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "line-through" }}>
                ₹{Math.round(displayPrice * 1.2).toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.75rem", background: "rgba(245,158,11,0.15)", color: "var(--accent)", padding: "2px 10px", borderRadius: "9999px", fontWeight: 600 }}>
                17% OFF
              </span>
            </div>

            {/* DESCRIPTION */}
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "420px", margin: 0 }}>
              {displayName === "large scoop pale"
                ? "Pale green and dreamy — our pistachio scoop is built on a slow-churned whole milk base, swirled with hand-ground Iranian pistachios, and finished with a whisper of rosewater. The chopped pistachio crown adds crunch to every spoonful."
                : products.find(p => p.name === displayName)?.description ?? "A premium, craft ice cream made with the finest ingredients."}
            </p>

            {/* SIZE VARIANTS */}
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "10px" }}>Size</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: "8px 20px", borderRadius: "9999px", border: selectedVariant === v ? "2px solid var(--accent)" : "2px solid rgba(245,245,245,0.15)", background: selectedVariant === v ? "rgba(245,158,11,0.1)" : "transparent", color: selectedVariant === v ? "var(--accent)" : "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "10px" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", background: "rgba(245,245,245,0.05)", borderRadius: "12px", width: "fit-content", border: "1px solid rgba(245,245,245,0.1)" }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px 0 0 12px" }}
                  aria-label="Decrease quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span style={{ minWidth: "40px", textAlign: "center", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 12px 12px 0" }}
                  aria-label="Increase quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                className="btn-main"
                onClick={handleAddToCart}
                style={{
                  padding: "16px 32px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--accent)", color: "#0a0a0a", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.01em", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s", boxShadow: "0 10px 30px -10px rgba(245,158,11,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Add to Cart — ₹{(displayPrice * quantity).toLocaleString("en-IN")}
                  </>
                )}
              </button>
              <button
                className="btn-ghost"
                onClick={handleBuyNow}
                style={{ padding: "16px 32px", borderRadius: "12px", border: "2px solid rgba(245,245,245,0.2)", cursor: "pointer", background: "transparent", color: "var(--text)", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "1rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,245,245,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,245,245,0.2)")}
              >
                Buy Now
              </button>
              <button
                className="btn-ghost"
                onClick={handleRazorpay}
                style={{ padding: "14px 32px", borderRadius: "12px", border: "2px solid rgba(245,158,11,0.3)", cursor: "pointer", background: "rgba(245,158,11,0.05)", color: "var(--accent)", fontFamily: "'Raleway', sans-serif", fontWeight: 600, fontSize: "0.9375rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pay via Razorpay
              </button>
            </div>

            {/* DELIVERY INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px", background: "rgba(45,80,22,0.2)", borderRadius: "12px", border: "1px solid rgba(45,80,22,0.4)" }}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free insulated delivery on orders over ₹999" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Ships frozen in our eco-insulated packaging" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>, text: "7-day return policy if quality unsatisfied" }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "var(--muted)" }}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLAVOR PROFILE — SIGNATURE ELEMENT */}
      <section
        ref={addRef}
        style={{ background: "var(--surface)", padding: "80px 32px" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>
              What's Inside
            </span>
            <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: "12px 0 0" }}>
              The Flavor Profile
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {flavorProfile.map((item, i) => (
              <div
                key={i}
                style={{ background: "rgba(10,10,10,0.4)", borderRadius: "16px", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", border: "1px solid rgba(245,245,245,0.06)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s", cursor: "default" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(10,10,10,0.6)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                }}
              >
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.svg}
                </div>
                <div>
                  <p style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 600, margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT & INGREDIENTS */}
      <section
        ref={addRef}
        style={{ padding: "96px 32px", background: "var(--bg)" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "60% 40%", gap: "64px", alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: "24px", boxShadow: "0 32px 64px -16px rgba(10,10,10,0.7)" }}>
            <img
              src="/product-1.jpg"
              alt="Craft pistachio ice cream made with premium Iranian pistachios"
              style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>Our Craft</span>
            <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(1.75rem, 2.5vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.1, margin: 0 }}>
              Obsessed with the ingredient. Relentless about the scoop.
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", margin: 0 }}>
              Every batch begins with whole cream sourced from single-origin Indian dairies. We source Iranian pistachios directly — no substitutes, no shortcuts. Slow-churned at just below freezing, the result is a scoop that holds its shape, honours its ingredients, and disappears far too quickly.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", margin: 0 }}>
              No artificial colours. No preservatives. Just craft, cold, and commitment.
            </p>
            <button
              className="btn-main"
              onClick={() => router.push("/about")}
              style={{ alignSelf: "flex-start", padding: "14px 28px", borderRadius: "12px", border: "2px solid rgba(245,245,245,0.2)", cursor: "pointer", background: "transparent", color: "var(--text)", fontFamily: "'Raleway', sans-serif", fontWeight: 600, fontSize: "0.9375rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)"
                e.currentTarget.style.color = "var(--accent)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(245,245,245,0.2)"
                e.currentTarget.style.color = "var(--text)"
              }}
            >
              Our Story →
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section
        ref={addRef}
        style={{ padding: "96px 32px", background: "rgba(45,80,22,0.08)" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>
              Customer Reviews
            </span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
              <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: 0 }}>
                What people are saying
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>4.9</span>
                <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>from 1,240+ reviews</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {reviews.map((review, i) => (
              <div
                key={i}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,245,245,0.07)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(10,10,10,0.5)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                }}
              >
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: review.rating }).map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text)", margin: 0, fontStyle: "italic" }}>"{review.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>{review.name}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section
        ref={addRef}
        style={{ padding: "96px 32px", background: "var(--bg)" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>
              You Might Also Love
            </span>
            <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: "10px 0 0" }}>
              More from the Scoop
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {relatedProducts.map((p) => (
              <article
                key={p.id}
                style={{ cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)"
                }}
              >
                <div style={{ overflow: "hidden", borderRadius: "16px", background: "var(--surface)", marginBottom: "16px" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <h3 style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 600, fontSize: "1.125rem", color: "var(--text)", margin: "0 0 6px", textTransform: "capitalize" }}>{p.name}</h3>
                <p style={{ margin: "0 0 8px", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5 }}>{p.description.slice(0, 60)}…</p>
                <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, fontSize: "1rem" }}>₹{(p.price > 0 ? p.price : 549).toLocaleString("en-IN")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer style={{ background: "#050505", borderTop: "1px solid rgba(245,245,245,0.06)", padding: "48px 32px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", margin: "0 0 8px" }}>
          Large<span style={{ color: "var(--accent)" }}>Scoop</span>
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)", margin: "0 0 16px" }}>Boldly crafted, unapologetically creamy. Made in India.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          {["Shop", "About", "Gifting", "Contact", "Privacy"].map(link => (
            <button key={link} onClick={() => router.push(`/${link.toLowerCase()}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.875rem", fontFamily: "'Nunito Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
              {link}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(107,114,128,0.5)", marginTop: "32px" }}>© 2025 Large Scoop. All rights reserved.</p>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(10,10,10,0.97)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(245,245,245,0.08)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)"
      }}
        className="md:hidden"
      >
        <div>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>Total</p>
          <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)", fontFamily: "'Raleway', sans-serif" }}>₹{(displayPrice * quantity).toLocaleString("en-IN")}</p>
        </div>
        <button
          className="btn-main"
          onClick={handleAddToCart}
          style={{ flex: 1, maxWidth: "220px", padding: "14px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--accent)", color: "#0a0a0a", fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "0.9375rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 8px 24px -8px rgba(245,158,11,0.5)" }}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  )
}
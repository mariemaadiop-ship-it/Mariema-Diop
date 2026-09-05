import { useState, useEffect, FormEvent } from "react";
import profilePhoto from "./assets/images/mariema-profile.jpg";
import protectaImg from "./assets/images/protecta.jpg";
import remaflowImg from "./assets/images/remaflow.jpg";
import jojDakarImg from "./assets/images/joj-dakar.jpg";
import jigeenBusinessImg from "./assets/images/jigeen-business.jpg";

/* ─── Icons (inline SVG helpers) ─── */
function Icon({ path, size = 20, className = "" }: { path: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M18 6L6 18M6 6l12 12",
  arrow: "M5 12h14M12 5l7 7-7 7",
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2 2 2zm0 0l8 8 8-8",
  map: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z",
  linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
  external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  figma: "M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 01-7 0zM5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z",
  pen: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  cpu: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check: "M20 6L9 17l-5-5",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
};

/* ─── Reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Active section hook ─── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("accueil");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.25 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ═══════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════ */
function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    { id: "accueil", label: "Accueil" },
    { id: "apropos", label: "À propos" },
    { id: "competences", label: "Compétences" },
    { id: "services", label: "Services" },
    { id: "projets", label: "Projets" },
    { id: "parcours", label: "Parcours" },
    { id: "contact", label: "Contact" },
  ];

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <header
      role="banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: scrolled || menuOpen ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(14px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid rgba(205,180,219,0.3)" : "1px solid transparent",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: scrolled ? "0 4px 20px rgba(91,58,140,0.06)" : "none",
      }}
    >
      <div className="section-container" style={{ padding: "0 clamp(16px, 3vw, 32px)" }}>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "clamp(60px, 8vh, 72px)",
          }}
          aria-label="Navigation principale"
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("accueil")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
            }}
            aria-label="Mariema Diop — Retour à l'accueil"
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--color-violet)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "white", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem" }}>
                MD
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "var(--color-violet)",
                letterSpacing: "-0.01em",
              }}
            >
              Mariema Diop
            </span>
          </button>

          {/* Desktop links */}
          <div className="nav-desktop">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`nav-link ${active === l.id ? "active" : ""}`}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="btn-primary"
              style={{ padding: "9px 20px", minHeight: 40, fontSize: "0.85rem" }}
            >
              Me contacter
            </button>
          </div>

          {/* Mobile / Tablet Hamburger */}
          <button
            className={`hamburger nav-hamburger-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      {/* Mobile menu drawer */}
      <div
        style={{
          maxHeight: menuOpen ? "85vh" : 0,
          opacity: menuOpen ? 1 : 0,
          overflowY: "auto",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(16px)",
          borderTop: menuOpen ? "1px solid rgba(205,180,219,0.25)" : "none",
        }}
      >
        <div
          className="section-container"
          style={{
            padding: "16px clamp(16px, 4vw, 32px) 24px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: active === l.id ? "rgba(91,58,140,0.08)" : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                padding: "12px 16px",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.98rem",
                color: active === l.id ? "var(--color-violet)" : "var(--color-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <span>{l.label}</span>
              {active === l.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-violet)" }} />}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="btn-primary"
            style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
          >
            Me contacter
          </button>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════ */
function Hero() {
  return (
    <section
      id="accueil"
      aria-label="Accueil"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(135deg, #fdf6ff 0%, var(--color-blush) 40%, #f3eafe 100%)",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(80px, 12vh, 110px)",
        paddingBottom: "clamp(48px, 8vh, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient blobs (clamped & non-overflowing) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "min(500px, 80vw)",
          height: "min(500px, 80vw)",
          background: "radial-gradient(circle, rgba(205,180,219,0.35) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "min(400px, 70vw)",
          height: "min(400px, 70vw)",
          background: "radial-gradient(circle, rgba(91,58,140,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ padding: "0 clamp(16px, 4vw, 32px)", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Text Content */}
          <div style={{ maxWidth: 580 }}>
            <span className="section-label animate-fade-up" style={{ marginBottom: 10, display: "block" }}>
              Bonjour, je suis
            </span>
            <h1
              className="animate-fade-up animate-delay-100"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.3rem, 5.5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              Mariema<br />
              <span style={{ color: "var(--color-violet)" }}>Diop</span>
            </h1>
            <p
              className="animate-fade-up animate-delay-200"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                color: "var(--color-violet)",
                marginBottom: 16,
              }}
            >
              Référente Digitale | Designer Graphique &amp; UX/UI
            </p>
            <p
              className="animate-fade-up animate-delay-300"
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                lineHeight: 1.7,
                color: "var(--color-ink-muted)",
                marginBottom: 32,
              }}
            >
              Passionnée par la créativité et l'innovation numérique, je conçois des expériences visuelles et des interfaces qui transforment les idées en solutions concrètes.
            </p>
            <div
              className="animate-fade-up animate-delay-400"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <button
                onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary"
              >
                Découvrir mes projets <Icon path={ICONS.arrow} size={18} />
              </button>
              <a href="#cv-mariema" className="btn-outline" aria-label="Télécharger mon CV">
                <Icon path={ICONS.download} size={18} /> Télécharger mon CV
              </a>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline"
              >
                Me contacter
              </button>
            </div>
          </div>

          {/* Photo Column */}
          <div
            className="animate-fade-in animate-delay-300"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "min(100%, 320px)",
                aspectRatio: "4/5",
                maxWidth: 320,
              }}
            >
              {/* Decorative responsive rings */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-10px",
                  borderRadius: "60% 40% 60% 40%",
                  border: "2px solid rgba(205,180,219,0.5)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-20px",
                  borderRadius: "40% 60% 40% 60%",
                  border: "2px dashed rgba(91,58,140,0.2)",
                  pointerEvents: "none",
                }}
              />

              {/* Photo Frame */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "60% 40% 60% 40%",
                  overflow: "hidden",
                  boxShadow: "0 20px 48px rgba(91,58,140,0.18)",
                  background: "linear-gradient(145deg, #f8eff8 0%, #ecdcf0 50%, #cdb4db 100%)",
                  position: "relative",
                }}
              >
                <img
                  src={profilePhoto}
                  alt="Mariema Diop — Référente Digitale et Designer UX/UI"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = "none";
                    (t.nextElementSibling as HTMLElement)?.removeAttribute("hidden");
                  }}
                />
                <div className="profile-placeholder" hidden>
                  <Icon path={ICONS.user} size={56} />
                  <span style={{ fontSize: "0.8rem", textAlign: "center", maxWidth: 140 }}>
                    Mariema Diop
                  </span>
                </div>
              </div>

              {/* Floating Badge */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: -8,
                  right: -8,
                  background: "var(--color-violet)",
                  color: "white",
                  borderRadius: 12,
                  padding: "8px 14px",
                  boxShadow: "0 6px 20px rgba(91,58,140,0.28)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(0.72rem, 1.6vw, 0.8rem)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>✦</span> Design &amp; UX/UI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   À PROPOS
═══════════════════════════════════════ */
function About() {
  return (
    <section id="apropos" aria-label="À propos" className="section-wrapper" style={{ background: "white" }}>
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Visual Identity Card */}
          <div className="reveal" style={{ width: "100%" }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background: "linear-gradient(135deg, var(--color-blush), #ede0f8)",
                padding: "clamp(24px, 4vw, 40px)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                border: "1px solid rgba(205,180,219,0.3)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: "var(--color-violet)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    color: "white",
                    boxShadow: "0 8px 20px rgba(91,58,140,0.25)",
                  }}
                >
                  <Icon path={ICONS.pen} size={32} />
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--color-violet)" }}>
                  Mariema Diop
                </p>
                <p style={{ color: "var(--color-ink-muted)", fontSize: "0.88rem", marginTop: 2 }}>
                  Référente Digitale
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                {["Design Graphique", "UX/UI Design", "Prototypage", "Figma"].map((tag) => (
                  <div key={tag} className="skill-badge" style={{ justifyContent: "center", padding: "8px 12px" }}>
                    {tag}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(91,58,140,0.1)",
                  color: "var(--color-ink-muted)",
                  fontSize: "0.85rem",
                }}
              >
                <Icon path={ICONS.map} size={16} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>Dakar, Sénégal</span>
              </div>
            </div>
          </div>

          {/* Text Details */}
          <div>
            <span className="section-label reveal">À propos</span>
            <span className="accent-line reveal reveal-delay-1" />
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
                fontWeight: 700,
                color: "var(--color-ink)",
                lineHeight: 1.25,
                marginBottom: 20,
              }}
            >
              À propos de moi
            </h2>
            <div
              className="reveal reveal-delay-2"
              style={{
                color: "var(--color-ink-muted)",
                lineHeight: 1.8,
                fontSize: "clamp(0.92rem, 1.6vw, 0.98rem)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <p>
                Mon parcours est marqué par une volonté constante d'apprendre, d'évoluer et de donner une nouvelle dimension à mes compétences.
              </p>
              <p>
                Après une première expérience dans un parcours orienté vers l'éducation, j'ai choisi de me tourner vers le numérique afin d'explorer un univers qui correspond davantage à ma créativité et à mon envie d'innover.
              </p>
              <p>
                Aujourd'hui, grâce à ma formation dans le domaine du digital, j'ai développé des compétences en design graphique, UX/UI Design, prototypage et conception de solutions numériques.
              </p>
              <p>
                J'aime particulièrement transformer une idée en une expérience visuelle cohérente, accessible et impactante. Chaque projet représente pour moi une opportunité d'apprendre, de créer et de proposer des solutions adaptées aux besoins des utilisateurs.
              </p>
            </div>
            <div
              className="reveal reveal-delay-3"
              style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 10 }}
            >
              {["Design Graphique", "UX/UI Design", "Projets digitaux", "Formation continue"].map((tag) => (
                <span key={tag} className="skill-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   COMPÉTENCES
═══════════════════════════════════════ */
function Skills() {
  const categories = [
    {
      title: "Design & Création",
      icon: ICONS.pen,
      skills: ["Design Graphique", "Identité visuelle", "Supports de communication", "Photoshop", "Illustrator"],
    },
    {
      title: "UX/UI Design",
      icon: ICONS.layers,
      skills: ["Recherche UX", "Wireframing", "User Flow", "Design d'interfaces", "Prototypage"],
    },
    {
      title: "Outils",
      icon: ICONS.cpu,
      skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva", "CapCut"],
    },
    {
      title: "Gestion de projet",
      icon: ICONS.star,
      skills: ["Organisation de projet", "Design Thinking", "Business Model Canvas", "User Stories", "Méthodes Agile"],
    },
  ];

  return (
    <section
      id="competences"
      aria-label="Compétences"
      className="section-wrapper"
      style={{ background: "linear-gradient(180deg, #fdf8ff 0%, #f8f0ff 100%)" }}
    >
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 6vw, 56px)" }}>
          <span className="section-label reveal">Mes compétences</span>
          <span className="accent-line reveal reveal-delay-1" style={{ margin: "10px auto 0" }} />
          <h2
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginTop: 8,
            }}
          >
            Ce que je sais faire
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "clamp(16px, 3vw, 24px)",
          }}
        >
          {categories.map((cat, i) => (
            <article
              key={cat.title}
              className={`card reveal reveal-delay-${i + 1}`}
              style={{ padding: "clamp(20px, 3vw, 28px)", display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, var(--color-violet), var(--color-lavender))",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: "0 6px 16px rgba(91,58,140,0.18)",
                }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={cat.icon} />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "var(--color-ink)",
                  marginBottom: 14,
                }}
              >
                {cat.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                {cat.skills.map((s) => (
                  <li key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-violet)", flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)", lineHeight: 1.4 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SERVICES
═══════════════════════════════════════ */
function Services() {
  const services = [
    {
      num: "01",
      title: "Design Graphique",
      description: "Création de supports visuels modernes et professionnels pour donner une identité forte aux projets et améliorer leur communication.",
      icon: ICONS.pen,
    },
    {
      num: "02",
      title: "UX/UI Design",
      description: "Conception d'expériences utilisateur et d'interfaces intuitives, esthétiques et adaptées aux besoins des utilisateurs.",
      icon: ICONS.layers,
    },
    {
      num: "03",
      title: "Prototypage",
      description: "Transformation des idées en maquettes interactives afin de visualiser et tester l'expérience utilisateur avant le développement.",
      icon: ICONS.figma,
    },
    {
      num: "04",
      title: "Conception de projets digitaux",
      description: "Accompagnement dans la structuration d'une idée, depuis la réflexion jusqu'à la création d'une solution digitale cohérente.",
      icon: ICONS.cpu,
    },
  ];

  return (
    <section id="services" aria-label="Services" className="section-wrapper" style={{ background: "white" }}>
      <div className="section-container">
        <div style={{ marginBottom: "clamp(36px, 6vw, 56px)" }}>
          <span className="section-label reveal">Services</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Comment puis-je vous accompagner ?
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "clamp(16px, 3vw, 24px)",
          }}
        >
          {services.map((s, i) => (
            <article
              key={s.title}
              className={`card reveal reveal-delay-${i + 1}`}
              style={{
                padding: "clamp(24px, 3vw, 32px)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "2.2rem",
                  color: "rgba(91,58,140,0.06)",
                  userSelect: "none",
                }}
              >
                {s.num}
              </span>
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: "var(--color-blush)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  color: "var(--color-violet)",
                }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={s.icon} />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "var(--color-ink)",
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.65,
                  fontSize: "0.88rem",
                  marginTop: "auto",
                }}
              >
                {s.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   PROJETS
═══════════════════════════════════════ */
function Projects() {
  const projects = [
    {
      id: "protecta",
      name: "PROTECTA",
      category: "UX/UI Design",
      categoryFull: "UX/UI Design · Intelligence Artificielle",
      description: "Solution digitale sénégalaise de prévention, d'alerte et d'assistance destinée aux femmes, aux jeunes filles et aux enfants. Combine application mobile, dispositifs connectés discrets et IA pour faciliter l'envoi d'alertes.",
      role: ["Recherche UX", "UX/UI Design", "Maquettes Figma", "Prototypage"],
      tools: ["Figma", "Design Thinking", "UX/UI"],
      img: protectaImg,
      color: "#5B3A8C",
    },
    {
      id: "remaflow",
      name: "REMAFLOW",
      category: "Branding",
      categoryFull: "E-commerce · Branding · UI Design",
      description: "Projet de marque e-commerce dédié à la vente de chaussures, vêtements et accessoires. Identité visuelle moderne et expérience digitale élégante.",
      role: ["Identité visuelle", "Design d'interface", "Maquettes", "Prototypage"],
      tools: ["Figma", "Branding", "UI Design"],
      img: remaflowImg,
      color: "#7B5AB0",
    },
    {
      id: "joj",
      name: "JOJ DAKAR 2026",
      category: "UX/UI Design",
      categoryFull: "UX/UI Design · Événementiel",
      description: "Expérience digitale autour des Jeux Olympiques de la Jeunesse Dakar 2026. Parcours utilisateurs, wireframes et maquettes pour faciliter l'accès aux informations de l'événement.",
      role: ["Landing Page", "Inscription", "Calendrier", "Profil utilisateur", "Galerie"],
      tools: ["Figma", "UX/UI Design", "Wireframing"],
      img: jojDakarImg,
      color: "#9B6BC0",
    },
    {
      id: "jigeen",
      name: "JIGEEN BUSINESS",
      category: "Innovation",
      categoryFull: "Innovation · Entrepreneuriat · Plateforme",
      description: "Plateforme d'accompagnement des femmes entrepreneures pour valoriser leurs produits, renforcer leur visibilité et créer de nouvelles opportunités.",
      role: ["Concept", "Structuration", "Expérience utilisateur", "Conception d'interfaces"],
      tools: ["Figma", "UX/UI", "Business Model"],
      img: jigeenBusinessImg,
      color: "#5B3A8C",
    },
  ];

  const [filter, setFilter] = useState("Tous");
  const categoriesList = ["Tous", "UX/UI Design", "Branding", "Innovation"];

  const filteredProjects =
    filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section
      id="projets"
      aria-label="Projets"
      className="section-wrapper"
      style={{ background: "linear-gradient(180deg, #fdf8ff 0%, #f3eafe 100%)" }}
    >
      <div className="section-container">
        <div style={{ marginBottom: "clamp(28px, 5vw, 44px)" }}>
          <span className="section-label reveal">Portfolio</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Mes projets récents
          </h2>
        </div>

        {/* Filter bar (responsive scroll/wrap) */}
        <div className="reveal filters-scroll">
          {categoriesList.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "8px 18px",
                borderRadius: 50,
                border: "2px solid",
                borderColor: filter === c ? "var(--color-violet)" : "rgba(91,58,140,0.18)",
                background: filter === c ? "var(--color-violet)" : "white",
                color: filter === c ? "white" : "var(--color-ink-muted)",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minHeight: 38,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(20px, 3.5vw, 32px)",
          }}
        >
          {filteredProjects.map((p, i) => (
            <article
              key={p.id}
              className={`card reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image banner */}
              <div
                style={{
                  height: "clamp(180px, 25vw, 220px)",
                  background: `linear-gradient(135deg, ${p.color}22, var(--color-blush))`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={p.img}
                  alt={`Aperçu du projet ${p.name}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: 50,
                    padding: "4px 12px",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    color: p.color,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {p.category}
                </div>
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "clamp(20px, 3vw, 28px)",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "var(--color-ink)",
                    marginBottom: 8,
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  {p.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 20,
                    marginTop: "auto",
                  }}
                >
                  {p.tools.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: "rgba(91,58,140,0.08)",
                        color: "var(--color-violet)",
                        borderRadius: 6,
                        padding: "3px 9px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="btn-primary"
                  style={{
                    fontSize: "0.85rem",
                    padding: "10px 18px",
                    minHeight: 40,
                    alignSelf: "flex-start",
                  }}
                >
                  Voir les détails <Icon path={ICONS.external} size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   PARCOURS
═══════════════════════════════════════ */
function Timeline() {
  const items = [
    {
      org: "Orange Digital Center",
      title: "Formation Digital & Design",
      type: "Formation professionnelle",
      description: "Développement de compétences dans plusieurs domaines du numérique : Design Graphique, UX/UI Design, Figma, Photoshop, Illustrator, Gestion de projet, Innovation digitale et Conception de projets.",
      quote: "Cette expérience m'a permis de découvrir de nouveaux outils, de développer ma créativité et de renforcer ma capacité à transformer une idée en projet concret.",
      tags: ["Design Graphique", "UX/UI", "Figma", "Photoshop", "Illustrator"],
      color: "#FF6200",
    },
    {
      org: "Université Virtuelle du Sénégal",
      title: "Parcours académique & apprentissage",
      type: "Enseignement supérieur",
      description: "Mon parcours académique m'a permis de développer une grande rigueur, une méthodologie d'apprentissage autonome et une ouverture vers les métiers du digital.",
      quote: null,
      tags: ["Formation continue", "Méthodologie", "Autonomie"],
      color: "var(--color-violet)",
    },
  ];

  return (
    <section id="parcours" aria-label="Parcours" className="section-wrapper" style={{ background: "white" }}>
      <div className="section-container" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: "clamp(36px, 6vw, 56px)" }}>
          <span className="section-label reveal">Expériences</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Mon parcours
          </h2>
        </div>

        <div style={{ position: "relative", paddingLeft: "clamp(28px, 5vw, 54px)" }}>
          <div className="timeline-line" aria-hidden="true" />
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 4vw, 36px)" }}>
            {items.map((item, i) => (
              <div key={item.org} className={`reveal reveal-delay-${i + 1}`} style={{ position: "relative" }}>
                <div className="timeline-dot" aria-hidden="true" style={{ background: item.color }} />
                <article className="card" style={{ padding: "clamp(20px, 3.5vw, 32px)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span
                      style={{
                        background: "rgba(91,58,140,0.08)",
                        color: "var(--color-violet)",
                        borderRadius: 6,
                        padding: "3px 9px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                      color: "var(--color-ink)",
                      marginBottom: 2,
                    }}
                  >
                    {item.org}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      color: "var(--color-violet)",
                      fontSize: "0.92rem",
                      marginBottom: 12,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      color: "var(--color-ink-muted)",
                      lineHeight: 1.7,
                      fontSize: "0.9rem",
                      marginBottom: 14,
                    }}
                  >
                    {item.description}
                  </p>
                  {item.quote && (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--color-lavender)",
                        paddingLeft: 14,
                        margin: "14px 0",
                        color: "var(--color-ink-muted)",
                        fontStyle: "italic",
                        fontSize: "0.88rem",
                        lineHeight: 1.65,
                      }}
                    >
                      « {item.quote} »
                    </blockquote>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {item.tags.map((t) => (
                      <span key={t} className="skill-badge" style={{ fontSize: "0.76rem", padding: "4px 10px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   TÉMOIGNAGES
═══════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      id="temoignages"
      aria-label="Témoignages"
      className="section-wrapper"
      style={{ background: "linear-gradient(180deg, #fdf8ff 0%, var(--color-blush) 100%)" }}
    >
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span className="section-label reveal">Témoignages</span>
          <span className="accent-line reveal reveal-delay-1" style={{ margin: "10px auto 0" }} />
          <h2
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginTop: 8,
            }}
          >
            Ce qu'on dit de moi
          </h2>
          <p
            className="reveal reveal-delay-3"
            style={{ color: "var(--color-ink-muted)", marginTop: 8, fontSize: "0.92rem" }}
          >
            Retours et appréciations professionnelles
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(16px, 3vw, 24px)",
          }}
        >
          {[
            {
              text: "Mariema a fait preuve d'une grande rigueur et d'une sensibilité graphique remarquable sur nos maquettes Figma.",
              author: "Équipe Projet",
              role: "Orange Digital Center",
            },
            {
              text: "Excellente force de proposition en UX/UI, avec un sens aigu du détail et des interfaces centrées sur l'utilisateur.",
              author: "Collaborateur",
              role: "Projet Protecta",
            },
            {
              text: "Créative, autonome et toujours motivée pour acquérir de nouvelles compétences technologiques et méthodologiques.",
              author: "Mentor Design",
              role: "Dakar, Sénégal",
            },
          ].map((t, i) => (
            <article
              key={i}
              className={`card reveal reveal-delay-${i + 1}`}
              style={{
                padding: "clamp(20px, 3vw, 28px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <svg key={starIndex} width={15} height={15} viewBox="0 0 24 24" fill="#CDB4DB" aria-hidden="true">
                    <path d={ICONS.star} />
                  </svg>
                ))}
              </div>
              <p
                style={{
                  color: "var(--color-ink-muted)",
                  fontStyle: "italic",
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                  marginBottom: 18,
                  flex: 1,
                }}
              >
                « {t.text} »
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-lavender), var(--color-blush))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-violet)",
                    flexShrink: 0,
                  }}
                >
                  <Icon path={ICONS.user} size={18} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "var(--color-ink)" }}>
                    {t.author}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--color-ink-muted)" }}>{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   CONTACT
═══════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handle(e: FormEvent) {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) return;
    setSubmitted(true);
  }

  return (
    <section id="contact" aria-label="Contact" className="section-wrapper" style={{ background: "white" }}>
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* Left info */}
          <div>
            <span className="section-label reveal">Contact</span>
            <span className="accent-line reveal reveal-delay-1" />
            <h2
              className="reveal reveal-delay-2"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              Travaillons ensemble
            </h2>
            <p
              className="reveal reveal-delay-3"
              style={{
                color: "var(--color-ink-muted)",
                lineHeight: 1.75,
                fontSize: "clamp(0.92rem, 1.6vw, 0.98rem)",
                marginBottom: 32,
              }}
            >
              Vous avez une idée, un projet de design ou souhaitez simplement échanger autour de la tech et de l'innovation ? N'hésitez pas à me laisser un message.
            </p>

            <div className="reveal reveal-delay-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "var(--color-blush)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-violet)",
                    flexShrink: 0,
                  }}
                >
                  <Icon path={ICONS.map} size={20} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "var(--color-ink)" }}>
                    Localisation
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)" }}>Dakar, Sénégal</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "var(--color-blush)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-violet)",
                    flexShrink: 0,
                  }}
                >
                  <Icon path={ICONS.mail} size={20} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "var(--color-ink)" }}>
                    Email
                  </p>
                  <a
                    href="mailto:mariemadiop.pro@gmail.com"
                    style={{ fontSize: "0.85rem", color: "var(--color-violet)", textDecoration: "none" }}
                  >
                    mariemadiop.pro@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="reveal reveal-delay-4" style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {[
                { label: "LinkedIn", icon: ICONS.linkedin, href: "https://linkedin.com" },
                { label: "GitHub", icon: ICONS.github, href: "https://github.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "var(--color-violet)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "var(--transition-smooth)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-violet-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-violet)")}
                >
                  <Icon path={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="reveal reveal-delay-2" style={{ width: "100%" }}>
            <div className="card" style={{ padding: "clamp(20px, 4vw, 36px)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "var(--color-blush)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      color: "var(--color-violet)",
                    }}
                  >
                    <Icon path={ICONS.check} size={26} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      marginBottom: 8,
                    }}
                  >
                    Message envoyé !
                  </h3>
                  <p style={{ color: "var(--color-ink-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                    Merci pour votre prise de contact. Je vous répondrai dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ nom: "", email: "", sujet: "", message: "" });
                    }}
                    className="btn-outline"
                    style={{ marginTop: 20 }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handle} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label htmlFor="nom" className="form-label">
                        Nom *
                      </label>
                      <input
                        id="nom"
                        type="text"
                        className="form-input"
                        placeholder="Votre nom"
                        required
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="votre@email.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sujet" className="form-label">
                      Sujet *
                    </label>
                    <input
                      id="sujet"
                      type="text"
                      className="form-input"
                      placeholder="De quoi s'agit-il ?"
                      required
                      value={form.sujet}
                      onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      className="form-input"
                      placeholder="Votre message..."
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: "vertical", minHeight: 110 }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ justifyContent: "center", width: "100%" }}>
                    Envoyer le message <Icon path={ICONS.arrow} size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer role="contentinfo" style={{ background: "var(--color-ink)", color: "white", padding: "clamp(48px, 8vw, 64px) clamp(16px, 4vw, 32px) 28px" }}>
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "clamp(32px, 5vw, 48px)",
            marginBottom: 40,
          }}
        >
          {/* Identity */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--color-violet)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem" }}>
                  MD
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem" }}>
                Mariema Diop
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontSize: "0.88rem" }}>
              Référente Digitale | Design Graphique &amp; UX/UI<br />Dakar, Sénégal
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.92rem", marginBottom: 14, color: "rgba(255,255,255,0.92)" }}>
              Navigation
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["accueil", "apropos", "competences", "services", "projets", "parcours", "contact"].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.86rem",
                      padding: 0,
                      textTransform: "capitalize",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    {id === "apropos" ? "À propos" : id === "competences" ? "Compétences" : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services list */}
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.92rem", marginBottom: 14, color: "rgba(255,255,255,0.92)" }}>
              Expertises
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Design Graphique", "UX/UI Design", "Prototypage interactif", "Conception de projets"].map((s) => (
                <li key={s} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.86rem" }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
            © {year} Mariema Diop — Tous droits réservés.
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
            Portfolio Responsive · Dakar, Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
const SECTION_IDS = ["accueil", "apropos", "competences", "services", "projets", "parcours", "temoignages", "contact"];

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const [showTop, setShowTop] = useState(false);
  useReveal();

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 350);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <Navbar active={active} />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Timeline />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {/* Back to top button */}
      <button
        id="back-to-top"
        className={showTop ? "visible" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut de la page"
      >
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={ICONS.arrowUp} />
        </svg>
      </button>
    </>
  );
}

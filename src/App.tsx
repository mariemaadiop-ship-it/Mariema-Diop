import { useState, useEffect, useRef, FormEvent } from "react";

/* ─── Icons (inline SVG helpers) ─── */
function Icon({ path, size = 20, className = "" }: { path: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); } }),
      { threshold: 0.12 }
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
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.35 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
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
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
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
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(205,180,219,0.3)" : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: scrolled ? "0 2px 20px rgba(91,58,140,0.08)" : "none",
      }}
    >
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }} aria-label="Navigation principale">
        {/* Logo */}
        <button onClick={() => scrollTo("accueil")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }} aria-label="Retour en haut">
          <div style={{ width: 38, height: 38, background: "var(--color-violet)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9rem" }}>MD</span>
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-violet)" }}>Mariema Diop</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className={`nav-link ${active === l.id ? "active" : ""}`} style={{ background: "none", border: "none", cursor: "pointer" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo("contact")} className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.85rem" }}>
            Me contacter
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 6, padding: 4 }}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          maxHeight: menuOpen ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "12px 0", fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1rem", color: active === l.id ? "var(--color-violet)" : "var(--color-ink)", borderBottom: "1px solid rgba(205,180,219,0.2)" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo("contact")} className="btn-primary" style={{ marginTop: 12, justifyContent: "center" }}>
            Me contacter
          </button>
        </div>
      </div>

      <style>{`.hidden-mobile { display: flex !important; } .hamburger { display: none !important; } @media (max-width: 768px) { .hidden-mobile { display: none !important; } .hamburger { display: flex !important; } }`}</style>
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf6ff 0%, var(--color-blush) 40%, #f3eafe 100%)",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(205,180,219,0.3) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(91,58,140,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
        {/* Text */}
        <div>
          <span className="section-label animate-fade-up" style={{ marginBottom: 12, display: "block" }}>Bonjour, je suis</span>
          <h1 className="animate-fade-up animate-delay-100" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 12 }}>
            Mariema<br />
            <span style={{ color: "var(--color-violet)" }}>Diop</span>
          </h1>
          <p className="animate-fade-up animate-delay-200" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--color-ink-muted)", marginBottom: 20 }}>
            Référente Digitale | Designer Graphique & UX/UI
          </p>
          <p className="animate-fade-up animate-delay-300" style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--color-ink-muted)", marginBottom: 36, maxWidth: 480 }}>
            Passionnée par la créativité et l'innovation numérique, je conçois des expériences visuelles et des interfaces qui transforment les idées en solutions concrètes.
          </p>
          <div className="animate-fade-up animate-delay-400" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary">
              Découvrir mes projets <Icon path={ICONS.arrow} size={18} />
            </button>
            <a href="#[Lien vers CV]" className="btn-outline" aria-label="Télécharger mon CV (lien à ajouter)">
              <Icon path={ICONS.download} size={18} /> Télécharger mon CV
            </a>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline">
              Me contacter
            </button>
          </div>
        </div>

        {/* Photo */}
        <div className="animate-fade-in animate-delay-300 hero-photo-wrapper" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 340, height: 420 }}>
            {/* Decorative ring */}
            <div aria-hidden="true" style={{ position: "absolute", inset: -16, borderRadius: "60% 40% 60% 40%", border: "2px solid rgba(205,180,219,0.5)" }} />
            <div aria-hidden="true" style={{ position: "absolute", inset: -32, borderRadius: "40% 60% 40% 60%", border: "2px dashed rgba(91,58,140,0.15)" }} />
            {/* Photo container */}
            <div style={{ width: "100%", height: "100%", borderRadius: "60% 40% 60% 40%", overflow: "hidden", boxShadow: "0 24px 64px rgba(91,58,140,0.2)", background: "linear-gradient(145deg, #f8eff8 0%, #ecdcf0 50%, #cdb4db 100%)" }}>
              <img
                src="/photo/ODC-Shoot-P8-2026 16.jpg"
                alt="Mariema Diop — Référente Digitale"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  (t.nextElementSibling as HTMLElement)?.removeAttribute("hidden");
                }}
              />
              <div className="profile-placeholder" hidden>
                <Icon path={ICONS.user} size={64} />
                <span style={{ fontSize: "0.8rem", textAlign: "center", maxWidth: 140 }}>[Ajouter photo professionnelle]</span>
              </div>
            </div>
            {/* Badge */}
            <div aria-hidden="true" style={{ position: "absolute", bottom: -12, right: -12, background: "var(--color-violet)", color: "white", borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(91,58,140,0.3)", fontFamily: "var(--font-heading)", fontSize: "0.75rem", fontWeight: 600 }}>
              ✦ Design & UX/UI
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr; } .hero-photo-wrapper { order: -1; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════
   À PROPOS
═══════════════════════════════════════ */
function About() {
  return (
    <section id="apropos" aria-label="À propos" style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
          {/* Left: decorative */}
          <div className="reveal about-visual" style={{ position: "relative" }}>
            <div style={{ borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg, var(--color-blush), #ede0f8)", padding: 48, minHeight: 400, display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, background: "var(--color-violet)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon path={ICONS.pen} size={36} className="" />
                  <span style={{ display: "none" }} />
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-violet)" }}>Mariema Diop</p>
                <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9rem", marginTop: 4 }}>Référente Digitale</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Design Graphique", "UX/UI Design", "Prototypage", "Figma"].map((tag) => (
                  <div key={tag} className="skill-badge" style={{ justifyContent: "center" }}>{tag}</div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: "auto" }}>
                <Icon path={ICONS.map} size={16} />
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--color-ink-muted)" }}>Dakar, Sénégal</span>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="section-label reveal">À propos</span>
            <span className="accent-line reveal reveal-delay-1" />
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)", lineHeight: 1.25, marginBottom: 24 }}>
              À propos de moi
            </h2>
            <div className="reveal reveal-delay-2" style={{ color: "var(--color-ink-muted)", lineHeight: 1.85, fontSize: "0.97rem", display: "flex", flexDirection: "column", gap: 16 }}>
              <p>Mon parcours est marqué par une volonté constante d'apprendre, d'évoluer et de donner une nouvelle dimension à mes compétences.</p>
              <p>Après une première expérience dans un parcours orienté vers l'éducation, j'ai choisi de me tourner vers le numérique afin d'explorer un univers qui correspond davantage à ma créativité et à mon envie d'innover.</p>
              <p>Aujourd'hui, grâce à ma formation dans le domaine du digital, j'ai développé des compétences en design graphique, UX/UI Design, prototypage et conception de solutions numériques.</p>
              <p>J'aime particulièrement transformer une idée en une expérience visuelle cohérente, accessible et impactante. Chaque projet représente pour moi une opportunité d'apprendre, de créer et de proposer des solutions adaptées aux besoins des utilisateurs.</p>
            </div>
            <div className="reveal reveal-delay-3" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["Design Graphique", "UX/UI Design", "Projets digitaux", "Formation continue"].map((tag) => (
                <span key={tag} className="skill-badge">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`.about-grid { grid-template-columns: 1fr 1fr; } @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } .about-visual { display: none; } }`}</style>
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
    <section id="competences" aria-label="Compétences" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #fdf8ff 0%, #f8f0ff 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label reveal">Mes compétences</span>
          <span className="accent-line reveal reveal-delay-1" style={{ margin: "12px auto 0" }} />
          <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)", marginTop: 8 }}>
            Ce que je sais faire
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {categories.map((cat, i) => (
            <article key={cat.title} className={`card reveal reveal-delay-${i + 1}`} style={{ padding: 32 }}>
              <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, var(--color-violet), var(--color-lavender))", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={cat.icon} />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-ink)", marginBottom: 16 }}>{cat.title}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {cat.skills.map((s) => (
                  <li key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-violet)", flexShrink: 0 }} aria-hidden="true" />
                    <span style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>{s}</span>
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
    <section id="services" aria-label="Services" style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <span className="section-label reveal">Services</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)" }}>
            Comment puis-je vous accompagner ?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <article key={s.title} className={`card reveal reveal-delay-${i + 1}`} style={{ padding: 36, position: "relative", overflow: "hidden" }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 20, right: 20, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2.5rem", color: "rgba(91,58,140,0.06)" }}>{s.num}</span>
              <div style={{ width: 48, height: 48, background: "var(--color-blush)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "var(--color-violet)" }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-ink)", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: "var(--color-ink-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>{s.description}</p>
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
      category: "UX/UI Design · Intelligence Artificielle",
      description: "Solution digitale sénégalaise de prévention, d'alerte et d'assistance destinée aux femmes, aux jeunes filles et aux enfants. Combine application mobile, dispositifs connectés discrets et IA pour faciliter l'envoi d'alertes.",
      role: ["Recherche UX", "UX/UI Design", "Maquettes Figma", "Prototypage"],
      tools: ["Figma", "Design Thinking", "UX/UI"],
      img: "assets/images/protecta.jpg",
      color: "#5B3A8C",
    },
    {
      id: "remaflow",
      name: "REMAFLOW",
      category: "E-commerce · Branding · UI Design",
      description: "Projet de marque e-commerce dédié à la vente de chaussures, vêtements et accessoires. Identité visuelle moderne et expérience digitale élégante.",
      role: ["Identité visuelle", "Design d'interface", "Maquettes", "Prototypage"],
      tools: ["Figma", "Branding", "UI Design"],
      img: "assets/images/remaflow.jpg",
      color: "#7B5AB0",
    },
    {
      id: "joj",
      name: "JOJ DAKAR 2026",
      category: "UX/UI Design · Événementiel",
      description: "Expérience digitale autour des Jeux Olympiques de la Jeunesse Dakar 2026. Parcours utilisateurs, wireframes et maquettes pour faciliter l'accès aux informations de l'événement.",
      role: ["Landing Page", "Inscription", "Calendrier", "Profil utilisateur", "Galerie"],
      tools: ["Figma", "UX/UI Design", "Wireframing"],
      img: "assets/images/joj-dakar.jpg",
      color: "#9B6BC0",
    },
    {
      id: "jigeen",
      name: "JIGEEN BUSINESS",
      category: "Innovation · Entrepreneuriat · Plateforme",
      description: "Plateforme d'accompagnement des femmes entrepreneures pour valoriser leurs produits, renforcer leur visibilité et créer de nouvelles opportunités.",
      role: ["Concept", "Structuration", "Expérience utilisateur", "Conception d'interfaces"],
      tools: ["Figma", "UX/UI", "Business Model"],
      img: "assets/images/jigeen-business.jpg",
      color: "#5B3A8C",
    },
  ];

  const [filter, setFilter] = useState("Tous");
  const categories = ["Tous", "UX/UI Design", "Branding", "Innovation"];

  return (
    <section id="projets" aria-label="Projets" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #fdf8ff 0%, #f3eafe 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <span className="section-label reveal">Portfolio</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)" }}>
            Mes projets
          </h2>
        </div>
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 20px", borderRadius: 50, border: "2px solid", borderColor: filter === c ? "var(--color-violet)" : "rgba(91,58,140,0.2)", background: filter === c ? "var(--color-violet)" : "white", color: filter === c ? "white" : "var(--color-ink-muted)", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.25s ease" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {projects.map((p, i) => (
            <article key={p.id} className={`card reveal reveal-delay-${(i % 4) + 1}`} style={{ overflow: "hidden" }}>
              {/* Image */}
              <div style={{ height: 200, background: `linear-gradient(135deg, ${p.color}22, var(--color-blush))`, position: "relative", overflow: "hidden" }}>
                <img
                  src={p.img}
                  alt={`Aperçu du projet ${p.name}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div style={{ position: "absolute", top: 16, left: 16, background: "white", borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontFamily: "var(--font-heading)", fontWeight: 600, color: p.color }}>
                  {p.category.split(" · ")[0]}
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--color-ink)", marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", lineHeight: 1.65, marginBottom: 16 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {p.tools.map((t) => (
                    <span key={t} style={{ background: "rgba(91,58,140,0.08)", color: "var(--color-violet)", borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-heading)" }}>{t}</span>
                  ))}
                </div>
                <a href="#[Ajouter lien du projet]" className="btn-primary" style={{ fontSize: "0.85rem", padding: "10px 20px" }}>
                  Voir le projet <Icon path={ICONS.external} size={14} />
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
      title: "[Ajouter diplôme / année]",
      type: "Parcours académique",
      description: "Mon parcours académique m'a permis de développer une capacité d'apprentissage, d'adaptation et une ouverture vers de nouveaux domaines professionnels.",
      quote: null,
      tags: ["Formation continue", "Apprentissage"],
      color: "var(--color-violet)",
    },
  ];

  return (
    <section id="parcours" aria-label="Parcours" style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <span className="section-label reveal">Expériences</span>
          <span className="accent-line reveal reveal-delay-1" />
          <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)" }}>
            Mon parcours
          </h2>
        </div>
        <div style={{ position: "relative", paddingLeft: 60 }}>
          <div className="timeline-line" aria-hidden="true" />
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {items.map((item, i) => (
              <div key={item.org} className={`reveal reveal-delay-${i + 1}`} style={{ position: "relative" }}>
                <div className="timeline-dot" aria-hidden="true" style={{ background: item.color }} />
                <article className="card" style={{ padding: 32 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ background: "rgba(91,58,140,0.08)", color: "var(--color-violet)", borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-heading)" }}>{item.type}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.2rem", color: "var(--color-ink)", marginBottom: 4 }}>{item.org}</h3>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--color-violet)", fontSize: "0.95rem", marginBottom: 14 }}>{item.title}</p>
                  <p style={{ color: "var(--color-ink-muted)", lineHeight: 1.75, fontSize: "0.93rem", marginBottom: 16 }}>{item.description}</p>
                  {item.quote && (
                    <blockquote style={{ borderLeft: "3px solid var(--color-lavender)", paddingLeft: 16, margin: "16px 0", color: "var(--color-ink-muted)", fontStyle: "italic", fontSize: "0.9rem", lineHeight: 1.7 }}>
                      « {item.quote} »
                    </blockquote>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {item.tags.map((t) => (
                      <span key={t} className="skill-badge">{t}</span>
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
    <section id="temoignages" aria-label="Témoignages" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #fdf8ff 0%, var(--color-blush) 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label reveal">Témoignages</span>
          <span className="accent-line reveal reveal-delay-1" style={{ margin: "12px auto 0" }} />
          <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)", marginTop: 8 }}>
            Ce qu'on dit de moi
          </h2>
          <p className="reveal reveal-delay-3" style={{ color: "var(--color-ink-muted)", marginTop: 12, fontSize: "0.95rem" }}>
            Les témoignages professionnels seront ajoutés prochainement.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[1, 2, 3].map((n) => (
            <article key={n} className={`card reveal reveal-delay-${n}`} style={{ padding: 32 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="var(--color-lavender)" aria-hidden="true"><path d={ICONS.star} /></svg>
                ))}
              </div>
              <p style={{ color: "var(--color-ink-muted)", fontStyle: "italic", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                « [Témoignage professionnel à ajouter] »
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-lavender), var(--color-blush))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-violet)" }}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.user} /></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)" }}>[Nom du contact]</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)" }}>[Poste, Organisation]</p>
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
    setSubmitted(true);
  }

  return (
    <section id="contact" aria-label="Contact" style={{ padding: "100px 24px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="contact-grid">
          {/* Left */}
          <div>
            <span className="section-label reveal">Contact</span>
            <span className="accent-line reveal reveal-delay-1" />
            <h2 className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--color-ink)", marginBottom: 16 }}>
              Travaillons ensemble
            </h2>
            <p className="reveal reveal-delay-3" style={{ color: "var(--color-ink-muted)", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: 40 }}>
              Vous avez une idée, un projet ou souhaitez simplement échanger autour du digital et de la créativité ? N'hésitez pas à me contacter.
            </p>
            <div className="reveal reveal-delay-4" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "var(--color-blush)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-violet)" }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.map} /></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)" }}>Localisation</p>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>Dakar, Sénégal</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "var(--color-blush)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-violet)" }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.mail} /></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ink)" }}>Email</p>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-ink-muted)" }}>[Ajouter adresse email]</p>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-4" style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <a href="#[Ajouter lien LinkedIn]" aria-label="LinkedIn de Mariema Diop" style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-violet)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-violet-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-violet)")}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.linkedin} /></svg>
              </a>
              <a href="#[Ajouter lien GitHub]" aria-label="GitHub de Mariema Diop" style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-violet)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-violet-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-violet)")}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.github} /></svg>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="reveal reveal-delay-2">
            <div className="card" style={{ padding: 40 }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, background: "var(--color-blush)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--color-violet)" }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.check} /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>Message reçu !</h3>
                  <p style={{ color: "var(--color-ink-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    Merci pour votre message. Fonctionnalité d'envoi à connecter à un service backend ou à une solution de formulaire.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ marginTop: 24 }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form onSubmit={handle} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                    <div>
                      <label htmlFor="nom" className="form-label">Nom *</label>
                      <input id="nom" type="text" className="form-input" placeholder="Votre nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input id="email" type="email" className="form-input" placeholder="votre@email.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sujet" className="form-label">Sujet *</label>
                    <input id="sujet" type="text" className="form-input" placeholder="De quoi s'agit-il ?" required value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea id="message" className="form-input" placeholder="Votre message..." required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--color-ink-muted)", lineHeight: 1.5 }}>
                    ℹ️ Fonctionnalité d'envoi à connecter à un service backend ou à une solution de formulaire.
                  </p>
                  <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>
                    Envoyer le message <Icon path={ICONS.arrow} size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`.contact-grid { grid-template-columns: 1fr 1fr; } .form-row { grid-template-columns: 1fr 1fr; } @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" style={{ background: "var(--color-ink)", color: "white", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: "var(--color-violet)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem" }}>MD</span>
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem" }}>Mariema Diop</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "0.9rem", maxWidth: 280 }}>
              Référente Digitale | Design Graphique & UX/UI<br />Dakar, Sénégal
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[{ icon: ICONS.linkedin, label: "LinkedIn", href: "#[Ajouter lien LinkedIn]" }, { icon: ICONS.github, label: "GitHub", href: "#[Ajouter lien GitHub]" }, { icon: ICONS.mail, label: "Email", href: "mailto:[Ajouter adresse email]" }].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "all 0.25s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-violet)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", marginBottom: 16, color: "rgba(255,255,255,0.9)" }}>Navigation</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["accueil", "apropos", "competences", "services", "projets", "parcours", "contact"].map((id) => (
                <li key={id}>
                  <button onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", fontSize: "0.88rem", padding: 0, textTransform: "capitalize", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                    {id === "apropos" ? "À propos" : id === "competences" ? "Compétences" : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", marginBottom: 16, color: "rgba(255,255,255,0.9)" }}>Services</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Design Graphique", "UX/UI Design", "Prototypage", "Projets digitaux"].map((s) => (
                <li key={s} style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem" }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
            © {year} Mariema Diop — Portfolio personnel. Tous droits réservés.
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
            Design Graphique & UX/UI · Dakar, Sénégal
          </p>
        </div>
      </div>
      <style>{`.footer-grid { grid-template-columns: 2fr 1fr 1fr; } @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } }`}</style>
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
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* SEO meta via document title */}
      <title>Mariema Diop | Référente Digitale & Designer UX/UI</title>

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

      {/* Back to top */}
      <button
        id="back-to-top"
        className={showTop ? "visible" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut de la page"
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS.arrowUp} />
        </svg>
      </button>
    </>
  );
}

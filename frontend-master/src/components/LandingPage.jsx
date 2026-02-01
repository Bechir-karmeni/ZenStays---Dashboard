import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  Users,
  ChevronRight,
  Activity,
  BarChart3,
  ShieldCheck,
  Brain,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* ===== Header / Nav ===== */}
      <header className="navbar" role="banner">
        <div className="nav-content">
          <div className="nav-left"></div>
          <nav className="nav-right" aria-label="Primary">
            <button onClick={() => navigate("/login")} className="nav-signin-btn">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-content">
            <h1 id="hero-title" className="hero-title">
              Lorem ipsum dolor sit amet <span className="hero-highlight">consectetur</span>{" "}
              adipiscing <span className="hero-highlight">elit sed do eiusmod</span>
            </h1>
            <p className="hero-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        {/* ===== Problem / Stats ===== */}
        <section className="stats-section" aria-labelledby="stats-title">
          <h2 id="stats-title" className="section-title">
            Lorem ipsum dolor sit
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <Activity className="stat-icon" />
              <p className="stat-headline">Lorem ipsum dolor</p>
              <p className="stat-value">62%</p>
              <p className="stat-label">Lorem ipsum dolor sit amet</p>
            </div>
            <div className="stat-card">
              <BarChart3 className="stat-icon" />
              <p className="stat-headline">Lorem ipsum dolor</p>
              <p className="stat-value">8%</p>
              <p className="stat-label">Lorem ipsum dolor sit amet</p>
            </div>
            <div className="stat-card">
              <ShieldCheck className="stat-icon" />
              <p className="stat-headline">Lorem ipsum dolor</p>
              <p className="stat-value">1 in 2</p>
              <p className="stat-label">Lorem ipsum dolor sit amet</p>
            </div>
          </div>
        </section>

        {/* ===== Solution Snapshot (Benefits-first Features) ===== */}
        <section className="features-section" aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">
            Lorem ipsum
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Brain className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Layers className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Heart className="icon" />
              </div>
              <h3 className="feature-title">Lorem ipsum dolor sit amet</h3>
              <p className="feature-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
              </p>
            </div>
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section id="how-it-works" className="how-section" aria-labelledby="how-title">
          <h2 id="how-title" className="section-title">
            Lorem ipsum
          </h2>
          <ol className="how-grid">
            <li className="how-card">
              <div className="how-step">1</div>
              <h3 className="how-title">Lorem</h3>
              <p className="how-text">Lorem ipsum dolor sit amet consectetur adipiscing.</p>
            </li>
            <li className="how-card">
              <div className="how-step">2</div>
              <h3 className="how-title">Ipsum</h3>
              <p className="how-text">Lorem ipsum dolor sit amet consectetur adipiscing.</p>
            </li>
            <li className="how-card">
              <div className="how-step">3</div>
              <h3 className="how-title">Dolor</h3>
              <p className="how-text">Lorem ipsum dolor sit amet consectetur adipiscing.</p>
            </li>
          </ol>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Lorem ipsum dolor sit amet?</h2>
            <p className="cta-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
            </p>
            <div className="cta-actions">
              <button onClick={() => navigate("/signup")} className="cta-btn">
                Lorem Ipsum
              </button>
            </div>
            <p className="cta-reassurance">Lorem ipsum • Dolor sit amet • Consectetur adipiscing</p>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-grid">
          <div>
            <p className="footer-blurb">Lorem ipsum dolor sit amet consectetur.</p>
            <ul className="footer-trust">
              <li>✅ Lorem Ipsum</li>
              <li>✅ Dolor Sit Amet</li>
              <li>✅ Consectetur Adipiscing</li>
            </ul>
          </div>
          <nav aria-label="Footer">
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate("/about")}>Lorem</button>
              </li>
              <li>
                <button onClick={() => navigate("/security")}>Ipsum</button>
              </li>
              <li>
                <button onClick={() => navigate("/privacy")}>Dolor</button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")}>Sit</button>
              </li>
            </ul>
          </nav>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Zenstays. Lorem ipsum dolor.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

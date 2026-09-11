import { useEffect } from "react";
import "./Home.css";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}

function Home() {
  useScrollAnimation();

  const stats = [
    ["5 yr", "WARRANTY ON MEMORY"],
    ["48 hr", "BURN-IN TESTED"],
    ["Next day", "RSA DISPATCH"],
    ["1,200+", "VERIFIED BUILDS"],
  ];

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}

      <section className="parts">
        <div className="hero">

          <div className="content">

            <span className="eyebrow hero-eyebrow">
              Predict, Prevent, Protect.
            </span>

            <h1 className="hero-title">
              Don't Just
              <br />
              Upgrade,
              <br />
              <span>FORTIFY.</span>
            </h1>

            <p className="hero-description">
              Memory, storage, silicon. Every component is
              bench-tested in-house, binned for stability
              and shipped with a five-year warranty.
              No filler SKUs, no guesswork.
            </p>

            <div className="actions hero-actions">

              <button className="primary">
                SHOP
              </button>

              <button className="secondary">
                CUSTOM BUILD
              </button>

            </div>

          </div>

          <div className="image hero-video">

            <video
              src="/assets/parts/ASUS_A15.mp4"
              autoPlay
              loop
              muted
              playsInline
            />

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="stats">

          {stats.map(([value, label], index) => (
            <div
              className="stat reveal"
              key={label}
              style={{
                "--delay": `${index * 120}ms`,
              }}
            >
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}

        </div>
      </section>

      {/* ================= PROTECTION ================= */}

      <section className="protection-section">

        <h2 className="headerProTitle reveal">
          Performance meets{" "}
          <span className="headerPro">
            Protection
          </span>
        </h2>

        <div className="epiphany-section">

          <div className="epiphany-grid">

            <div className="epiphany-image-box reveal reveal-left">

              <div className="placeholder-model-image"></div>

              <h2 className="watermark-text">
                "Watt-ever happens,
                we've got your voltage
                covered"
              </h2>

            </div>

            <div className="epiphany-text-box reveal reveal-right">

              <span className="mini-label">
                BUILT FOR SECURITY
              </span>

              <h3>
                "Armor for your motherboard,
                because naked circuits
                are a hazard."
              </h3>

              <p>
                Carefully selected components designed
                for performance, stability and protection.
              </p>

              <div className="arrow-btn-container">

                <button className="arrow-btn">
                  →
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= HIGHLIGHTS ================= */}

      <section
        className="highlights"
        id="highlights"
      >

        <div className="section-heading reveal">

          <p className="section-label">
            BEST SELLER
          </p>

          <h2>
            Get to know
            <br />
            WHY!
          </h2>

        </div>

        <div className="highlight-grid">

          {/* CARD 1 */}

          <div className="highlight-card card-large reveal">

            <div className="card-content">

              <span>
                Performance
              </span>

              <h3>
                Hackers,
                <br />
                hate us!
              </h3>

              <p>
                Parts that deliver incredible
                performance for demanding games,
                applications and everyday tasks.
              </p>

            </div>

            <div className="chip">
              CPU
            </div>

          </div>

          {/* CARD 2 */}

          <div className="highlight-card camera-card reveal">

            <div className="card-content">

              <span>
                Protection
              </span>

              <h3>
                No bugs, no breaches,
                no worries.
              </h3>

              <p>
                Components selected with
                security and reliability in mind.
              </p>

            </div>

            <div className="camera-lens">
              <div></div>
            </div>

          </div>

          {/* CARD 3 */}

          <div className="highlight-card titanium-card reveal">

            <div className="card-content">

              <span>
                Design
              </span>

              <h3>
                Creativity
                <br />
                meets compatibility.
              </h3>

            </div>

            <div className="titanium-phone"></div>

          </div>

          {/* CARD 4 */}

          <div className="highlight-card battery-card reveal">

            <div className="card-content">

              <span>
                Reliability
              </span>

              <h3>
                Built to last.
              </h3>

              <p>
                Reliable hardware designed to
                keep your system running.
              </p>

            </div>

            <div className="battery">

              <div className="battery-fill"></div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= VIDEO ================= */}

      <section className="video-section">

        <div className="video-Ad reveal">

          <video
            src="/assets/parts/GeForce_RTX_4090_Graphics_Card.mp4"
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="video-overlay">

            <span>
              CYBERSAGE
            </span>

            <h2>
              POWER
              <br />
              WITHOUT
              <br />
              COMPROMISE.
            </h2>

          </div>

        </div>

      </section>

      {/* ================= BUY ================= */}

      <section
        className="buy"
        id="buy"
      >

        <div className="buy-content reveal">

          <p className="section-label">
            CYBERSAGE
          </p>

          <h2>
            Pro.
            <br />
            Beyond.
          </h2>

          <p>
            404: <strong>Access Denied</strong>
          </p>

          <button className="blue-button">
            Buy
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;
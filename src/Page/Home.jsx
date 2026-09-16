import { useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom"
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
      },
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
    ["01", "SECURE HARDWARE"],
    ["99.9%", "SYSTEM STABILITY"],
    ["24/7", "THREAT READY"],
    ["1,200+", "VERIFIED BUILDS"],
  ];

  const securityCards = [
    {
      number: "01",
      label: "PROCESSING",
      title: "POWER THAT THINKS AHEAD.",
      text: "High-performance processors engineered for demanding workloads, gaming and secure computing environments.",
      icon: "CPU",
    },
    {
      number: "02",
      label: "DEFENCE",
      title: "HARDWARE BUILT TO DEFEND.",
      text: "Reliable components selected for stability, durability and protection against system failure.",
      icon: "SEC",
    },
    {
      number: "03",
      label: "STORAGE",
      title: "YOUR DATA. LOCKED DOWN.",
      text: "Fast storage solutions designed to keep your applications, files and digital environment moving.",
      icon: "SSD",
    },
    {
      number: "04",
      label: "NETWORK",
      title: "CONNECTED. NOT EXPOSED.",
      text: "Build a system capable of handling modern connectivity, demanding applications and secure workflows.",
      icon: "NET",
    },
  ];

  useEffect(() => {
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
    ];

    let position = 0;

    const handleKeyDown = (event) => {
      if (event.key === sequence[position]) {
        position++;

        if (position === sequence.length) {
          document.body.classList.add("cyber-override");

          setTimeout(() => {
            document.body.classList.remove("cyber-override");
          }, 6000);

          position = 0;
        }
      } else {
        position = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="cyber-home">
        <section className="cyber-hero">
          <div className="cyber-grid"></div>
          <div className="scan-line"></div>

          <div className="hero-status">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </div>

          <div className="hero-terminal">
            <span>CYBERSAGE://CORE</span>
            <span>ACCESS_LEVEL: 04</span>
            <span>THREAT_STATUS: LOW</span>
          </div>

          <div className="hero-main">
            <div className="hero-copy">
              <span className="eyebrow">PREDICT / PREVENT / PROTECT</span>

              <p className="hero-command">$ initialize secure_hardware</p>

              <h1>
                BUILD
                <br />
                <span>BEYOND</span>
                <br />
                THE THREAT.
              </h1>

              <p className="hero-description">
                CyberSage delivers high-performance hardware engineered for
                people who refuse to compromise between power, reliability and
                protection.
              </p>

              <div className="hero-actions">
                <button className="primary"><Link to="/Shop">EXPLORE HARDWARE</Link></button>

                <button className="secondary"><Link to="/Build">BUILD YOUR SYSTEM</Link></button>
              </div>
            </div>

            <div className="hero-system">
              <div className="system-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>

                <div className="system-header">
                  <span>LIVE HARDWARE FEED</span>
                  <span>● ENCRYPTED</span>
                </div>

                <video
                  src="/assets/parts/ASUS_A15.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                <div className="system-data">
                  <div>
                    <span>CORE</span>
                    <strong>ACTIVE</strong>
                  </div>

                  <div>
                    <span>MEMORY</span>
                    <strong>OPTIMAL</strong>
                  </div>

                  <div>
                    <span>DEFENCE</span>
                    <strong>READY</strong>
                  </div>
                </div>
              </div>

              <div className="floating-card card-one">
                <span>THREAT</span>
                <strong>0 DETECTED</strong>
              </div>

              <div className="floating-card card-two">
                <span>SECURITY</span>
                <strong>ACTIVE</strong>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <span>CYBERSAGE // SECURE HARDWARE SYSTEMS</span>
            <span>EST. 2026</span>
          </div>
        </section>

        <section className="security-stats">
          {stats.map(([value, label], index) => (
            <div
              className="security-stat reveal"
              key={label}
              style={{
                "--delay": `${index * 120}ms`,
              }}
            >
              <span>0{index + 1}</span>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}
        </section>

        <section className="mission-section">
          <div className="mission-heading reveal">
            <span className="section-label">/ SECURITY PROTOCOL</span>

            <h2>
              HARDWARE
              <br />
              <span>WITHOUT</span>
              <br />
              WEAKNESSES.
            </h2>
          </div>

          <div className="mission-content">
            <div className="mission-visual reveal reveal-left">
              <div className="visual-grid"></div>

              <div className="target-ring ring-one"></div>
              <div className="target-ring ring-two"></div>
              <div className="target-ring ring-three"></div>

              <div className="visual-core">
                <span>CS</span>
              </div>

              <div className="visual-label label-top">SYSTEM CORE</div>

              <div className="visual-label label-bottom">DEFENCE ACTIVE</div>

              <div className="visual-line line-one"></div>
              <div className="visual-line line-two"></div>
            </div>

            <div className="mission-copy reveal reveal-right">
              <span className="mini-label">THE CYBERSAGE STANDARD</span>

              <h3>PERFORMANCE IS ONLY HALF THE MISSION.</h3>

              <p>
                Your hardware is the foundation of your digital environment.
                CyberSage focuses on components that deliver speed, stability
                and dependable performance when your system matters most.
              </p>

              <div className="protocol-list">
                <div>
                  <span>01</span>
                  <strong>SELECT</strong>
                  <p>Components chosen for reliability.</p>
                </div>

                <div>
                  <span>02</span>
                  <strong>TEST</strong>
                  <p>Hardware verified before deployment.</p>
                </div>

                <div>
                  <span>03</span>
                  <strong>FORTIFY</strong>
                  <p>Systems prepared for demanding environments.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="security-section">
          <div className="security-heading reveal">
            <div>
              <span className="section-label">/ DEFENCE MATRIX</span>

              <h2>
                YOUR SYSTEM.
                <br />
                <span>YOUR FORTRESS.</span>
              </h2>
            </div>

            <p>
              Every layer of your machine should work together. CyberSage
              hardware is selected with performance, reliability and protection
              in mind.
            </p>
          </div>

          <div className="security-grid">
            {securityCards.map((card, index) => (
              <article
                className="security-card reveal"
                key={card.number}
                style={{
                  "--delay": `${index * 100}ms`,
                }}
              >
                <div className="card-top">
                  <span>{card.number}</span>
                  <span>{card.label}</span>
                </div>

                <div className="security-icon">{card.icon}</div>

                <div className="security-card-content">
                  <h3>{card.title}</h3>

                  <p>{card.text}</p>

                  <span className="card-link">
                    ANALYSE <b>→</b>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="threat-section">
          <div className="threat-background"></div>

          <div className="threat-content reveal">
            <div className="threat-code">
              <span>THREAT_ANALYSIS.EXE</span>
              <span>STATUS: RUNNING</span>
            </div>

            <span className="section-label">/ SYSTEM INTELLIGENCE</span>

            <h2>
              DON'T WAIT
              <br />
              FOR THE
              <br />
              <span>BREACH.</span>
            </h2>

            <p>
              Build your system with hardware that is ready before the threat
              arrives.
            </p>

            <div className="threat-meter">
              <div className="meter-info">
                <span>SYSTEM READINESS</span>
                <strong>98%</strong>
              </div>

              <div className="meter-track">
                <div className="meter-fill"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="video-section">
          <div className="video-ad reveal">
            <video
              src="/assets/parts/GeForce_RTX_4090_Graphics_Card.mp4"
              autoPlay
              loop
              muted
              playsInline
            />

            <div className="video-overlay">
              <span>CYBERSAGE // HARDWARE DIVISION</span>

              <h2>
                POWER
                <br />
                WITHOUT
                <br />
                COMPROMISE.
              </h2>

              <div className="video-command">[ ACCESS GRANTED ]</div>
            </div>
          </div>
        </section>

        <section className="final-section">
          <div className="final-grid"></div>

          <div className="final-content reveal">
            <span className="section-label">CYBERSAGE / TERMINAL</span>

            <p className="terminal-line">$ sudo build --secure</p>

            <h2>
              READY TO
              <br />
              <span>FORTIFY?</span>
            </h2>

            <p>Your next system starts here.</p>

            <button className="blue-button"><Link to="/Status">ENTER CYBERSAGE</Link></button>
          </div>

          <div className="final-terminal">
            <span>ACCESS: GRANTED</span>
            <span>ENCRYPTION: AES-256</span>
            <span>STATUS: SECURE</span>
          </div>
        </section>

        <div className="override-screen">
          <div className="override-box">
            <span>[ CYBERSAGE OVERRIDE ]</span>
            <h2>ACCESS LEVEL: ADMIN</h2>
            <p>SECURITY PROTOCOL: DISABLED</p>
            <strong>WELCOME, OPERATOR.</strong>
          </div>
        </div>
      </main>

      <div className="secret-terminal">
        <span>&gt; SYSTEM MESSAGE</span>
        <p>IF YOU CAN READ THIS, YOU'RE LOOKING TOO CLOSELY.</p>
      </div>

      <Footer />
    </>
  );
}

export default Home;

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./About.css";

function About() {
  const timeline = [
    ["2026", "CYBERSAGE INITIALISED"],
    ["001", "FIRST VERIFIED BUILD"],
    ["002", "SECURITY LAB ACTIVATED"],
    ["003", "HARDWARE VAULT OPENED"],
    ["NOW", "SYSTEM ONLINE"],
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <span className="section-label">
            / CYBERSAGE INTELLIGENCE
          </span>

          <h1>
            WE DIDN'T BUILD
            <br />
            ANOTHER
            <br />
            <span>HARDWARE STORE.</span>
          </h1>

          <p>
            We built a defence system for people who expect
            more from their technology.
          </p>
        </section>

        <section className="about-statement">
          <span className="section-label">
            / THE PHILOSOPHY
          </span>

          <h2>
            PERFORMANCE
            <br />
            IS ONLY HALF
            <br />
            THE <span>MISSION.</span>
          </h2>

          <p>
            CyberSage exists at the intersection of performance,
            reliability and digital security. Every component is
            part of a larger system.
          </p>
        </section>

        <section className="timeline-section">
          <div className="timeline-heading">
            <span className="section-label">
              / SYSTEM LOG
            </span>

            <h2>THE JOURNEY.</h2>
          </div>

          <div className="timeline">
            {timeline.map(([year, title], index) => (
              <div className="timeline-item" key={title}>
                <span>{year}</span>

                <div className="timeline-dot">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <strong>{title}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="about-final">
          <span>CYBERSAGE // CORE PRINCIPLE</span>

          <h2>
            ASSUME
            <br />
            <span>NOTHING.</span>
            <br />
            VERIFY
            <br />
            EVERYTHING.
          </h2>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
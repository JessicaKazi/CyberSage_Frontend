import { useEffect } from "react";
import "./About.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function About() {

  useEffect(() => {

    const revealElements =
      document.querySelectorAll(".about-reveal");

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "about-show"
            );

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };

  }, []);


  return (

    <main className="about-page">

      <Navbar />

      {/* =================================
          PAGE HERO
      ================================= */}

      <section className="about-hero">

        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">

          <p className="about-small-title">
            ABOUT CYBERSAGE
          </p>

          <h1>
            About Us
          </h1>

          <div className="about-breadcrumb">

            <span>Home</span>

            <span>/</span>

            <strong>About Us</strong>

          </div>

        </div>

      </section>



      {/* =================================
          ABOUT INTRO
      ================================= */}

      <section className="about-intro">

        <div className="about-intro-image about-reveal">

          <img
            src="/assets/about/about-team.jpg"
            alt="CyberSage team working"
          />

        </div>


        <div className="about-intro-content about-reveal">

          <p className="about-label">
            ABOUT US
          </p>

          <h2>
            We Always Make
            <br />
            <span>The Best</span>
          </h2>

          <p className="about-description">

            CyberSage is dedicated to providing
            reliable, high-performance computer
            hardware for gamers, creators,
            developers and businesses.

          </p>

          <p className="about-description">

            Every component we offer is carefully
            selected and tested for performance,
            reliability and long-term stability.

          </p>


          <button className="about-button">
            Contact Us
          </button>

        </div>

      </section>



      {/* =================================
          SKILLS + STATISTICS
      ================================= */}

      <section className="about-skills">

        <div className="skills-container">


          {/* LEFT */}

          <div className="skills-content about-reveal">

            <p className="about-label">
              OUR SKILLS
            </p>

            <h2>
              Built around
              <br />
              <span>performance.</span>
            </h2>

            <p className="skills-description">

              From component selection to system
              optimisation, our focus is making
              technology dependable, powerful and
              ready for whatever you throw at it.

            </p>


            {/* Skill 1 */}

            <div className="skill">

              <div className="skill-header">

                <span>
                  Performance
                </span>

                <span>
                  95%
                </span>

              </div>

              <div className="skill-line">

                <div
                  className="skill-progress progress-95"
                ></div>

              </div>

            </div>


            {/* Skill 2 */}

            <div className="skill">

              <div className="skill-header">

                <span>
                  Reliability
                </span>

                <span>
                  90%
                </span>

              </div>

              <div className="skill-line">

                <div
                  className="skill-progress progress-90"
                ></div>

              </div>

            </div>


            {/* Skill 3 */}

            <div className="skill">

              <div className="skill-header">

                <span>
                  Innovation
                </span>

                <span>
                  85%
                </span>

              </div>

              <div className="skill-line">

                <div
                  className="skill-progress progress-85"
                ></div>

              </div>

            </div>

          </div>



          {/* RIGHT - STATISTICS */}

          <div className="about-statistics">


            <div className="about-stat about-reveal">

              <strong>
                5+
              </strong>

              <span>
                YEARS OF
                <br />
                EXPERIENCE
              </span>

            </div>


            <div className="about-stat about-reveal">

              <strong>
                1,000+
              </strong>

              <span>
                PRODUCTS
                <br />
                AVAILABLE
              </span>

            </div>


            <div className="about-stat about-reveal">

              <strong>
                300+
              </strong>

              <span>
                SATISFIED
                <br />
                CUSTOMERS
              </span>

            </div>


            <div className="about-stat about-reveal">

              <strong>
                64
              </strong>

              <span>
                VERIFIED
                <br />
                BUILDS
              </span>

            </div>


          </div>

        </div>

      </section>



      {/* =================================
          LARGE IMAGE / CTA
      ================================= */}

      <section className="about-cta about-reveal">

        <img
          src="/assets/about/about-computer.jpg"
          alt="Computer hardware"
        />

        <div className="about-cta-overlay"></div>


        <div className="about-cta-content">

          <p>
            BUILD WITH US
          </p>

          <h2>

            We Are Always Ready
            <br />
            To Build Something
            <br />
            <span>Powerful.</span>

          </h2>


          <button className="about-button about-button-light">
            Get Started
          </button>

        </div>

      </section>



      {/* =================================
          VALUES
      ================================= */}

      <section className="about-values">

        <div className="values-heading about-reveal">

          <p className="about-label">
            WHY CYBERSAGE
          </p>

          <h2>
            Technology
            <br />
            without the
            <span> guesswork.</span>
          </h2>

        </div>


        <div className="values-grid">


          <article className="value-card about-reveal">

            <span className="value-number">
              01
            </span>

            <h3>
              Performance
            </h3>

            <p>
              Hardware selected for speed,
              efficiency and demanding workloads.
            </p>

          </article>


          <article className="value-card about-reveal">

            <span className="value-number">
              02
            </span>

            <h3>
              Protection
            </h3>

            <p>
              Reliable components designed to
              protect your system and your data.
            </p>

          </article>


          <article className="value-card about-reveal">

            <span className="value-number">
              03
            </span>

            <h3>
              Reliability
            </h3>

            <p>
              Every component should perform
              consistently long after installation.
            </p>

          </article>


        </div>

      </section>


    <Footer />
    </main>

  );
}

export default About;
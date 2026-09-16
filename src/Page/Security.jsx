import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Security.css";

const layers = [
  {
    number: "01",
    name: "HARDWARE",
    description:
      "The physical foundation of every secure computing environment.",
  },
  {
    number: "02",
    name: "SOFTWARE",
    description:
      "Applications and operating systems form the second defence layer.",
  },
  {
    number: "03",
    name: "NETWORK",
    description:
      "Connectivity should enable your system without exposing it unnecessarily.",
  },
  {
    number: "04",
    name: "DATA",
    description:
      "Your information deserves protection at every stage of its lifecycle.",
  },
  {
    number: "05",
    name: "USER",
    description:
      "Security ultimately depends on the person operating the system.",
  },
];

function Security() {
  const [active, setActive] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (active === layers.length - 1) {
      setTimeout(() => {
        setComplete(true);
      }, 1200);
    }
  }, [active]);

  return (
    <>
      <Navbar />

      <main className="security-page">
        <section className="security-hero">
          <span className="section-label">
            / SECURITY LAB
          </span>

          <h1>
            SECURITY
            <br />
            <span>IS A SYSTEM.</span>
          </h1>

          <p>
            Protection isn't a single component. It's every layer
            working together.
          </p>
        </section>

        <section className="security-lab">
          <div className="lab-visual">
            <div className="lab-grid"></div>

            <div className="lab-core">
              <span>CS</span>
            </div>

            {layers.map((layer, index) => (
              <div
                key={layer.number}
                className={`lab-ring ring-${index + 1} ${
                  active >= index ? "ring-active" : ""
                }`}
              >
                <span>{layer.number}</span>
              </div>
            ))}
          </div>

          <div className="lab-controls">
            <span className="mini-label">
              DEFENCE ARCHITECTURE
            </span>

            <h2>
              FIVE
              <br />
              LAYERS.
            </h2>

            <div className="layer-list">
              {layers.map((layer, index) => (
                <button
                  key={layer.number}
                  className={active === index ? "layer-active" : ""}
                  onClick={() => setActive(index)}
                >
                  <span>{layer.number}</span>
                  <strong>{layer.name}</strong>
                  <i>→</i>
                </button>
              ))}
            </div>

            <div className="layer-description">
              <span>{layers[active].name}</span>
              <p>{layers[active].description}</p>
            </div>
          </div>
        </section>

        <section className="security-message">
          <span className="section-label">
            / SYSTEM ANALYSIS
          </span>

          <h2>
            {complete ? (
              <>
                THE SYSTEM
                <br />
                WAS NEVER
                <br />
                <span>THE WEAKNESS.</span>
              </>
            ) : (
              <>
                BUILD THE
                <br />
                <span>DEFENCE.</span>
              </>
            )}
          </h2>

          {complete && (
            <p>
              The assumption was.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Security;
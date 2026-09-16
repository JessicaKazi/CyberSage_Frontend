import { useMemo, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Build.css";

const components = {
  PROCESSOR: [
    ["Core X5", 1200, 90],
    ["Core X7", 1800, 94],
    ["Core X9", 2600, 98],
  ],
  GRAPHICS: [
    ["RTX Guard 4060", 3500, 86],
    ["RTX Guard 4070", 5500, 94],
    ["RTX Guard 4090", 9000, 99],
  ],
  MEMORY: [
    ["Sage 16GB", 900, 85],
    ["Sage 32GB", 1600, 94],
    ["Sage 64GB", 3000, 98],
  ],
  STORAGE: [
    ["Vault 1TB", 1000, 87],
    ["Vault 2TB", 1800, 95],
    ["Vault 4TB", 3200, 98],
  ],
};

function Build() {
  const [build, setBuild] = useState({
    PROCESSOR: null,
    GRAPHICS: null,
    MEMORY: null,
    STORAGE: null,
  });

  const selectedCount = Object.values(build).filter(Boolean).length;

  const score = useMemo(() => {
    const values = Object.values(build)
      .filter(Boolean)
      .map((item) => item[2]);

    if (!values.length) return 0;

    return Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    );
  }, [build]);

  const total = Object.values(build)
    .filter(Boolean)
    .reduce((sum, item) => sum + item[1], 0);

  const selectComponent = (category, item) => {
    setBuild((current) => ({
      ...current,
      [category]: item,
    }));
  };

  return (
    <>
      <Navbar />

      <main className="build-page">
        <section className="build-hero">
          <span className="section-label">
            / SYSTEM CONFIGURATION
          </span>

          <h1>
            BUILD YOUR
            <br />
            <span>FORTRESS.</span>
          </h1>

          <p>
            Assemble your hardware and analyse the resulting system.
          </p>
        </section>

        <section className="builder">
          <div className="component-panel">
            {Object.entries(components).map(
              ([category, options]) => (
                <div className="component-group" key={category}>
                  <div className="component-heading">
                    <span>{category}</span>
                    <small>
                      {build[category] ? "SELECTED" : "REQUIRED"}
                    </small>
                  </div>

                  <div className="component-options">
                    {options.map((item) => (
                      <button
                        key={item[0]}
                        className={
                          build[category]?.[0] === item[0]
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          selectComponent(category, item)
                        }
                      >
                        <span>{item[0]}</span>
                        <strong>R {item[1].toLocaleString()}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          <aside className="build-terminal">
            <div className="terminal-header">
              <span>CYBERSAGE BUILD ENGINE</span>
              <span>ONLINE</span>
            </div>

            <div className="terminal-status">
              <span>SYSTEM COMPLETION</span>
              <strong>{selectedCount}/4</strong>
            </div>

            <div className="build-progress">
              <span
                style={{
                  width: `${selectedCount * 25}%`,
                }}
              ></span>
            </div>

            <div className="build-score">
              <span>SECURITY SCORE</span>
              <strong>{score}%</strong>
            </div>

            <div className="score-ring">
              <div>
                <strong>{score}</strong>
                <span>SECURE</span>
              </div>
            </div>

            <div className="build-summary">
              {Object.entries(build).map(([category, item]) => (
                <div key={category}>
                  <span>{category}</span>
                  <strong>
                    {item ? item[0] : "NOT SELECTED"}
                  </strong>
                </div>
              ))}
            </div>

            <div className="build-total">
              <span>ESTIMATED TOTAL</span>
              <strong>R {total.toLocaleString()}</strong>
            </div>

            <button className="deploy-button">
              DEPLOY SYSTEM
            </button>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Build;
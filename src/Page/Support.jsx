import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Support.css";

const commands = {
  PRODUCT: {
    title: "PRODUCT SUPPORT",
    text: "Need help choosing or troubleshooting hardware? Start with your product identification.",
    path: "/Shop",
  },

  ORDER: {
    title: "ORDER STATUS",
    text: "Enter your order information to check your current CyberSage order status.",
    path: "/OrderStatus",
  },

  WARRANTY: {
    title: "WARRANTY",
    text: "CyberSage verified hardware is supported according to the warranty attached to your purchase.",
    path: "/About",
  },

  COMPATIBILITY: {
    title: "COMPATIBILITY",
    text: "Use the Build system to analyse component combinations before purchasing.",
    path: "/Build",
  },
};

function Support() {
  const [active, setActive] = useState("PRODUCT");
  const navigate = useNavigate();

  const activeCommand = commands[active];

  return (
    <>
      <Navbar />

      <main className="support-page">
        <section className="support-hero">
          <span className="section-label">/ SUPPORT TERMINAL</span>

          <h1>
            HOW CAN WE
            <br />
            <span>HELP?</span>
          </h1>

          <p>$ help --cybersage</p>
        </section>

        <section className="support-terminal">
          <div className="support-menu">
            {Object.keys(commands).map((command, index) => (
              <button
                key={command}
                className={active === command ? "active" : ""}
                onClick={() => setActive(command)}
              >
                <span>
                  [{String(index + 1).padStart(2, "0")}]
                </span>

                {commands[command].title}
              </button>
            ))}

            <button onClick={() => navigate("/Contact")}>
              <span>[05]</span>
              CONTACT OPERATOR
            </button>
          </div>

          <div className="support-output">
            <div className="output-header">
              <span>CYBERSAGE SUPPORT</span>
              <span>SESSION ACTIVE</span>
            </div>

            <p className="command-line">
              $ open {active.toLowerCase()}
            </p>

            <h2>{activeCommand.title}</h2>

            <p>{activeCommand.text}</p>

            <button
              className="support-action"
              onClick={() => navigate(activeCommand.path)}
            >
              INITIALISE →
            </button>
          </div>
        </section>

        <section className="support-secret">
          <span>TERMINAL MESSAGE</span>

          <h2>
            HAVE YOU
            <br />
            TRIED TURNING
            <br />
            IT <span>OFF?</span>
          </h2>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Support;
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Status.css";

const systems = [
  "SHOP",
  "AUTHENTICATION",
  "PRODUCT DATABASE",
  "ORDER SYSTEM",
  "PAYMENTS",
  "SUPPORT",
];

function Status() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />

      <main className="status-page">
        <section className="status-hero">
          <span className="section-label">
            / SYSTEM MONITOR
          </span>

          <h1>
            ALL SYSTEMS
            <br />
            <span>NOMINAL.</span>
          </h1>

          <p>
            LAST CHECK: {time.toLocaleTimeString()}
          </p>
        </section>

        <section className="status-dashboard">
          <div className="status-overview">
            <div className="status-circle">
              <strong>100%</strong>
              <span>OPERATIONAL</span>
            </div>

            <div>
              <span className="section-label">
                GLOBAL STATUS
              </span>

              <h2>CYBERSAGE CORE</h2>

              <p>
                All monitored systems are currently operating
                normally.
              </p>
            </div>
          </div>

          <div className="status-list">
            {systems.map((system, index) => (
              <div className="status-row" key={system}>
                <span>
                  0{index + 1}
                </span>

                <strong>{system}</strong>

                <div className="status-bar">
                  <i></i>
                </div>

                <em>OPERATIONAL</em>
              </div>
            ))}
          </div>
        </section>

        <section className="status-bottom">
          <span>CYBERSAGE SYSTEM STATUS</span>

          <h2>
            NO THREATS.
            <br />
            NO <span>COMPROMISE.</span>
          </h2>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Status;
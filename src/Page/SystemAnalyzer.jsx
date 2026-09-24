import { useEffect, useMemo, useState } from "react";
import "./SystemAnalyzer.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getBrowserSpecs() {
  const nav = navigator;
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;

  return {
    os: getOS(),
    browser: getBrowser(),
    logicalCores: nav.hardwareConcurrency || null,
    deviceMemory: nav.deviceMemory || null,
    screen: `${window.screen.width} × ${window.screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
    online: nav.onLine,
    connection: connection?.effectiveType || null,
  };
}

function getOS() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";

  return "Unknown";
}

function getBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";

  return "Unknown";
}

function scoreRAM(ram) {
  const value = Number(ram);

  if (!value) return 0;
  if (value >= 32) return 100;
  if (value >= 16) return 85;
  if (value >= 12) return 72;
  if (value >= 8) return 55;
  if (value >= 4) return 30;

  return 15;
}

function scoreStorage(type, capacity) {
  const size = Number(capacity);

  let score = 20;

  if (type === "NVMe SSD") score = 100;
  else if (type === "SSD") score = 85;
  else if (type === "SATA SSD") score = 80;
  else if (type === "HDD") score = 40;

  if (size >= 1000) score += 5;
  else if (size < 256) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function scoreCPU(cores) {
  const value = Number(cores);

  if (!value) return 0;
  if (value >= 16) return 100;
  if (value >= 12) return 92;
  if (value >= 8) return 82;
  if (value >= 6) return 72;
  if (value >= 4) return 58;

  return 35;
}

function scoreGPU(gpu) {
  if (!gpu) return 0;

  const value = gpu.toLowerCase();

  if (
    value.includes("rtx 40") ||
    value.includes("rtx 50") ||
    value.includes("rx 7")
  ) {
    return 100;
  }

  if (
    value.includes("rtx") ||
    value.includes("rx 6") ||
    value.includes("rx 5")
  ) {
    return 85;
  }

  if (
    value.includes("gtx") ||
    value.includes("arc")
  ) {
    return 70;
  }

  if (
    value.includes("iris") ||
    value.includes("vega")
  ) {
    return 50;
  }

  if (
    value.includes("uhd") ||
    value.includes("intel hd") ||
    value.includes("integrated")
  ) {
    return 30;
  }

  return 45;
}

function scoreLabel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 45) return "Average";
  if (score >= 30) return "Below Average";

  return "Needs Upgrade";
}

function getRecommendations(specs) {
  const recommendations = [];

  if (Number(specs.ram) < 16) {
    recommendations.push({
      type: "RAM",
      reason: "More memory will improve multitasking and demanding applications.",
      searchTerms: ["ram", "memory"],
    });
  }

  if (
    specs.storageType === "HDD" ||
    Number(specs.storageCapacity) < 512
  ) {
    recommendations.push({
      type: "STORAGE",
      reason: "A faster or larger SSD can significantly improve boot and load times.",
      searchTerms: ["ssd", "storage"],
    });
  }

  if (scoreGPU(specs.gpu) < 60) {
    recommendations.push({
      type: "GPU",
      reason: "Your graphics hardware may limit gaming, 3D work and GPU-heavy applications.",
      searchTerms: ["gpu", "graphics"],
    });
  }

  if (scoreCPU(specs.logicalCores) < 60) {
    recommendations.push({
      type: "CPU",
      reason: "A stronger processor can improve compilation, rendering and CPU-heavy workloads.",
      searchTerms: ["cpu", "processor"],
    });
  }

  return recommendations;
}

export default function SystemAnalyzer() {
  const [browserSpecs, setBrowserSpecs] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [specs, setSpecs] = useState({
    cpu: "",
    gpu: "",
    ram: "",
    storageType: "SSD",
    storageCapacity: "",
    logicalCores: "",
  });

  useEffect(() => {
    setBrowserSpecs(getBrowserSpecs());
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);

        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Product loading error:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (!specs.logicalCores && browserSpecs.logicalCores) {
      setSpecs((previous) => ({
        ...previous,
        logicalCores: browserSpecs.logicalCores,
      }));
    }

    if (!specs.ram && browserSpecs.deviceMemory) {
      setSpecs((previous) => ({
        ...previous,
        ram: browserSpecs.deviceMemory,
      }));
    }
  }, [browserSpecs, specs.logicalCores, specs.ram]);

  const scores = useMemo(() => {
    return {
      cpu: scoreCPU(specs.logicalCores),
      gpu: scoreGPU(specs.gpu),
      ram: scoreRAM(specs.ram),
      storage: scoreStorage(
        specs.storageType,
        specs.storageCapacity
      ),
    };
  }, [specs]);

  const overallScore = useMemo(() => {
    const values = Object.values(scores).filter((value) => value > 0);

    if (!values.length) return 0;

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) / values.length
    );
  }, [scores]);

  const recommendations = useMemo(
    () => getRecommendations(specs),
    [specs]
  );

  function updateSpec(event) {
    const { name, value } = event.target;

    setSpecs((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function findProducts(recommendation) {
    const terms = recommendation.searchTerms;

    return products
      .filter((product) => {
        const text = [
          product.name,
          product.description,
          product.tags,
          product.brand,
          product.material,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return terms.some((term) => text.includes(term));
      })
      .filter((product) => Number(product.inventory_count ?? 1) > 0)
      .slice(0, 3);
  }

  return (
    <main className="analyzer">
      <section className="analyzerHero">
        <div>
          <span className="eyebrow">CYBERSAGE // SYSTEM ANALYZER</span>

          <h1>
            Understand your
            <span> machine.</span>
          </h1>

          <p>
            Analyze your hardware, identify bottlenecks and discover
            CyberSage products that can improve your system.
          </p>
        </div>

        <div className="scanStatus">
          <span className="statusDot"></span>
          SYSTEM SCAN READY
        </div>
      </section>

      <section className="detectedPanel">
        <div className="sectionHeader">
          <div>
            <span className="sectionTag">01 // DETECTED</span>
            <h2>System information</h2>
          </div>
        </div>

        <div className="detectedGrid">
          <div className="detectedItem">
            <span>OPERATING SYSTEM</span>
            <strong>{browserSpecs.os || "Detecting..."}</strong>
          </div>

          <div className="detectedItem">
            <span>BROWSER</span>
            <strong>{browserSpecs.browser || "Detecting..."}</strong>
          </div>

          <div className="detectedItem">
            <span>CPU THREADS</span>
            <strong>
              {browserSpecs.logicalCores || "Unavailable"}
            </strong>
          </div>

          <div className="detectedItem">
            <span>MEMORY AVAILABLE</span>
            <strong>
              {browserSpecs.deviceMemory
                ? `${browserSpecs.deviceMemory} GB`
                : "Unavailable"}
            </strong>
          </div>

          <div className="detectedItem">
            <span>DISPLAY</span>
            <strong>{browserSpecs.screen || "Unavailable"}</strong>
          </div>

          <div className="detectedItem">
            <span>CONNECTION</span>
            <strong>
              {browserSpecs.connection || "Unknown"}
            </strong>
          </div>
        </div>
      </section>

      <section className="hardwarePanel">
        <div className="sectionHeader">
          <div>
            <span className="sectionTag">02 // HARDWARE PROFILE</span>
            <h2>Tell CyberSage about your hardware</h2>
          </div>
        </div>

        <p className="helper">
          Browsers don't expose every hardware detail. Add the missing
          specifications below so the analyzer can produce a more
          accurate result.
        </p>

        <div className="hardwareForm">
          <label>
            CPU
            <input
              name="cpu"
              value={specs.cpu}
              onChange={updateSpec}
              placeholder="e.g. Intel Core i5-12400"
            />
          </label>

          <label>
            GPU
            <input
              name="gpu"
              value={specs.gpu}
              onChange={updateSpec}
              placeholder="e.g. NVIDIA RTX 3060"
            />
          </label>

          <label>
            RAM
            <select
              name="ram"
              value={specs.ram}
              onChange={updateSpec}
            >
              <option value="">Select RAM</option>
              <option value="4">4 GB</option>
              <option value="8">8 GB</option>
              <option value="12">12 GB</option>
              <option value="16">16 GB</option>
              <option value="32">32 GB</option>
              <option value="64">64 GB</option>
            </select>
          </label>

          <label>
            CPU CORES / THREADS
            <input
              type="number"
              min="1"
              name="logicalCores"
              value={specs.logicalCores}
              onChange={updateSpec}
              placeholder="e.g. 8"
            />
          </label>

          <label>
            STORAGE TYPE
            <select
              name="storageType"
              value={specs.storageType}
              onChange={updateSpec}
            >
              <option value="HDD">HDD</option>
              <option value="SSD">SSD</option>
              <option value="SATA SSD">SATA SSD</option>
              <option value="NVMe SSD">NVMe SSD</option>
            </select>
          </label>

          <label>
            STORAGE CAPACITY
            <select
              name="storageCapacity"
              value={specs.storageCapacity}
              onChange={updateSpec}
            >
              <option value="">Select capacity</option>
              <option value="128">128 GB</option>
              <option value="256">256 GB</option>
              <option value="512">512 GB</option>
              <option value="1000">1 TB</option>
              <option value="2000">2 TB</option>
              <option value="4000">4 TB</option>
            </select>
          </label>
        </div>
      </section>

      <section className="scoreSection">
        <div className="scoreCard">
          <div className="scoreRing">
            <span>{overallScore}</span>
            <small>/ 100</small>
          </div>

          <div>
            <span className="sectionTag">SYSTEM SCORE</span>

            <h2>
              {overallScore
                ? scoreLabel(overallScore)
                : "Waiting for specs"}
            </h2>

            <p>
              Your score is calculated from the hardware information
              currently available to CyberSage.
            </p>
          </div>
        </div>

        <div className="componentScores">
          <ScoreRow
            name="CPU"
            score={scores.cpu}
          />

          <ScoreRow
            name="GPU"
            score={scores.gpu}
          />

          <ScoreRow
            name="RAM"
            score={scores.ram}
          />

          <ScoreRow
            name="STORAGE"
            score={scores.storage}
          />
        </div>
      </section>

      <section className="recommendationSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionTag">03 // UPGRADE ADVISOR</span>
            <h2>Recommended improvements</h2>
          </div>
        </div>

        {!recommendations.length ? (
          <div className="emptyRecommendation">
            <strong>No major upgrade detected.</strong>
            <p>
              Enter your hardware information above and CyberSage
              will identify possible upgrade paths.
            </p>
          </div>
        ) : (
          <div className="recommendations">
            {recommendations.map((recommendation) => {
              const matchingProducts =
                findProducts(recommendation);

              return (
                <article
                  className="recommendation"
                  key={recommendation.type}
                >
                  <div className="recommendationTop">
                    <div className="upgradeIcon">
                      {recommendation.type.slice(0, 2)}
                    </div>

                    <div>
                      <span>{recommendation.type} UPGRADE</span>
                      <h3>Improve your {recommendation.type}</h3>
                    </div>
                  </div>

                  <p>{recommendation.reason}</p>

                  {loadingProducts ? (
                    <div className="productLoading">
                      Searching CyberSage products...
                    </div>
                  ) : matchingProducts.length ? (
                    <div className="productList">
                      {matchingProducts.map((product) => (
                        <div
                          className="recommendedProduct"
                          key={product.product_id || product._id}
                        >
                          <div>
                            <span className="productBrand">
                              {product.brand || "CYBERSAGE"}
                            </span>

                            <h4>{product.name}</h4>

                            <p>
                              {product.description ||
                                "Compatible upgrade option."}
                            </p>
                          </div>

                          <div className="productRight">
                            <strong>
                              R{" "}
                              {Number(product.price || 0).toLocaleString(
                                "en-ZA"
                              )}
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                window.location.href = `/Shop/${product.product_id || product._id}`
                              }
                            >
                              VIEW PRODUCT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="noProducts">
                      No matching CyberSage products are currently
                      available.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function ScoreRow({ name, score }) {
  return (
    <div className="scoreRow">
      <div className="scoreLabel">
        <span>{name}</span>
        <strong>{score || "--"}</strong>
      </div>

      <div className="scoreBar">
        <div
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}
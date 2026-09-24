import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommandPalette.css";

const API_URL = import.meta.env.VITE_API_URL;

// Static site commands. Add more routes here as the site grows.
const STATIC_COMMANDS = [
  { label: "HOME // COMMAND CENTER", path: "/Home", hint: "GO" },
  { label: "SHOP // HARDWARE VAULT", path: "/Shop", hint: "GO" },
  { label: "BUILD // SYSTEM CONFIGURATOR", path: "/build", hint: "GO" },
  { label: "SECURITY // DEFENCE LAB", path: "/security", hint: "GO" },
  { label: "ABOUT // INTEL", path: "/about", hint: "GO" },
  { label: "SUPPORT // TERMINAL", path: "/support", hint: "GO" },
  { label: "STATUS // SYSTEM MONITOR", path: "/status", hint: "GO" },
];

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(null); // null = not fetched yet
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Global shortcut: Ctrl+K / Cmd+K opens, Escape closes
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }

      if (event.key === "Escape" && open) {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  // Focus the input the moment the palette opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Lazy-load products once, on first open, not on every keystroke
  useEffect(() => {
    if (!open || products !== null) return;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);

        const response = await fetch(`${API_URL}/webproducts`);
        const data = await response.json();

        const list = Array.isArray(data) ? data : data.products || [];

        setProducts(
          list.map((product) => ({
            ...product,
            id: product.id || product._id,
          })),
        );
      } catch (error) {
        console.error("Command palette product fetch error:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [open, products]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const pages = STATIC_COMMANDS.filter((command) =>
      !q || command.label.toLowerCase().includes(q),
    ).map((command) => ({
      type: "page",
      label: command.label,
      hint: command.hint,
      action: () => navigate(command.path),
    }));

    if (!q || !products) {
      return pages;
    }

    const matchedProducts = products
      .filter(
        (product) =>
          product.name?.toLowerCase().includes(q) ||
          product.category?.toLowerCase().includes(q),
      )
      .slice(0, 6)
      .map((product) => ({
        type: "product",
        label: product.name,
        hint: product.category || "COMPONENT",
        action: () => navigate(`/product/${product.id}`),
      }));

    return [...pages, ...matchedProducts];
  }, [query, products, navigate]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runResult = (result) => {
    if (!result) return;
    result.action();
    close();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runResult(results[activeIndex]);
    }
  };

  return (
    <>
      {/* Small persistent trigger — mirrors the nav-status pill styling */}
      <button
        type="button"
        className="palette-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <span>&gt;_</span>
        QUICK ACCESS
        <kbd>{navigator.platform?.includes("Mac") ? "⌘K" : "CTRL+K"}</kbd>
      </button>

      {open && (
        <div className="palette-overlay" onClick={close}>
          <div
            className="palette-box"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="palette-input-row">
              <span>&gt;</span>

              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder="Search pages or hardware..."
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                type="button"
                className="palette-close"
                onClick={close}
                aria-label="Close"
              >
                ESC
              </button>
            </div>

            <div className="palette-results">
              {results.length === 0 && !productsLoading && (
                <div className="palette-empty">
                  NO MATCHES FOUND FOR "{query}"
                </div>
              )}

              {results.map((result, index) => (
                <button
                  type="button"
                  key={`${result.type}-${result.label}-${index}`}
                  className={`palette-result ${
                    index === activeIndex ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runResult(result)}
                >
                  <span className="palette-result-type">
                    {result.type === "product" ? "HW" : "GO"}
                  </span>

                  <span className="palette-result-label">{result.label}</span>

                  <span className="palette-result-hint">{result.hint}</span>
                </button>
              ))}

              {productsLoading && (
                <div className="palette-empty">INDEXING HARDWARE...</div>
              )}
            </div>

            <div className="palette-footer">
              <span>↑↓ NAVIGATE</span>
              <span>↵ SELECT</span>
              <span>ESC CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandPalette;

import { useEffect, useState } from "react";
import ProductCard from "../Shop/ProductCard";
import CategoryBar from "../Shop/CategoryBar";
import Cart from "../Components/Cart";
import Navbar from "../Components/Navbar";

import "./Shop.css";

const API_URL = "http://localhost:3000";

function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cybersageCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Could not load cart:", error);
      return [];
    }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const savedCart = localStorage.getItem("cybersageCart");

        setCart(savedCart ? JSON.parse(savedCart) : []);
      } catch (error) {
        console.error("Cart update error:", error);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem("cybersageCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const elements = document.querySelectorAll(".shop-reveal, .product-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("shop-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [products, category, search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/webproducts`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        

        console.log("Products received from API:", data);

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        setProducts(productList);

        if (productList.length === 0) {
          console.warn("API returned no products:", data);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        return currentCart.map((item) => {
          if (item.id === product.id) {
            if (item.quantity >= product.stock) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        });
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  };

  const increaseQuantity = async (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (item.quantity >= item.stock) {
      alert("You have reached the available stock.");
      return;
    }

    try {
      if (item.cartId) {
        await fetch(`${API_URL}/userscarts/${item.cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: item.quantity + 1,
          }),
        });
      }

      setCart((currentCart) =>
        currentCart.map((cartItem) => {
          if (cartItem.id === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }

          return cartItem;
        }),
      );
    } catch (error) {
      console.error("Increase quantity error:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (item.quantity === 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      if (item.cartId) {
        await fetch(`${API_URL}/userscarts/${item.cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: item.quantity - 1,
          }),
        });
      }

      setCart((currentCart) =>
        currentCart.map((cartItem) => {
          if (cartItem.id === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            };
          }

          return cartItem;
        }),
      );
    } catch (error) {
      console.error("Decrease quantity error:", error);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    try {
      if (item.cartId) {
        await fetch(`${API_URL}/userscarts/${item.cartId}`, {
          method: "DELETE",
        });
      }

      setCart((currentCart) =>
        currentCart.filter((cartItem) => cartItem.id !== productId),
      );
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  const clearCart = async () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        await fetch(`${API_URL}/userscarts/user/${user.id}`, {
          method: "DELETE",
        });
      }

      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const searchText = search.toLowerCase();

      const name = product.name?.toLowerCase() || "";
      const productCategory = product.category?.toLowerCase() || "";
      const specs = product.specs?.toLowerCase() || "";
      const tags = product.tags?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchText) ||
        productCategory.includes(searchText) ||
        specs.includes(searchText) ||
        tags.includes(searchText);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner"></div>
        <p>Loading CyberSage products...</p>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <Navbar />

      <section className="shop-hero">
        <div className="shop-hero-content">
          <p className="shop-eyebrow">CYBERSAGE / COMPONENT STORE</p>

          <h1>
            Build.
            <br />
            Upgrade.
            <br />
            <span>FORTIFY.</span>
          </h1>

          <p className="shop-hero-description">
            High-performance components selected for serious builders. From
            processors and graphics cards to storage, memory and cooling.
          </p>

          <div className="shop-hero-meta">
            <span>01 — COMPONENTS</span>
            <span>RSA DISPATCH</span>
            <span>5 YEAR WARRANTY</span>
          </div>
        </div>

        <div className="shop-hero-visual">
          <div className="hero-glow"></div>

          <div className="hero-product-shape">
            <span>CS</span>
          </div>

          <p className="hero-visual-label">PERFORMANCE / PROTECTION</p>
        </div>
      </section>

      <section className="store-intro shop-reveal">
        <div>
          <p className="section-number">01 / SHOP</p>

          <h2>
            Hardware
            <br />
            without compromise.
          </h2>
        </div>

        <div className="store-intro-right">
          <p>
            Browse our selection of PC components. Every product is chosen
            around reliability, performance and long-term stability.
          </p>

          <div className="store-stats">
            <div>
              <strong>{products.length}+</strong>
              <span>PRODUCTS</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>ONLINE STORE</span>
            </div>

            <div>
              <strong>RSA</strong>
              <span>DISPATCH</span>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-toolbar shop-reveal">
        <div className="toolbar-left">
          <p>EXPLORE COMPONENTS</p>

          <CategoryBar
            products={products}
            category={category}
            setCategory={setCategory}
          />
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && <button onClick={() => setSearch("")}>×</button>}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">SORT BY</option>
            <option value="price-low">PRICE: LOW → HIGH</option>
            <option value="price-high">PRICE: HIGH → LOW</option>
            <option value="name">NAME</option>
          </select>
        </div>
      </section>

      <section className="products-section">
        <div className="products-heading shop-reveal">
          <div>
            <span>CYBERSAGE STORE</span>

            <h2>{category === "All" ? "All Components" : category}</h2>
          </div>

          <p>{filteredProducts.length} products</p>
        </div>

        {filteredProducts.length > 0 ? (
          <main className="product-grid">
            {filteredProducts.map((product, index) => (
              <div
                className="product-reveal"
                key={product.id}
                style={{
                  "--delay": `${index * 70}ms`,
                }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </main>
        ) : (
          <div className="no-products">
            <div className="no-products-icon">/</div>

            <h2>No components found.</h2>

            <p>Try another search or category.</p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </section>

      <section className="shop-banner shop-reveal">
        <div className="banner-content">
          <p>CYBERSAGE / PERFORMANCE</p>

          <h2>
            Your next build
            <br />
            starts here.
          </h2>

          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            EXPLORE COMPONENTS →
          </button>
        </div>

        <div className="banner-decoration">
          <span>CS</span>
        </div>
      </section>

      {cartOpen && (
        <Cart
          cart={cart}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          onClose={() => setCartOpen(false)}
        />
      )}

      <button className="floating-cart" onClick={() => setCartOpen(true)}>
        <span>Cart</span>
        <strong>{cartCount}</strong>
      </button>
    </div>
  );
}

export default Shop;

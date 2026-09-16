import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductInfo.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openSection, setOpenSection] = useState("specs");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/webproducts`);

        if (!response.ok) {
          throw new Error("Could not load products");
        }

        const data = await response.json();

        const formattedProducts = data.map((item) => ({
          ...item,
          id: item.id || item._id,
        }));

        const selectedProduct = formattedProducts.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedProduct) {
          throw new Error("Product not found");
        }

        setProduct(selectedProduct);

        const related = formattedProducts
          .filter(
            (item) =>
              String(item.id) !== String(selectedProduct.id) &&
              item.category === selectedProduct.category
          )
          .slice(0, 3);

        setRelatedProducts(related);
      } catch (err) {
        console.error("Product error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getSpecs = () => {
    if (!product?.specs) return [];

    return product.specs
      .split("|")
      .map((spec) => spec.trim())
      .filter(Boolean);
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "/assets/parts/placeholder.jpg";
    }

    const markdownMatch = image.match(/\((.*?)\)/);

    if (markdownMatch) {
      return markdownMatch[1];
    }

    return image;
  };

  const formatPrice = (price) => {
    const number = Number(price);

    if (Number.isNaN(number)) {
      return price;
    }

    return `R${number.toLocaleString("en-ZA")}`;
  };

  const addToCart = () => {
    if (!product) return;

    try {
      const savedCart = localStorage.getItem("cybersageCart");

      const cart = savedCart ? JSON.parse(savedCart) : [];

      const existingProduct = cart.find(
        (item) =>
          String(item.id || item._id) ===
          String(product.id || product._id)
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) => {
          const itemId = item.id || item._id;

          if (
            String(itemId) ===
            String(product.id || product._id)
          ) {
            const currentQuantity = Number(item.quantity || 1);
            const stock = Number(product.stock || 0);

            const newQuantity =
              stock > 0
                ? Math.min(currentQuantity + 1, stock)
                : currentQuantity + 1;

            return {
              ...item,
              quantity: newQuantity,
            };
          }

          return item;
        });
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            id: product.id || product._id,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cybersageCart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      alert(`${product.name} added to your cart.`);
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? "" : section
    );
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="product-loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-error">
        <h2>Product Not Found</h2>

        <p>
          {error || "This product does not exist."}
        </p>

        <button onClick={() => navigate("/Shop")}>
          Back To Shop
        </button>
      </div>
    );
  }

  const specs = getSpecs();

  return (
    <div className="product-page">
      <main className="product-main">
        <section className="product-image-section">
          <div className="product-image-container">
            <span className="product-category">
              {product.category || "PC COMPONENT"}
            </span>

            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="product-main-image"
            />

            <div className="image-number">
              <span>01</span>
              <span className="image-line"></span>
              <span>01</span>
            </div>
          </div>
        </section>

        <section className="product-information">
          <div className="product-top">
            <div>
              <p className="product-eyebrow">
                CYBERSAGE /{" "}
                {product.category || "COMPONENT"}
              </p>

              <h1>{product.name}</h1>
            </div>

            <strong className="product-price">
              {formatPrice(product.price)}
            </strong>
          </div>

          <p className="product-description">
            {product.description ||
              `Premium ${
                product.category || "PC component"
              } designed for reliable performance, stability and long-term use.`}
          </p>

          <div className="product-stock">
            <span
              className={
                Number(product.stock) > 0
                  ? "stock-dot available"
                  : "stock-dot unavailable"
              }
            ></span>

            {Number(product.stock) > 0
              ? `${product.stock} units available`
              : "Out of stock"}
          </div>

          <button
            className="product-add-button"
            onClick={addToCart}
            disabled={
              !product.stock ||
              Number(product.stock) <= 0
            }
          >
            {Number(product.stock) > 0
              ? "ADD TO CART"
              : "OUT OF STOCK"}

            <span>→</span>
          </button>

          <div className="product-details">
            <div className="detail-section">
              <button
                className="detail-header"
                onClick={() =>
                  toggleSection("specs")
                }
              >
                <span>PRODUCT SPECIFICATIONS</span>

                <span>
                  {openSection === "specs"
                    ? "−"
                    : "+"}
                </span>
              </button>

              {openSection === "specs" && (
                <div className="detail-content specs-content">
                  {specs.length > 0 ? (
                    specs.map((spec, index) => {
                      const parts = spec.split(":");

                      return (
                        <div
                          className="spec-row"
                          key={index}
                        >
                          <span>
                            {parts[0]?.trim()}
                          </span>

                          <strong>
                            {parts
                              .slice(1)
                              .join(":")
                              .trim()}
                          </strong>
                        </div>
                      );
                    })
                  ) : (
                    <p>
                      No additional specifications
                      available.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="detail-section">
              <button
                className="detail-header"
                onClick={() =>
                  toggleSection("category")
                }
              >
                <span>CATEGORY</span>

                <span>
                  {openSection === "category"
                    ? "−"
                    : "+"}
                </span>
              </button>

              {openSection === "category" && (
                <div className="detail-content">
                  <p>
                    {product.category ||
                      "PC Component"}
                  </p>
                </div>
              )}
            </div>

            <div className="detail-section">
              <button
                className="detail-header"
                onClick={() =>
                  toggleSection("tags")
                }
              >
                <span>PRODUCT TAGS</span>

                <span>
                  {openSection === "tags"
                    ? "−"
                    : "+"}
                </span>
              </button>

              {openSection === "tags" && (
                <div className="detail-content">
                  <div className="product-tags">
                    {product.tags ? (
                      product.tags
                        .split(",")
                        .map((tag, index) => (
                          <span key={index}>
                            {tag.trim()}
                          </span>
                        ))
                    ) : (
                      <span>CyberSage</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="detail-section">
              <button
                className="detail-header"
                onClick={() =>
                  toggleSection("delivery")
                }
              >
                <span>
                  PAYMENT & DELIVERY
                </span>

                <span>
                  {openSection === "delivery"
                    ? "−"
                    : "+"}
                </span>
              </button>

              {openSection === "delivery" && (
                <div className="detail-content">
                  <p>
                    Secure checkout and reliable
                    delivery across South Africa.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <section className="product-feature">
        <div className="feature-image">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
          />
        </div>

        <div className="feature-information">
          <p className="feature-label">
            WHY CYBERSAGE
          </p>

          <h2>
            Built for
            <br />
            <span>performance.</span>
          </h2>

          <p>
            Every component in the CyberSage store
            is selected with performance, stability
            and reliability in mind.
          </p>

          <div className="feature-list">
            <div>
              <strong>01</strong>
              <span>Performance tested</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Reliable components</span>
            </div>

            <div>
              <strong>03</strong>
              <span>
                Built for demanding workloads
              </span>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-heading">
            <p>COMPLETE YOUR BUILD</p>

            <h2>
              You may also
              <span> like.</span>
            </h2>
          </div>

          <div className="related-grid">
            {relatedProducts.map((item) => (
              <article
                className="related-card"
                key={item.id}
                onClick={() =>
                  navigate(
                    `/product/${item.id}`
                  )
                }
              >
                <div className="related-image">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                  />
                </div>

                <div className="related-info">
                  <div>
                    <p>{item.category}</p>

                    <h3>{item.name}</h3>
                  </div>

                  <strong>
                    {formatPrice(item.price)}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductInfo;
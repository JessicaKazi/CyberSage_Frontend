import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    const number = Number(price);

    if (Number.isNaN(number)) {
      return price;
    }

    return `R${number.toLocaleString("en-ZA")}`;
  };

  const openProduct = () => {
    if (!product?.id) {
      console.error("Product has no id:", product);
      return;
    }

    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <article className="product-card" onClick={openProduct}>
      <div className="product-card-image">
        <img
          src={product.image}
          alt={product.name || "Product"}
          onError={(event) => {
            event.currentTarget.src =
              "/assets/parts/placeholder.jpg";
          }}
        />

        {Number(product.stock) <= 0 && (
          <span className="out-of-stock">
            OUT OF STOCK
          </span>
        )}
      </div>

      <div className="product-card-content">
        <div>
          <p className="product-card-category">
            {product.category}
          </p>

          <h3>{product.name}</h3>

          <p className="product-card-specs">
            {product.specs}
          </p>
        </div>

        <div className="product-card-bottom">
          <strong>{formatPrice(product.price)}</strong>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={Number(product.stock) <= 0}
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
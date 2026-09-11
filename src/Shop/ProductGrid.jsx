import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products }) {

    console.log("Products received by ProductGrid:", products);

    if (!products || products.length === 0) {
        return (
            <div className="no-products">
                <h2>No products found</h2>
                <p>
                    There are currently no products to display.
                </p>
            </div>
        );
    }

    return (
        <section className="product-grid">

            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}

        </section>
    );
}

export default ProductGrid;
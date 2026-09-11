import "./CategoryBar.css";

function CategoryBar({
    products,
    category,
    setCategory
}) {

    const categories = [
        "All",
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ];

    return (
        <div className="category-bar">

            {categories.map(item => (

                <button
                    key={item}
                    className={
                        category === item
                            ? "category active"
                            : "category"
                    }
                    onClick={() =>
                        setCategory(item)
                    }
                >
                    {item}
                </button>

            ))}

        </div>
    );
}

export default CategoryBar;
import "./SearchBar.css";

function SearchBar({ search, setSearch }) {

    return (
        <div className="search-bar">

            <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
            />

        </div>
    );
}

export default SearchBar;
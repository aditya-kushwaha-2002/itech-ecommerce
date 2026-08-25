import { getAllProducts, getCategories } from "../services/productService";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
    getCategories()
      .then((response) => setCategories(response.data))
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(search);

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = products
    .filter((product) => !category || String(product.categoryId) === category)
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });
  const submitSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    fetchProducts();
  };

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="products-page">

      <div className="product-search">
        <div className="products-header">
          <h1>All Products</h1>

          <p>Explore our latest technology</p>
        </div> 

        <div>
          <form className="catalog-controls" onSubmit={submitSearch}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products or brands"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="">Sort products</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
          <button type="submit">Search</button>
        </form>
        
      </div>


      </div>
      

      <div className="products-container">
        {visibleProducts.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
        {!visibleProducts.length && (
          <p className="catalogue-note">No products match your search.</p>
        )}
      </div>
    </div>
  );
};

export default Products;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const Home = () => {

  const [products, setProducts] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const [previousImage, setPreviousImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroImages = [
    "/src/assets/hero_img.jpg",
    "/src/assets/hero_img2.jpg",
    "/src/assets/hero_img3.jpg"
  ];


  useEffect(() => {
    getAllProducts()
      .then((r) => setProducts(r.data.slice(0, 8)))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {

    const interval = setInterval(() => {
      setPreviousImage(currentImage);
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
      setIsTransitioning(true);
      window.setTimeout(() => setIsTransitioning(false), 900);
    }, 4200);

    return () => clearInterval(interval);

  }, [currentImage, heroImages.length]);


  return (
    <div className="home">
      {/* Hero Section */}

      <section className="hero">
        <div className="hero-image hero-image-current" style={{ backgroundImage: `url(${heroImages[currentImage]})` }} />
        {previousImage !== null && <div className={`hero-image hero-image-previous ${isTransitioning ? "is-visible" : ""}`} style={{ backgroundImage: `url(${heroImages[previousImage]})` }} />}

        <div className="hero-content">
          <p className="hero-small">THE FUTURE IS HERE</p>

          <h1>Experience <br /> The <span style={{color: '#263a65', letterSpacing: '-2px'}}>Future</span></h1>

          <p>Discover premium electronics designed <br /> for your everyday life.</p>

          <Link to="/products" className="shop-button">
            Shop Now
          </Link>
          {/* <Link to="/signup" className="hero-secondary">
            Create free account
          </Link> */}
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <strong>Genuine products</strong>
          <span>Carefully selected technology</span>
        </div>
        <div>
          <strong>Secure checkout</strong>
          <span>COD and online payment</span>
        </div>
        <div>
          <strong>Stock aware orders</strong>
          <span>Real time inventory validation</span>
        </div>
      </section>

      <section className="spotlight-section">
        <div className="section-heading">
          <div>
            <p>CURATED FOR YOU</p>
            <h2>Make the everyday extraordinary.</h2>
          </div>
          <Link to="/products">See all products →</Link>
        </div>
            
        <div className="spotlight-track">
          {products.length ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="catalogue-note">
              Products will appear here when your catalogue is ready.
            </p>
          )}
        </div>
      </section>

      {/* Categories */}

      <section className="categories-section">
        <h2>Shop by Category</h2>

        <div className="categories">
          <div className="category-card">
            <span>01</span>
            <h3>Smartphones</h3>
            <p>Latest smartphones</p>
          </div>

          <div className="category-card">
            <span>02</span>
            <h3>Laptops</h3>
            <p>Powerful laptops</p>
          </div>

          <div className="category-card">
            <span>03</span>
            <h3>Headphones</h3>
            <p>Immersive audio</p>
          </div>

          <div className="category-card">
            <span>04</span>
            <h3>Smart Watches</h3>
            <p>Stay Connected</p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <p>READY WHEN YOU ARE</p>
        <h2>Find technology that fits your life.</h2>
        <Link to="/products">Explore the collection →</Link>
      </section>
    </div>
  );
};

export default Home;

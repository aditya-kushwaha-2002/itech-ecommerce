import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>

        <h2 className="product-name">{product.name}</h2>

        <p className="product-category">{product.categoryName}</p>

        <div className="product-bottom">
          <h3>₹{product.price}</h3>

          {product.discount > 0 && (
            <span className="discount">{product.discount}% OFF</span>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

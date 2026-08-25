import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductById,
  getProductVariants,
  getInventoryByVariant,
  addToCart,
  getOrCreateCartId,
} from "../services/productService";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [inventory, setInventory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!selectedColor || !selectedStorage) {
      setSelectedVariant(null);
      return;
    }

    const variant = variants.find(
      (variant) =>
        variant.color === selectedColor && variant.storage === selectedStorage,
    );

    setSelectedVariant(variant || null);
  }, [selectedColor, selectedStorage, variants]);

  const compatibleStorages = [
    ...new Set(
      variants
        .filter((variant) => !selectedColor || variant.color === selectedColor)
        .map((variant) => variant.storage),
    ),
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      if (!selectedVariant) {
        setInventory(null);
        return;
      }

      try {
        const response = await getInventoryByVariant(selectedVariant.id);

        setInventory(response.data);
      } catch (error) {
        console.error("Inventory Error: ", error);
        setInventory(null);
      }
    };

    fetchInventory();
  }, [selectedVariant]);

  const fetchProduct = async () => {
    try {
      // Get Products
      const response = await getProductById(id);

      setProduct(response.data);

      // Get Variants

      const variantResponse = await getProductVariants(id);

      setVariants(variantResponse.data);
      if (variantResponse.data.length > 0) {
        setSelectedColor(variantResponse.data[0].color);
        setSelectedStorage(variantResponse.data[0].storage);
      }
    } catch (error) {
      console.error(error);

      setError("Unable to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setMessage("Please choose an available color and storage combination.");
      return;
    }

    try {
      const cartId = await getOrCreateCartId();
      const response = await addToCart(
        cartId,
        selectedVariant.id,
        selectedQuantity,
      );

      setMessage("Added to your cart.");
    } catch (error) {
      console.error("Add to Cart Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to add this item to your cart.",
      );
    }
  };

  if (loading) {
    return <h2 className="details-message">Loading product...</h2>;
  }

  if (error) {
    return <h2 className="details-message">{error}</h2>;
  }

  if (!product) {
    return <h2 className="details-message"> Product not found</h2>;
  }

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details">
        {/* Product Image */}

        <div className="details-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>

        {/* Product Information */}

        <div className="details-info">
          <p className="details-brand">{product.brand}</p>

          <h1>{product.name}</h1>

          <p className="details-category">{product.categoryName}</p>

          <p className="details-description">{product.description}</p>

          {/* Product Variants-------------------- */}

          {variants.length > 0 && (
            <div className="variant-section">
              <h3>Color</h3>

              <div className="variant-options">
                {[...new Set(variants.map((variant) => variant.color))].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        const first = variants.find(
                          (variant) => variant.color === color,
                        );
                        if (
                          first &&
                          !variants.some(
                            (variant) =>
                              variant.color === color &&
                              variant.storage === selectedStorage,
                          )
                        )
                          setSelectedStorage(first.storage);
                      }}
                      className={
                        selectedColor === color ? "variant-selected" : ""
                      }
                    >
                      {color}
                    </button>
                  ),
                )}
              </div>

              <h3>Storage</h3>

              <div className="variant-options">
                {[...new Set(variants.map((variant) => variant.storage))].map(
                  (storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      disabled={!compatibleStorages.includes(storage)}
                      className={
                        selectedStorage === storage ? "variant-selected" : ""
                      }
                    >
                      {storage}
                    </button>
                  ),
                )}
              </div>

              {selectedVariant && (
                <p className="selected-variant-info">
                  Selected: {selectedVariant.color} / {selectedVariant.storage}
                </p>
              )}
            </div>
          )}

          <div className="details-price">
            <h2>₹{selectedVariant ? selectedVariant.price : product.price}</h2>

            {product.discount > 0 && <span>{product.discount}% OFF</span>}
          </div>

          {/* ------------------------- Inventory ---------------------- */}

          {selectedVariant && inventory && (
            <p className="stock-info">
              {inventory.available > 0
                ? `Available: ${inventory.available}`
                : "Out of Stock"}
            </p>
          )}

          <div className="quantity-picker">
            <label htmlFor="product-quantity">Quantity</label>
            <input
              id="product-quantity"
              type="number"
              min="1"
              max={inventory?.available || 1}
              value={selectedQuantity}
              onChange={(event) =>
                setSelectedQuantity(
                  Math.max(1, Number(event.target.value) || 1),
                )
              }
            />
          </div>

          <button
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              !inventory ||
              inventory.available <= 0 ||
              selectedQuantity > inventory.available
            }
          >
            {inventory?.available > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
          {message && <p className="stock-info">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

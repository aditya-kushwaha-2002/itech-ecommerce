import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearCart,
  getCartItems,
  getOrCreateCartId,
  removeCartItem,
  updateCartItem,
} from "../services/productService";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null),
    [cartId, setCartId] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(null),
    [message, setMessage] = useState("");
  const loadCart = async (id) => setCart((await getCartItems(id)).data);
  useEffect(() => {
    (async () => {
      try {
        const id = await getOrCreateCartId();
        setCartId(id);
        await loadCart(id);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Unable to load your cart.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const quantity = async (item, next) => {
    if (next < 1 || busy) return;
    setBusy(item.id);
    setMessage("");
    try {
      await updateCartItem(cartId, item.id, next, item.variantId);
      await loadCart(cartId);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to update item quantity.",
      );
    } finally {
      setBusy(null);
    }
  };
  const remove = async (id) => {
    setBusy(id);
    setMessage("");
    try {
      await removeCartItem(cartId, id);
      await loadCart(cartId);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to remove this item.",
      );
    } finally {
      setBusy(null);
    }
  };
  const clear = async () => {
    if (!window.confirm("Clear every item from your cart?")) return;
    setBusy("clear");
    setMessage("");
    try {
      await clearCart(cartId);
      await loadCart(cartId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to clear the cart.");
    } finally {
      setBusy(null);
    }
  };
  if (loading)
    return (
      <main className="cart-page">
        <p className="cart-state">Loading your cart…</p>
      </main>
    );
  const items = cart?.items || [];

  if (!items.length)
    return (
      <main className="cart-page cart-empty">
        <h1>Your cart is empty</h1>
        <p>
          {message ||
            "Browse the latest technology and add something you love."}
        </p>
        <Link className="checkout-button" to="/products">
          Shop products
        </Link>
      </main>
    );
    
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <header className="cart-header">
        <p>YOUR BAG</p>
        <h1>Shopping Cart</h1>
        <span>
          {items.length} variant{items.length === 1 ? "" : "s"} selected
        </span>
      </header>
      <section className="cart-items">
        {message && <p className="cart-feedback">{message}</p>}
        {items.map((item) => (
          <article className="cart-item-card" key={item.id}>
            <div className="cart-image-wrap">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>iTech</span>
              )}
            </div>
            <div className="cart-item-details">
              <p className="cart-brand">{item.brand || "iTech"}</p>
              <h2>{item.productName || "Product variant"}</h2>
              <p className="cart-variant">
                {item.color} <i /> {item.storage}
              </p>
              <strong className="cart-price">₹{item.price}</strong>
              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => quantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1 || busy === item.id}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => quantity(item, item.quantity + 1)}
                    disabled={busy === item.id}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-item"
                  onClick={() => remove(item.id)}
                  disabled={busy === item.id}
                >
                  {busy === item.id ? "Updating…" : "Remove"}
                </button>
              </div>
            </div>
            <strong className="cart-line-total">
              ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
            </strong>
          </article>
        ))}
      </section>
      <aside className="cart-summary">
        <p className="summary-label">ORDER SUMMARY</p>
        <div>
          <span>Subtotal</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary-total">
          <span>Order total</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>
        <Link className="checkout-button" to="/checkout">
          Proceed to Checkout
        </Link>
        <button
          type="button"
          className="clear-button"
          onClick={clear}
          disabled={busy === "clear"}
        >
          {busy === "clear" ? "Clearing…" : "Clear cart"}
        </button>
      </aside>
    </main>
  );
};
export default Cart;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getOrderById } from "../services/productService";
import "./MyOrders.css";
import "./OrderSuccess.css";
import "./OrderProductImages.css";
import "./OrderSuccessProductImages.css";
import "./CustomerNavbar.css";

const status = (value) =>
  value
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Will be updated soon";

export default function OrderSuccess() {
  const { orderId } = useParams(),
    location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null),
    [error, setError] = useState("");
  const session = JSON.parse(localStorage.getItem("itechSession") || "null");
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this order.");
      }
    };
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, [orderId]);
  if (error) return <h2 className="order-message">{error}</h2>;
  if (!order) return <h2 className="order-message">Loading order...</h2>;
  return (
    <main className="customer-shell">
      <header className="customer-topbar">
        <Link className="shop-brand" to="/">
          <i>▢</i> iTech<span>Store</span>
        </Link>
        <div className="customer-user">
          <b>{session?.name?.charAt(0)?.toUpperCase() || "U"}</b>
          <span>{session?.name || "My account"}</span>
          <i>⌄</i>
        </div>
      </header>
      <aside className="customer-sidebar">
        <Link to="/">
          ⌂ <span>Home</span>
        </Link>
        <Link to="/products">
          ▦ <span>Categories</span>
        </Link>
        <Link to="/profile">
          ♙ <span>My account</span>
        </Link>
        <Link className="selected" to="/orders">
          ▣ <span>My orders</span>
        </Link>
        <Link to="/profile">
          ♧ <span>Addresses</span>
        </Link>
      </aside>
      <section className="customer-content order-detail">
        <Link className="back-orders" to="/orders">
          ← Back to my orders
        </Link>
        <div className="success-banner">
          <i>{order.status === "CANCELLED" ? "!" : "✓"}</i>
          <div>
            <h1>
              {order.status === "PLACED"
                ? "Order placed successfully!"
                : `Order ${status(order.status)}`}
            </h1>
            <p>
              Order #{order.id} · Placed on {date(order.createdAt)}
            </p>
          </div>
          <Link to="/products">Continue shopping</Link>
        </div>
        <div className="detail-grid">
          <section className="detail-card">
            <div className="detail-title">
              <h2>Order items</h2>
              <span>
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            {order.items.map((item) => (
              <article className="detail-item" key={item.id}>
                <div className="detail-product-tile">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName || "Product"}
                    />
                  ) : (
                    (item.productName || "i").slice(0, 1)
                  )}
                </div>
                <div>
                  <strong>{item.productName || "Product"}</strong>
                  <p>
                    {[item.brand, item.color, item.storage]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                  <span>
                    {money(item.price)} × {item.quantity}
                  </span>
                </div>
                <b>{money(Number(item.price) * Number(item.quantity))}</b>
              </article>
            ))}
            <div className="detail-total">
              <span>Total paid</span>
              <strong>{money(order.totalAmount)}</strong>
            </div>
          </section>
          <aside className="detail-side">
            <section className="detail-card">
              <h2>Order status</h2>
              <div
                className={`large-status status-${order.status.toLowerCase()}`}
              >
                {status(order.status)}
              </div>
              <p className="status-copy">
                Payment: <strong>{status(order.paymentStatus)}</strong> ·{" "}
                {order.paymentMethod}
              </p>
            </section>
            <section className="detail-card">
              <h2>Delivery address</h2>
              <strong>{order.shippingName}</strong>
              <p>
                {[
                  order.shippingAddressLine1,
                  order.shippingAddressLine2,
                  order.shippingCity,
                  order.shippingState,
                  order.shippingPostalCode,
                  order.shippingCountry,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>{order.shippingPhone}</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

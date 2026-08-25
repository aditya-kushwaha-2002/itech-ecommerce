import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cancelOrder, getMyOrders } from "../services/productService";
import "./MyOrders.css";
import "./OrderProductImages.css";
import "./CustomerNavbar.css";

const status = (value) =>

  value
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const date = (value) =>

  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Processing";

const money = (value) =>

  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function MyOrders() {

  const [orders, setOrders] = useState([]),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [tab, setTab] = useState("ALL");

  const session = JSON.parse(localStorage.getItem("itechSession") || "null");

  useEffect(() => {

    const load = () =>
      getMyOrders()
        .then((res) => {
          setOrders(res.data);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to load your orders.");
        });

    load();

    const timer = window.setInterval(load, 15000);

    return () => window.clearInterval(timer);

  }, []);

  const visible = useMemo(
    () =>
      orders.filter(
        (order) =>
          tab === "ALL" ||
          (tab === "PROCESSING"
            ? ["PLACED", "CONFIRMED"].includes(order.status)
            : order.status === tab),
      ),
    [orders, tab],
  );

  const cancel = async (event, id) => {

    event.preventDefault();

    try {

      const res = await cancelOrder(id);

      setOrders((current) =>
        current.map((order) => (order.id === id ? res.data : order)),
      );

      setMessage(`Order #${id} cancelled and stock restored.`);

    } catch (err) {

      setMessage(
        err.response?.data?.message || "This order cannot be cancelled.",
      );

    }
  };

  if (error) return <h2 className="orders-message">{error}</h2>;

  const tabs = [
    ["ALL", "All orders"],
    ["PROCESSING", "Processing"],
    ["SHIPPED", "Shipped"],
    ["DELIVERED", "Delivered"],
    ["CANCELLED", "Cancelled"],
  ];

  return (
    <main className="customer-shell">
      <aside className="customer-sidebar">

        <Link to="/">
          ⌂ <span><b>Home</b></span>
        </Link>

        <Link to="/products">
          ▦ <span><b>Categories</b></span>
        </Link>

        <Link to="/profile">
          ♙ <span><b>My account</b></span>
        </Link>

        <Link className="selected" to="/orders">
          ▣ <span><b>My orders</b></span>
        </Link>

        <Link to="/profile">
          ♧ <span><b>Addresses</b></span>
        </Link>

      </aside>

      <section className="customer-content">

        <h1>My Orders</h1>

        {message && (
          <p className="orders-feedback">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </p>
        )}

        <div className="order-tabs">

          {tabs.map(([value, label]) => (
            <button
              className={tab === value ? "active" : ""}
              key={value}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}

        </div>

        {visible.length === 0 ? (

          <div className="orders-empty">

            <strong>
              No{" "}
              {tab === "ALL" ? "orders" : status(tab).toLowerCase() + " orders"}{" "}
              yet
            </strong>

            <p>Your placed orders will show up here.</p>

            <Link to="/products">Explore products</Link>

          </div>

        ) : (

          <div className="my-orders-list">

            {visible.map((order) => {
              const item = order.items[0] || {};
              return (
                <article className="my-order-card" key={order.id}>

                  <div className="order-product-tile">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName || "Product"}
                      />
                    ) : (
                      (item.productName || "i").slice(0, 1)
                    )}
                  </div>

                  <div className="order-main">

                    <span className="order-number">Order ID: #{order.id}</span>

                    <strong>{item.productName || "Your iTech order"}</strong>

                    <p>
                      {[item.brand, item.color, item.storage]
                        .filter(Boolean)
                        .join(" | ") || "Product details"}
                    </p>

                    <b>
                      {money(order.totalAmount)} <i>•</i>{" "}

                      <small>
                        Qty:{" "}
                        {order.items.reduce(
                          (total, x) => total + Number(x.quantity || 0),
                          0,
                        )}
                      </small>

                    </b>

                  </div>

                  <div className="order-date">

                    <span>Order date</span>

                    <strong>{date(order.createdAt)}</strong>

                    <span>Payment</span>

                    <strong>{status(order.paymentStatus)}</strong>

                  </div>

                  <div className="order-status">

                    <span>Status</span>

                    <strong className={`status-${order.status.toLowerCase()}`}>

                      {status(order.status)}

                    </strong>

                    <Link to={`/orders/${order.id}`}>View details</Link>

                    {order.status === "PLACED" && (
                      <button onClick={(event) => cancel(event, order.id)}>
                        Cancel order
                      </button>
                    )}

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>
    </main>
  );
}

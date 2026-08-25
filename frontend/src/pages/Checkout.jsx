import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createOrder,
  getCartItems,
  getOrCreateCartId,
  getMyProfile,
  updateMyProfile,
} from "../services/productService";
import "./Checkout.css";
import Navbar from "../components/Navbar";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const addressFields = [
  ["name", "Full name", "Your full name"],
  ["addressLine1", "Address", "House no., street, area"],
  ["city", "City", "City"],
  ["state", "State", "State"],
  ["postalCode", "PIN code", "PIN code"],
  ["country", "Country", "Country"],
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null),
    [cartId, setCartId] = useState(null),
    [profile, setProfile] = useState(null),
    [loading, setLoading] = useState(true),
    [placingOrder, setPlacingOrder] = useState(false),
    [error, setError] = useState(""),
    [paymentMethod, setPaymentMethod] = useState("COD");
  useEffect(() => {
    const load = async () => {
      try {
        const id = await getOrCreateCartId();
        const [cartRes, profileRes] = await Promise.all([
          getCartItems(id),
          getMyProfile(),
        ]);
        setCartId(id);
        setCart(cartRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load checkout details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const update = (name, value) =>
    setProfile((current) => ({ ...current, [name]: value }));
  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );
  const valid =
    profile &&
    [
      "name",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ].every((key) => profile[key]?.trim());
  const placeOrder = async () => {
    if (!valid) {
      setError("Please complete your contact and delivery details.");
      return;
    }
    if (
      paymentMethod === "ONLINE" &&
      !window.confirm(`Demo payment: confirm payment of ${money(total)}?`)
    )
      return;
    try {
      setPlacingOrder(true);
      setError("");
      await updateMyProfile(profile);
      const response = await createOrder(cartId, paymentMethod);
      navigate(`/orders/${response.data.id}`, {
        state: { order: response.data },
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };
  if (loading) return <h2 className="checkout-message">Loading checkout…</h2>;
  if (!profile)
    return (
      <h2 className="checkout-message">
        {error || "Unable to load checkout."}
      </h2>
    );

  return (
    <main className="checkout-shell">

      <Navbar />

      <div className="checkout-layout">
        <section className="checkout-forms">
          <section className="checkout-card">
            <h1>Contact information</h1>
            <Field
              label="Email address"
              icon="✉"
              value={profile.email || ""}
              disabled
            />
            <Field
              label="Phone number"
              icon="⌕"
              value={profile.phone || ""}
              onChange={(value) => update("phone", value)}
              placeholder="Your phone number"
            />
          </section>
          <section className="checkout-card">
            <h2>Shipping address</h2>
            {addressFields.slice(0, 2).map(([name, label, placeholder]) => (
              <Field
                key={name}
                label={label}
                icon={name === "name" ? "♙" : "⌖"}
                value={profile[name] || ""}
                onChange={(value) => update(name, value)}
                placeholder={placeholder}
              />
            ))}
            <div className="checkout-address-grid">
              {addressFields.slice(2, 5).map(([name, label, placeholder]) => (
                <Field
                  key={name}
                  label={label}
                  value={profile[name] || ""}
                  onChange={(value) => update(name, value)}
                  placeholder={placeholder}
                />
              ))}
            </div>
            <Field
              label="Country"
              value={profile.country || ""}
              onChange={(value) => update("country", value)}
              placeholder="Country"
            />
          </section>
          <section className="checkout-card">
            <h2>Payment method</h2>
            <label
              className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
            >
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>▣</span>
              <div>
                <strong>Cash on delivery</strong>
                <small>Pay when you receive your order</small>
              </div>
            </label>
            <label
              className={`payment-option ${paymentMethod === "ONLINE" ? "selected" : ""}`}
            >
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              <span>▤</span>
              <div>
                <strong>Online payment</strong>
                <small>
                  Pay securely using UPI, cards, net banking or wallet
                </small>
              </div>
            </label>
          </section>
        </section>
        <aside className="checkout-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <article className="checkout-item" key={item.id}>
              <div className="checkout-product-image">
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
                <strong>
                  {item.productName || `${item.color} ${item.storage}`}
                </strong>
                <small>
                  {[item.color, item.storage].filter(Boolean).join(" | ")} ·
                  Qty: {item.quantity}
                </small>
              </div>
              <b>{money(Number(item.price) * Number(item.quantity))}</b>
            </article>
          ))}
          {items.length === 0 && (
            <p className="checkout-empty">Your cart is empty.</p>
          )}
          <div className="summary-lines">
            <p>
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </p>
            <p>
              <span>Shipping</span>
              <b className="free">Free</b>
            </p>
          </div>
          <div className="summary-total">
            <div>
              <strong>Total</strong>
              <small>Inclusive of all taxes</small>
            </div>
            <b>{money(total)}</b>
          </div>
          {error && <p className="checkout-error">{error}</p>}
          <button onClick={placeOrder} disabled={placingOrder || !items.length}>
            {placingOrder ? "Placing order…" : "Place order"}
          </button>
          <p className="checkout-safe">♢ &nbsp; Your data is safe and secure</p>
        </aside>
      </div>
    </main>
  );
}
function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <label className="checkout-field">
      {label}
      <div>
        {icon && <span>{icon}</span>}
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

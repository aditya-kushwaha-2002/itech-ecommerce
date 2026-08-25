import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AccountMenu.css";

export default function AccountMenu({ compact = false }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("itechSession") || "null"),
  );
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const sync = () =>
      setSession(JSON.parse(localStorage.getItem("itechSession") || "null"));
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);
  useEffect(() => {
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const logout = () => {
    localStorage.removeItem("itechSession");
    window.dispatchEvent(new Event("authchange"));
    navigate("/");
  };
  if (!session)
    return (
      <Link className="login-link" to="/login">
        Login
      </Link>
    );
  return (
    <div
      className={`profile-menu shared-profile-menu ${compact ? "compact" : ""}`}
      ref={ref}
    >
      <button
        className="avatar-button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open profile menu"
      >
        {session.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
      </button>
      {open && (
        <div className="profile-dropdown">
          <strong>{session.name}</strong>
          <span>{session.email}</span>
          <Link to="/profile" onClick={() => setOpen(false)}>
            My profile
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)}>
            My cart
          </Link>
          <Link to="/orders" onClick={() => setOpen(false)}>
            My orders
          </Link>
          {session.role === "ADMIN" && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin dashboard
            </Link>
          )}
          <button onClick={logout}>Log out</button>
        </div>
      )}
    </div>
  );
}

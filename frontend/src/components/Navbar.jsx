import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import "./Navbar.css";

export default function Navbar() {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("itechSession") || "null"),
  );
  useEffect(() => {
    const sync = () =>
      setSession(JSON.parse(localStorage.getItem("itechSession") || "null"));
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        iTech
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Product</Link>
        <Link to="/cart">Cart</Link>
        {session?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
      </div>
      <div className="nav-actions">
        <AccountMenu />
      </div>
    </nav>
  );
}

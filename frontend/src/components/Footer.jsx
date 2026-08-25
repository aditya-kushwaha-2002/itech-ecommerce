import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-grid">
      <div>
        <Link to="/" className="footer-logo">
          iTech
        </Link>
        <p>Thoughtfully chosen technology for everyday life.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <Link to="/products">All products</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div>
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/signup">Create account</Link>
      </div>
      <div>
        <h4>Support</h4>
        <a href="mailto:support@itech.local">Contact support</a>
        <span>Secure checkout</span>
      </div>
    </div>
    <div className="footer-bottom">
      © {new Date().getFullYear()} iTech. Built for better everyday technology.
    </div>
  </footer>
);
export default Footer;

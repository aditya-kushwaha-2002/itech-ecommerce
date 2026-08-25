import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../services/productService";
import "./Auth.css";
const Auth = ({ mode }) => {
  const navigate = useNavigate(),
    [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [error, setError] = useState(""),
    [submitting, setSubmitting] = useState(false),
    isSignup = mode === "signup";
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await (isSignup ? signup(form) : login(form));
      localStorage.setItem("itechSession", JSON.stringify(r.data));
      window.dispatchEvent(new Event("authchange"));
      navigate(r.data.role === "ADMIN" ? "/admin" : "/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Authentication failed",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>{isSignup ? "Create account" : "Welcome back"}</h1>
        {isSignup && (
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength="8"
          required
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            minLength="8"
            required
          />
        )}
        <button disabled={submitting}>
          {submitting ? "Please wait…" : isSignup ? "Sign up" : "Login"}
        </button>
        {error && <p className="auth-error">{error}</p>}
        <p>
          {isSignup ? "Already registered?" : "New to iTech?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Create an account"}
          </Link>
        </p>
      </form>
    </main>
  );
};
export default Auth;

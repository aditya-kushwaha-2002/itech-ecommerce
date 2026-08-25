import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/productService";
import "./Profile.css";

const fields = [
  ["name", "Full name"],
  ["phone", "Phone number"],
  ["addressLine1", "Address line 1"],
  ["addressLine2", "Address line 2 (optional)"],
  ["city", "City"],
  ["state", "State"],
  ["postalCode", "PIN / postal code"],
  ["country", "Country"],
];
const Profile = () => {
  const navigate = useNavigate(),
    [profile, setProfile] = useState(null),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    getMyProfile()
      .then((r) => setProfile(r.data))
      .catch(() => navigate("/login"));
  }, [navigate]);
  const update = (key, value) =>
    setProfile((current) => ({ ...current, [key]: value }));
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const r = await updateMyProfile(profile);
      setProfile(r.data);
      const s = JSON.parse(localStorage.getItem("itechSession") || "{}");
      localStorage.setItem(
        "itechSession",
        JSON.stringify({ ...s, name: r.data.name }),
      );
      window.dispatchEvent(new Event("authchange"));
      setMessage("Profile and delivery address saved.");
    } catch {
      setMessage("Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };
  if (!profile)
    return <h2 className="profile-message">Loading your profile...</h2>;
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">{profile.name?.[0]?.toUpperCase()}</div>
        <div>
          <p>YOUR ACCOUNT</p>
          <h1>{profile.name}</h1>
          <span>{profile.email}</span>
        </div>
      </section>
      <div className="profile-layout">
        <form className="profile-card" onSubmit={save}>
          <div className="profile-card-title">
            <div>
              <p>PERSONAL & DELIVERY DETAILS</p>
              <h2>Profile</h2>
            </div>
            <span className="verified-chip">Verified account</span>
          </div>
          <div className="profile-form">
            {fields.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={profile[key] || ""}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={label}
                />
              </label>
            ))}
          </div>
          <button disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {message && <p className="profile-feedback">{message}</p>}
        </form>
        <aside className="profile-side">
          <h3>Quick links</h3>
          <Link to="/cart">View cart</Link>
          <Link to="/products">Continue shopping</Link>
          <p>
            Your address is used to prepare your delivery. You can update it
            anytime.
          </p>
        </aside>
      </div>
    </main>
  );
};
export default Profile;

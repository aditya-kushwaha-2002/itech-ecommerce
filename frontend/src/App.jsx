import React from "react";
import "./App.css"
import "./HomeStyleTheme.css";
import Products from "./pages/Products";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from "./components/ProtectedRoute";

const StoreLayout = () => {
  const { pathname } = useLocation();
  const isWorkspace = pathname.startsWith("/admin") || pathname === "/checkout";
  const usesHomeStyle = !(/^\/(products|cart)(\/|$)/.test(pathname));

  return (
    <div className={`${isWorkspace ? "app app-workspace" : "app"} ${usesHomeStyle ? "app-home-theme" : ""}`}>
      {!isWorkspace && <Navbar />}
      <div className="main-content">

            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/products" element={<Products />} />

              <Route path="/products/:id" element={<ProductDetails />} />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute admin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventory"
                element={<ProtectedRoute admin><Admin /></ProtectedRoute>}
              />
              <Route
                path="/admin/orders"
                element={<ProtectedRoute admin><Admin /></ProtectedRoute>}
              />

              <Route path="/login" element={<Auth mode="login" />} />

              <Route path="/signup" element={<Auth mode="signup" />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
        </Routes>
      </div>
      {!isWorkspace && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <StoreLayout />
    </BrowserRouter>
  );
};

export default App;

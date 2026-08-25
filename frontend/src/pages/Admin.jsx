import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createCategory,
  createInventory,
  createProduct,
  createVariant,
  getAdminDashboard,
  getAdminInventory,
  getAllOrders,
  getAllProducts,
  getCategories,
  getProductVariants,
  updateInventory,
  updateOrderStatus,
} from "../services/productService";
import "./Admin.css";
import "./AdminTheme.css";

const initialProduct = {
  name: "",
  brand: "",
  description: "",
  price: "",
  discount: 0,
  categoryId: "",
  imageUrl: "",
};
const initialVariant = { productId: "", color: "", storage: "", price: "" };
const initialInventory = {
  productId: "",
  variantId: "",
  quantity: "",
  reserved: 0,
};
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const icons = { category: "＋", product: "◇", variant: "◇", inventory: "▣" };

export default function Admin() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const view = pathname.endsWith("/inventory")
    ? "inventory"
    : pathname.endsWith("/orders")
      ? "orders"
      : "dashboard";
  const session = JSON.parse(localStorage.getItem("itechSession") || "null");
  const [orders, setOrders] = useState([]),
    [categories, setCategories] = useState([]),
    [products, setProducts] = useState([]),
    [dashboard, setDashboard] = useState(null),
    [inventoryList, setInventoryList] = useState([]),
    [inventoryVariants, setInventoryVariants] = useState([]);
  const [product, setProduct] = useState(initialProduct),
    [variant, setVariant] = useState(initialVariant),
    [inventory, setInventory] = useState(initialInventory),
    [categoryName, setCategoryName] = useState("");
  const [modal, setModal] = useState(""),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(true);
  const load = async () => {
    try {
      const [a, b, c, d, e] = await Promise.all([
        getAllOrders(),
        getCategories(),
        getAllProducts(),
        getAdminDashboard(),
        getAdminInventory(),
      ]);
      setOrders(a.data);
      setCategories(b.data);
      setProducts(c.data);
      setDashboard(d.data);
      setInventoryList(e.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "CANCELLED").length,
    [orders],
  );
  const close = () => setModal("");
  const change = (setter) => (e) =>
    setter((current) => ({ ...current, [e.target.name]: e.target.value }));
  const create = async (event, type) => {
    event.preventDefault();
    try {
      if (type === "category") {
        await createCategory({ name: categoryName });
        setCategoryName("");
      }
      if (type === "product") {
        await createProduct({
          ...product,
          price: Number(product.price),
          discount: Number(product.discount || 0),
          categoryId: Number(product.categoryId),
        });
        setProduct(initialProduct);
      }
      if (type === "variant") {
        const res = await createVariant(Number(variant.productId), {
          color: variant.color,
          storage: variant.storage,
          price: Number(variant.price),
        });
        setInventory((x) => ({
          ...x,
          productId: variant.productId,
          variantId: String(res.data.id),
        }));
        setVariant(initialVariant);
      }
      if (type === "inventory") {
        await createInventory(Number(inventory.variantId), {
          quantity: Number(inventory.quantity),
          reserved: Number(inventory.reserved || 0),
        });
        setInventory(initialInventory);
      }
      await load();
      close();
      setMessage(
        `${type === "inventory" ? "Inventory" : type[0].toUpperCase() + type.slice(1)} saved successfully.`,
      );
    } catch (error) {
      setMessage(error.response?.data?.message || `Unable to save ${type}.`);
    }
  };
  const selectInventoryProduct = async (e) => {
    const productId = e.target.value;
    setInventory((x) => ({ ...x, productId, variantId: "" }));
    setInventoryVariants(
      productId ? (await getProductVariants(productId)).data : [],
    );
  };
  const updateStock = async (item, quantity) => {
    try {
      await updateInventory(item.variantId, {
        quantity: Number(quantity),
        reserved: item.reserved,
      });
      await load();
      setMessage(`${item.productName} inventory updated.`);
    } catch (e) {
      setMessage(e.response?.data?.message || "Unable to update inventory.");
    }
  };
  const updateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      await load();
      setMessage(`Order #${id} updated.`);
    } catch (e) {
      setMessage(e.response?.data?.message || "Unable to update order.");
    }
  };
  const logout = () => {
    localStorage.removeItem("itechSession");
    window.dispatchEvent(new Event("authchange"));
    navigate("/login");
  };
  if (loading) return <h2 className="admin-message">Loading dashboard...</h2>;
  const statusData = [
    ["Orders placed", dashboard?.pendingOrders || 0, "blue"],
    ["Confirmed", dashboard?.confirmedOrders || 0, "purple"],
    ["Shipped", dashboard?.shippedOrders || 0, "orange"],
    ["Delivered", dashboard?.completedOrders || 0, "green"],
  ];
  const max = Math.max(...statusData.map(([, value]) => value), 1);

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin">
           iTech <span>Admin</span>
        </Link>
        <nav>
          <Link className={view === "dashboard" ? "active" : ""} to="/admin">
            ▦ <span>Dashboard</span>
          </Link>
          <Link
            className={view === "inventory" ? "active" : ""}
            to="/admin/inventory"
          >
            ▣ <span>Inventory</span>
          </Link>
          <Link
            className={view === "orders" ? "active" : ""}
            to="/admin/orders"
          >
            ▤ <span>Orders</span>
          </Link>
          <a href="/admin#tools">
            ◈ <span>Catalog tools</span>
          </a>
        </nav>
        <div className="sidebar-foot">
          Signed in as
          <br />
          <strong>{session?.name || "Administrator"}</strong>
        </div>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar">
          <strong>
            {view === "dashboard"
              ? "Dashboard"
              : view === "inventory"
                ? "Inventory"
                : "Orders"}
          </strong>
          <div className="admin-user">
            <span className="admin-date">
              {" "}
              {new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date())}
            </span>
            <Link className="admin-profile" to="/profile">
              <b>{session?.name?.charAt(0)?.toUpperCase() || "A"}</b>
              <span>
                {session?.name || "Administrator"}
                <small>Admin account</small>
              </span>
            </Link>
            <button className="admin-logout" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
        <div className="admin-dashboard" id="overview">
          {view === "dashboard" && (
            <>
              <div className="dashboard-heading">
                <div>
                  <p>STORE OVERVIEW</p>
                  <h1>Welcome back, {session?.name || "Admin"}</h1>
                  <span>Here is what is happening in your store today.</span>
                </div>
              </div>
              {message && (
                <p className="admin-feedback">
                  {message}
                  <button onClick={() => setMessage("")}>×</button>
                </p>
              )}
              <section className="dashboard-stats">
                <Metric
                  color="blue"
                  icon="₹"
                  label="Total revenue"
                  value={money(dashboard?.totalRevenue)}
                  note="From active orders"
                />
                <Metric
                  color="green"
                  icon="▣"
                  label="Total orders"
                  value={dashboard?.totalOrders || 0}
                  note={`${activeOrders} currently active`}
                />
                <Metric
                  color="purple"
                  icon="◇"
                  label="Product variants"
                  value={dashboard?.totalVariants || 0}
                  note={`Across ${dashboard?.totalProducts || 0} products`}
                />
                <Metric
                  color="orange"
                  icon="!"
                  label="Low stock items"
                  value={dashboard?.lowStockVariants || 0}
                  note="Need attention"
                />
              </section>
              <section className="overview-card">
                <div className="card-title">
                  <div>
                    <h2>Order status overview</h2>
                    <p>Live distribution from your store data</p>
                  </div>
                  <span>All time</span>
                </div>
                <div className="bar-chart">
                  {statusData.map(([label, value, color]) => (
                    <div className="bar-column" key={label}>
                      <strong>{value}</strong>
                      <div className="bar-track">
                        <i
                          className={color}
                          style={{
                            height: `${Math.max((value / max) * 100, value ? 8 : 0)}%`,
                          }}
                        />
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="quick-actions" id="tools">
                {[
                  ["category", "Create category", "Add a new collection"],
                  ["product", "Create product", "Add a new product"],
                  ["variant", "Add variant", "Create product options"],
                  ["inventory", "Add inventory", "Update stock quantity"],
                ].map(([type, title, text]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setMessage("");
                      setModal(type);
                    }}
                  >
                    <i className={type}>{icons[type]}</i>
                    <span>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>
                    <b>›</b>
                  </button>
                ))}
              </section>
            </>
          )}
          {view === "inventory" && (
            <section className="inventory-overview page-section">
              <SectionHead
                title="Inventory overview"
                text="Keep your best sellers available."
                action={() => setModal("inventory")}
              />
              <div className="inventory-summary">
                <Summary
                  label="Total products"
                  value={dashboard?.totalProducts || 0}
                  note={`${dashboard?.totalVariants || 0} variants in catalog`}
                />
                <Summary
                  label="Low stock"
                  value={dashboard?.lowStockVariants || 0}
                  note="Available quantity is 5 or less"
                />
                <Summary
                  label="Inventory records"
                  value={inventoryList.length}
                  note="Track stock by product variant"
                />
              </div>
              {inventoryList.length > 0 && (
                <div className="inventory-list">
                  {inventoryList.map((item) => (
                    <article className="inventory-row" key={item.id}>
                      <div>
                        <strong>{item.productName}</strong>
                        <p>
                          {item.color} · {item.storage} · {money(item.price)}
                        </p>
                      </div>
                      <span
                        className={`stock-${item.stockStatus.replaceAll(" ", "-").toLowerCase()}`}
                      >
                        {item.stockStatus}
                      </span>
                      <label>
                        Available
                        <input
                          type="number"
                          min="0"
                          defaultValue={item.quantity}
                          onBlur={(e) =>
                            e.target.value !== String(item.quantity) &&
                            updateStock(item, e.target.value)
                          }
                        />
                      </label>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          {view === "orders" && (
            <section className="admin-orders page-section">
              <SectionHead
                title="Customer orders"
                text="Products in every order are listed below."
              />
              {orders.length === 0 ? (
                <p className="empty-state">No orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <article className="admin-order" key={order.id}>
                      <div className="order-id">#{order.id}</div>
                      <div>
                        <strong>
                          {order.customerName ||
                            order.shippingName ||
                            "Customer"}
                        </strong>
                        <p className="admin-order-products">
                          {order.items
                            .map(
                              (item) =>
                                `${item.productName || "Product"} (${item.color || "-"}/${item.storage || "-"}) × ${item.quantity}`,
                            )
                            .join(", ")}
                        </p>
                        <p>
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""} ·{" "}
                          {order.paymentMethod}
                        </p>
                      </div>
                      <strong>{money(order.totalAmount)}</strong>
                      <StatusSelect order={order} onChange={updateStatus} />
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </section>
      {modal && (
        <Modal type={modal} close={close}>
          <Form
            type={modal}
            categories={categories}
            products={products}
            product={product}
            variant={variant}
            inventory={inventory}
            inventoryVariants={inventoryVariants}
            setProduct={setProduct}
            setVariant={setVariant}
            setInventory={setInventory}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            change={change}
            selectInventoryProduct={selectInventoryProduct}
            submit={create}
          />
        </Modal>
      )}
    </main>
  );
}
const Metric = ({ color, icon, label, value, note }) => (
  <article className={`metric ${color}`}>
    <i>{icon}</i>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  </article>
);
const Summary = ({ label, value, note }) => (
  <article>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{note}</small>
  </article>
);
const SectionHead = ({ title, text, action }) => (
  <div className="section-head">
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    {action && <button onClick={action}>Add stock</button>}
  </div>
);
const StatusSelect = ({ order, onChange }) => (
  <select
    value={order.status}
    onChange={(e) => onChange(order.id, e.target.value)}
  >
    <option value={order.status}>{order.status}</option>
    {order.status === "PLACED" && <option value="CONFIRMED">CONFIRMED</option>}
    {order.status === "CONFIRMED" && <option value="SHIPPED">SHIPPED</option>}
    {order.status === "SHIPPED" && <option value="DELIVERED">DELIVERED</option>}
    {["PLACED", "CONFIRMED"].includes(order.status) && (
      <option value="CANCELLED">CANCELLED</option>
    )}
  </select>
);
const Modal = ({ type, close, children }) => (
  <div className="modal-backdrop" onMouseDown={close}>
    <section
      className="admin-modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button className="modal-close" onClick={close}>
        ×
      </button>
      <div className="modal-heading">
        <i className={type}>{icons[type]}</i>
        <div>
          <h2>
            {type === "category"
              ? "Create category"
              : type === "product"
                ? "Create product"
                : type === "variant"
                  ? "Add product variant"
                  : "Add inventory"}
          </h2>
          <p>Fill in the details below to update your catalog.</p>
        </div>
      </div>
      {children}
    </section>
  </div>
);
const Form = ({
  type,
  categories,
  products,
  product,
  variant,
  inventory,
  inventoryVariants,
  setProduct,
  setVariant,
  setInventory,
  categoryName,
  setCategoryName,
  change,
  selectInventoryProduct,
  submit,
}) => (
  <form
    className={`product-form ${type === "category" ? "one-field" : ""}`}
    onSubmit={(e) => submit(e, type)}
  >
    {type === "category" && (
      <label>
        Category name
        <input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="e.g. Smartphones"
          required
          autoFocus
        />
      </label>
    )}
    {type === "product" && (
      <>
        <label>
          Product name
          <input
            name="name"
            value={product.name}
            onChange={change(setProduct)}
            required
          />
        </label>
        <label>
          Brand
          <input
            name="brand"
            value={product.brand}
            onChange={change(setProduct)}
            required
          />
        </label>
        <label>
          Price
          <input
            name="price"
            value={product.price}
            onChange={change(setProduct)}
            type="number"
            min="1"
            required
          />
        </label>
        <label>
          Discount %
          <input
            name="discount"
            value={product.discount}
            onChange={change(setProduct)}
            type="number"
            min="0"
          />
        </label>
        <label>
          Category
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={change(setProduct)}
            required
          >
            <option value="">Select category</option>
            {categories.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image URL <em>(optional)</em>
          <input
            name="imageUrl"
            value={product.imageUrl}
            onChange={change(setProduct)}
          />
        </label>
        <label className="wide">
          Description <em>(optional)</em>
          <textarea
            name="description"
            value={product.description}
            onChange={change(setProduct)}
          />
        </label>
      </>
    )}
    {type === "variant" && (
      <>
        <label className="wide">
          Product
          <select
            name="productId"
            value={variant.productId}
            onChange={change(setVariant)}
            required
          >
            <option value="">Select product</option>
            {products.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Color
          <input
            name="color"
            value={variant.color}
            onChange={change(setVariant)}
            placeholder="e.g. Black"
            required
          />
        </label>
        <label>
          Storage / size
          <input
            name="storage"
            value={variant.storage}
            onChange={change(setVariant)}
            placeholder="e.g. 128GB"
            required
          />
        </label>
        <label className="wide">
          Variant price
          <input
            name="price"
            value={variant.price}
            onChange={change(setVariant)}
            type="number"
            min="1"
            required
          />
        </label>
      </>
    )}
    {type === "inventory" && (
      <>
        <label className="wide">
          Product
          <select
            value={inventory.productId}
            onChange={selectInventoryProduct}
            required
          >
            <option value="">Select product</option>
            {products.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label className="wide">
          Variant
          <select
            name="variantId"
            value={inventory.variantId}
            onChange={change(setInventory)}
            disabled={!inventory.productId}
            required
          >
            <option value="">Select variant</option>
            {inventoryVariants.map((x) => (
              <option key={x.id} value={x.id}>
                {x.color} / {x.storage} — {money(x.price)}
              </option>
            ))}
          </select>
        </label>
        <label className="wide">
          Stock quantity
          <input
            name="quantity"
            value={inventory.quantity}
            onChange={change(setInventory)}
            type="number"
            min="0"
            required
          />
        </label>
      </>
    )}
    <button type="submit">
      {type === "category"
        ? "Create category"
        : type === "product"
          ? "Create product"
          : type === "variant"
            ? "Create variant"
            : "Save inventory"}
    </button>
  </form>
);

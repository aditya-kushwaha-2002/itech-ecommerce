import axios from "axios";

axios.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("itechSession") || "null");
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

const API_ROOT = import.meta.env.VITE_API_URL;
const API_URL = `${API_ROOT}/api/products`;
const API_CART_URL = `${API_ROOT}/api/carts`;
const CART_ID_STORAGE_KEY = "itechCartId";

export const getAllProducts = (search = "") => {
  return axios.get(API_URL, { params: search ? { search } : {} });
};

export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getProductVariants = (productId) => {
  return axios.get(`${API_URL}/${productId}/variants`);
};

export const getInventoryByVariant = (variantId) => {
  return axios.get(`${API_ROOT}/variants/${variantId}/inventory`);
};

// Get Cart
export const getCartItems = (cartId) => {
  return axios.get(`${API_CART_URL}/${cartId}`);
};

export const createCart = () => axios.post(API_CART_URL);

export const getOrCreateCartId = async () => {
  const response = await createCart();
  const cartId = response.data.id;

  localStorage.setItem(CART_ID_STORAGE_KEY, String(cartId));

  return cartId;
};

// Add Item
export const addToCart = (cartId, variantId, quantity) => {
  return axios.post(`${API_CART_URL}/${cartId}/items`, {
    variantId: variantId,
    quantity: quantity,
  });
};

// Update Quantity
export const updateCartItem = (cartId, itemId, quantity, variantId) => {
  return axios.put(`${API_CART_URL}/${cartId}/items/${itemId}`, {
    quantity: quantity,
    variantId: variantId,
  });
};

// Remove Item
export const removeCartItem = (cartId, itemId) => {
  return axios.delete(`${API_CART_URL}/${cartId}/items/${itemId}`);
};

// Clear Cart
export const clearCart = (cartId) => {
  return axios.delete(`${API_CART_URL}/${cartId}/items`);
};

export const createOrder = (cartId, paymentMethod) => {
  return axios.post(`${API_ROOT}/orders/carts/${cartId}`, { paymentMethod });
};

export const getOrderById = (orderId) => {
  return axios.get(`${API_ROOT}/orders/${orderId}`);
};

export const getAllOrders = () => axios.get(`${API_ROOT}/orders`);
export const getMyOrders = () => axios.get(`${API_ROOT}/orders/my`);

export const getCategories = () => axios.get(`${API_ROOT}/api/categories`);

export const createCategory = (category) =>
  axios.post(`${API_ROOT}/categories`, category);

export const signup = (data) => axios.post(`${API_ROOT}/auth/signup`, data);
export const login = (data) => axios.post(`${API_ROOT}/auth/login`, data);

export const getMyProfile = () => axios.get(`${API_ROOT}/users/me`);
export const updateMyProfile = (profile) =>
  axios.put(`${API_ROOT}/users/me`, profile);

export const createProduct = (product) => axios.post(API_URL, product);

export const createVariant = (productId, variant) =>
  axios.post(`${API_URL}/${productId}/variants`, variant);

export const createInventory = (variantId, inventory) =>
  axios.post(`${API_ROOT}/variants/${variantId}/inventory`, inventory);

export const getAdminDashboard = () => axios.get(`${API_ROOT}/admin/dashboard`);
export const updateOrderStatus = (orderId, status) =>
  axios.put(`${API_ROOT}/admin/orders/${orderId}/status`, { status });
export const getAdminInventory = () => axios.get(`${API_ROOT}/admin/inventory`);
export const updateInventory = (variantId, inventory) =>
  axios.put(`${API_ROOT}/admin/inventory/${variantId}`, inventory);
export const cancelOrder = (orderId) =>
  axios.put(`${API_ROOT}/orders/${orderId}/cancel`);

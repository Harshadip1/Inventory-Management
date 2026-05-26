/**
 * Niks Inventory - LocalStorage CRUD
 */
const Storage = {
  KEYS: {
    products: 'niks_products',
    suppliers: 'niks_suppliers',
    warehouses: 'niks_warehouses',
    orders: 'niks_orders',
    movements: 'niks_movements',
    purchases: 'niks_purchases',
    notifications: 'niks_notifications',
    settings: 'niks_settings',
    user: 'niks_user',
    auth: 'niks_auth',
    initialized: 'niks_initialized'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.initialized)) {
      localStorage.setItem(this.KEYS.products, JSON.stringify(SEED_DATA.products));
      localStorage.setItem(this.KEYS.suppliers, JSON.stringify(SEED_DATA.suppliers));
      localStorage.setItem(this.KEYS.warehouses, JSON.stringify(SEED_DATA.warehouses));
      localStorage.setItem(this.KEYS.orders, JSON.stringify(SEED_DATA.orders));
      localStorage.setItem(this.KEYS.movements, JSON.stringify(SEED_DATA.stockMovements));
      localStorage.setItem(this.KEYS.purchases, JSON.stringify(SEED_DATA.purchases));
      localStorage.setItem(this.KEYS.notifications, JSON.stringify(SEED_DATA.notifications));
      localStorage.setItem(this.KEYS.settings, JSON.stringify(SEED_DATA.settings));
      localStorage.setItem(this.KEYS.user, JSON.stringify(SEED_DATA.user));
      localStorage.setItem(this.KEYS.initialized, 'true');
    }
  },

  get(key) {
    try {
      const data = localStorage.getItem(this.KEYS[key] || key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem(this.KEYS[key] || key, JSON.stringify(value));
  },

  // Products
  getProducts() { return this.get('products') || []; },
  saveProducts(products) { this.set('products', products); },
  addProduct(product) {
    const products = this.getProducts();
    product.id = product.id || 'p' + Date.now();
    products.push(product);
    this.saveProducts(products);
    return product;
  },
  updateProduct(id, updates) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      this.updateProductStatus(products[idx]);
      this.saveProducts(products);
      return products[idx];
    }
    return null;
  },
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },
  updateProductStatus(product) {
    if (product.quantity <= 0) product.status = 'out_of_stock';
    else if (product.quantity <= (product.lowStock || 15)) product.status = 'low_stock';
    else product.status = 'active';
  },

  // Suppliers
  getSuppliers() { return this.get('suppliers') || []; },
  saveSuppliers(s) { this.set('suppliers', s); },
  addSupplier(supplier) {
    const list = this.getSuppliers();
    supplier.id = supplier.id || 's' + Date.now();
    list.push(supplier);
    this.saveSuppliers(list);
    return supplier;
  },
  updateSupplier(id, updates) {
    const list = this.getSuppliers();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSuppliers(list);
      return list[idx];
    }
    return null;
  },
  deleteSupplier(id) {
    this.saveSuppliers(this.getSuppliers().filter(s => s.id !== id));
  },

  // Warehouses
  getWarehouses() { return this.get('warehouses') || []; },
  saveWarehouses(w) { this.set('warehouses', w); },

  // Notifications
  getNotifications() { return this.get('notifications') || []; },
  markNotificationRead(id) {
    const list = this.getNotifications();
    const n = list.find(x => x.id === id);
    if (n) n.read = true;
    this.set('notifications', list);
  },
  markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.set('notifications', list);
  },
  addNotification(notification) {
    const list = this.getNotifications();
    notification.id = 'n' + Date.now();
    notification.time = new Date().toISOString();
    notification.read = false;
    list.unshift(notification);
    this.set('notifications', list.slice(0, 50));
  },

  // Settings & User
  getSettings() { return this.get('settings') || SEED_DATA.settings; },
  saveSettings(s) { this.set('settings', s); },
  getUser() { return this.get('user') || SEED_DATA.user; },
  saveUser(u) { this.set('user', u); },

  // Auth
  isLoggedIn() {
    return localStorage.getItem(this.KEYS.auth) === 'true';
  },
  login(email) {
    localStorage.setItem(this.KEYS.auth, 'true');
    const user = this.getUser();
    if (email) user.email = email;
    this.saveUser(user);
  },
  logout() {
    localStorage.removeItem(this.KEYS.auth);
  },

  // Stats
  getDashboardStats() {
    const products = this.getProducts();
    const orders = this.get('orders') || [];
    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + p.quantity, 0);
    const lowStock = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const totalSales = orders.length;
    return { totalProducts, totalStock, lowStock, totalRevenue, totalSales };
  },

  generateSKU(category) {
    const prefix = 'NIK';
    const cat = (category || 'GEN').substring(0, 3).toUpperCase();
    const num = String(Math.floor(Math.random() * 900) + 100);
    return `${prefix}-${cat}-${num}`;
  }
};

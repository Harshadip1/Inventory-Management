/**
 * Niks Inventory - Seed Data
 */
const SEED_DATA = {
  products: [
    { id: 'p1', name: 'Wireless Bluetooth Headphones', sku: 'NIK-AUD-001', price: 89.99, quantity: 145, status: 'active', category: 'Electronics', supplier: 'TechSupply Co', image: '', lowStock: 20 },
    { id: 'p2', name: 'Ergonomic Office Chair', sku: 'NIK-FUR-002', price: 299.00, quantity: 32, status: 'active', category: 'Furniture', supplier: 'OfficePro Ltd', image: '', lowStock: 10 },
    { id: 'p3', name: 'USB-C Hub 7-in-1', sku: 'NIK-ACC-003', price: 45.50, quantity: 8, status: 'low_stock', category: 'Accessories', supplier: 'TechSupply Co', image: '', lowStock: 15 },
    { id: 'p4', name: 'Standing Desk 60"', sku: 'NIK-FUR-004', price: 549.00, quantity: 18, status: 'active', category: 'Furniture', supplier: 'OfficePro Ltd', image: '', lowStock: 5 },
    { id: 'p5', name: 'Mechanical Keyboard RGB', sku: 'NIK-ACC-005', price: 129.99, quantity: 0, status: 'out_of_stock', category: 'Accessories', supplier: 'GadgetWorld', image: '', lowStock: 10 },
    { id: 'p6', name: '27" 4K Monitor', sku: 'NIK-ELE-006', price: 399.00, quantity: 56, status: 'active', category: 'Electronics', supplier: 'TechSupply Co', image: '', lowStock: 8 },
    { id: 'p7', name: 'Laptop Stand Aluminum', sku: 'NIK-ACC-007', price: 34.99, quantity: 210, status: 'active', category: 'Accessories', supplier: 'GadgetWorld', image: '', lowStock: 25 },
    { id: 'p8', name: 'Wireless Mouse Pro', sku: 'NIK-ACC-008', price: 59.99, quantity: 12, status: 'low_stock', category: 'Accessories', supplier: 'GadgetWorld', image: '', lowStock: 20 },
    { id: 'p9', name: 'Desk Lamp LED', sku: 'NIK-FUR-009', price: 42.00, quantity: 78, status: 'active', category: 'Furniture', supplier: 'HomeBright', image: '', lowStock: 15 },
    { id: 'p10', name: 'Webcam 1080p', sku: 'NIK-ELE-010', price: 79.99, quantity: 94, status: 'active', category: 'Electronics', supplier: 'TechSupply Co', image: '', lowStock: 12 },
    { id: 'p11', name: 'Notebook Set Premium', sku: 'NIK-STN-011', price: 24.99, quantity: 320, status: 'active', category: 'Stationery', supplier: 'PaperCraft Inc', image: '', lowStock: 50 },
    { id: 'p12', name: 'External SSD 1TB', sku: 'NIK-ELE-012', price: 119.00, quantity: 5, status: 'low_stock', category: 'Electronics', supplier: 'TechSupply Co', image: '', lowStock: 10 }
  ],
  suppliers: [
    { id: 's1', name: 'TechSupply Co', email: 'orders@techsupply.com', phone: '+1 555-0101', address: '123 Tech Park, San Jose, CA', status: 'active', products: 45, totalOrders: 128 },
    { id: 's2', name: 'OfficePro Ltd', email: 'sales@officepro.com', phone: '+1 555-0102', address: '456 Business Ave, Austin, TX', status: 'active', products: 28, totalOrders: 89 },
    { id: 's3', name: 'GadgetWorld', email: 'contact@gadgetworld.io', phone: '+1 555-0103', address: '789 Innovation Blvd, Seattle, WA', status: 'active', products: 62, totalOrders: 201 },
    { id: 's4', name: 'HomeBright', email: 'info@homebright.com', phone: '+1 555-0104', address: '321 Design St, Portland, OR', status: 'active', products: 15, totalOrders: 42 },
    { id: 's5', name: 'PaperCraft Inc', email: 'wholesale@papercraft.com', phone: '+1 555-0105', address: '654 Paper Lane, Chicago, IL', status: 'inactive', products: 22, totalOrders: 67 }
  ],
  warehouses: [
    { id: 'w1', name: 'Main Distribution Center', location: 'Los Angeles, CA', capacity: 10000, used: 7200, products: 156, status: 'operational' },
    { id: 'w2', name: 'East Coast Hub', location: 'New York, NY', capacity: 8000, used: 5400, products: 98, status: 'operational' },
    { id: 'w3', name: 'Midwest Storage', location: 'Chicago, IL', capacity: 5000, used: 3100, products: 72, status: 'operational' },
    { id: 'w4', name: 'South Regional', location: 'Dallas, TX', capacity: 6000, used: 4800, products: 84, status: 'maintenance' }
  ],
  orders: [
    { id: 'ORD-2847', customer: 'Acme Corp', items: 5, total: 1249.50, status: 'completed', date: '2026-05-25' },
    { id: 'ORD-2846', customer: 'Beta Industries', items: 3, total: 589.00, status: 'processing', date: '2026-05-25' },
    { id: 'ORD-2845', customer: 'Gamma LLC', items: 12, total: 3420.00, status: 'completed', date: '2026-05-24' },
    { id: 'ORD-2844', customer: 'Delta Systems', items: 2, total: 199.98, status: 'pending', date: '2026-05-24' },
    { id: 'ORD-2843', customer: 'Echo Retail', items: 8, total: 2156.00, status: 'completed', date: '2026-05-23' },
    { id: 'ORD-2842', customer: 'Foxtrot Inc', items: 1, total: 549.00, status: 'shipped', date: '2026-05-23' }
  ],
  stockMovements: [
    { id: 'm1', productId: 'p1', product: 'Wireless Bluetooth Headphones', type: 'in', quantity: 50, warehouse: 'Main DC', date: '2026-05-25T10:30:00', user: 'Admin' },
    { id: 'm2', productId: 'p3', product: 'USB-C Hub 7-in-1', type: 'out', quantity: 12, warehouse: 'East Coast Hub', date: '2026-05-25T09:15:00', user: 'Sarah K.' },
    { id: 'm3', productId: 'p5', product: 'Mechanical Keyboard RGB', type: 'out', quantity: 25, warehouse: 'Main DC', date: '2026-05-24T16:45:00', user: 'Mike R.' },
    { id: 'm4', productId: 'p6', product: '27" 4K Monitor', type: 'in', quantity: 30, warehouse: 'Midwest Storage', date: '2026-05-24T14:20:00', user: 'Admin' },
    { id: 'm5', productId: 'p8', product: 'Wireless Mouse Pro', type: 'transfer', quantity: 15, warehouse: 'Main DC → East Coast', date: '2026-05-24T11:00:00', user: 'Lisa M.' },
    { id: 'm6', productId: 'p12', product: 'External SSD 1TB', type: 'out', quantity: 8, warehouse: 'Main DC', date: '2026-05-23T15:30:00', user: 'Admin' }
  ],
  purchases: [
    { id: 'PO-1201', supplier: 'TechSupply Co', items: 15, total: 4500.00, status: 'received', date: '2026-05-20' },
    { id: 'PO-1202', supplier: 'OfficePro Ltd', items: 8, total: 2890.00, status: 'pending', date: '2026-05-22' },
    { id: 'PO-1203', supplier: 'GadgetWorld', items: 22, total: 3200.00, status: 'in_transit', date: '2026-05-24' }
  ],
  notifications: [
    { id: 'n1', type: 'warning', title: 'Low Stock Alert', message: 'USB-C Hub 7-in-1 is below minimum stock level (8 units)', time: '2026-05-25T08:00:00', read: false },
    { id: 'n2', type: 'danger', title: 'Out of Stock', message: 'Mechanical Keyboard RGB is completely out of stock', time: '2026-05-24T14:30:00', read: false },
    { id: 'n3', type: 'success', title: 'New Order', message: 'Order ORD-2847 received from Acme Corp ($1,249.50)', time: '2026-05-25T09:15:00', read: false },
    { id: 'n4', type: 'info', title: 'Inventory Update', message: '50 units of Wireless Headphones added to Main DC', time: '2026-05-25T10:30:00', read: true },
    { id: 'n5', type: 'warning', title: 'Expiry Warning', message: 'Batch #B-4421 approaching expiry in 14 days', time: '2026-05-23T11:00:00', read: true },
    { id: 'n6', type: 'success', title: 'Purchase Received', message: 'PO-1201 from TechSupply Co has been received', time: '2026-05-20T16:00:00', read: true }
  ],
  salesMonthly: [
    { month: 'Jan', revenue: 42500, orders: 142 },
    { month: 'Feb', revenue: 38200, orders: 128 },
    { month: 'Mar', revenue: 51800, orders: 175 },
    { month: 'Apr', revenue: 47300, orders: 158 },
    { month: 'May', revenue: 62400, orders: 198 }
  ],
  categorySales: [
    { category: 'Electronics', value: 35 },
    { category: 'Accessories', value: 28 },
    { category: 'Furniture', value: 22 },
    { category: 'Stationery', value: 15 }
  ],
  topProducts: [
    { name: 'Wireless Bluetooth Headphones', sold: 234, revenue: 21048 },
    { name: '27" 4K Monitor', sold: 89, revenue: 35511 },
    { name: 'Ergonomic Office Chair', sold: 45, revenue: 13455 },
    { name: 'Laptop Stand Aluminum', sold: 312, revenue: 10918 },
    { name: 'Webcam 1080p', sold: 156, revenue: 12478 }
  ],
  settings: {
    companyName: 'Niks Inventory',
    currency: 'USD',
    lowStockThreshold: 15,
    theme: 'dark',
    notifications: { email: true, push: true, lowStock: true, orders: true }
  },
  user: {
    name: 'Nikhil Admin',
    email: 'admin@niksinventory.com',
    role: 'Administrator',
    company: 'Niks Inventory',
    avatar: 'NA'
  }
};

const CATEGORIES = ['Electronics', 'Furniture', 'Accessories', 'Stationery', 'Other'];

const PRODUCT_EMOJIS = {
  Electronics: '📱',
  Furniture: '🪑',
  Accessories: '⌨️',
  Stationery: '📓',
  Other: '📦'
};

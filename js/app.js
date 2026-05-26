/**
 * Dashboard page logic
 */
const Dashboard = {
  init() {
    this.renderStats();
    this.renderCharts();
    this.renderRecentOrders();
    this.renderLowStock();
    this.renderQuickActions();
    Utils.initReveal();
  },

  renderStats() {
    const stats = Storage.getDashboardStats();
    const products = Storage.getProducts();
    const revenue = products.reduce((s, p) => s + p.price * p.quantity, 0);

    const cards = [
      { id: 'stat-products', value: stats.totalProducts, label: 'Total Products', change: '+12%', icon: '📦', color: 'rgba(124,58,237,0.2)' },
      { id: 'stat-sales', value: stats.totalSales, label: 'Total Orders', change: '+8.2%', icon: '🛒', color: 'rgba(6,182,212,0.2)' },
      { id: 'stat-revenue', value: stats.totalRevenue, label: 'Revenue', change: '+23.5%', icon: '💰', color: 'rgba(34,197,94,0.2)', prefix: '$', isCurrency: true },
      { id: 'stat-stock', value: stats.totalStock, label: 'Units in Stock', change: stats.lowStock + ' low', icon: '📊', color: 'rgba(245,158,11,0.2)', changeClass: stats.lowStock > 0 ? 'negative' : 'positive' }
    ];

    const container = document.getElementById('dashboard-stats');
    if (!container) return;

    container.innerHTML = cards.map(c => `
      <div class="glass-card stat-card reveal">
        <div class="stat-icon" style="background:${c.color}">${c.icon}</div>
        <div class="stat-value" id="${c.id}">0</div>
        <div class="stat-label">${c.label}</div>
        <div class="stat-change ${c.changeClass || 'positive'}">${c.change}</div>
      </div>
    `).join('');

    setTimeout(() => {
      Charts.animateCounter(document.getElementById('stat-products'), stats.totalProducts);
      Charts.animateCounter(document.getElementById('stat-sales'), stats.totalSales);
      Charts.animateCounter(document.getElementById('stat-revenue'), stats.totalRevenue, 1500, '$');
      Charts.animateCounter(document.getElementById('stat-stock'), stats.totalStock);
    }, 300);
  },

  renderCharts() {
    const monthly = SEED_DATA.salesMonthly;
    Charts.drawLineChart('revenue-chart', monthly.map(m => m.month), [
      { data: monthly.map(m => m.revenue), color: '#7C3AED' },
      { data: monthly.map(m => m.orders * 200), color: '#06B6D4' }
    ]);
    Charts.drawPieChart('category-chart',
      SEED_DATA.categorySales.map(c => c.category),
      SEED_DATA.categorySales.map(c => c.value)
    );
    Charts.drawBarChart('orders-chart',
      monthly.map(m => m.month),
      monthly.map(m => m.orders)
    );
    window.addEventListener('resize', Utils.debounce(() => this.renderCharts(), 250));
  },

  renderRecentOrders() {
    const orders = Storage.get('orders') || [];
    const tbody = document.getElementById('recent-orders-body');
    if (!tbody) return;
    tbody.innerHTML = orders.slice(0, 6).map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${o.items}</td>
        <td>${Utils.formatCurrency(o.total)}</td>
        <td>${Utils.statusBadge(o.status)}</td>
        <td>${Utils.formatDate(o.date)}</td>
      </tr>
    `).join('');
  },

  renderLowStock() {
    const products = Storage.getProducts().filter(p => p.status !== 'active').slice(0, 5);
    const container = document.getElementById('low-stock-list');
    if (!container) return;

    if (!products.length) {
      container.innerHTML = '<div class="empty-state"><p>All products are well stocked ✓</p></div>';
      return;
    }

    container.innerHTML = products.map(p => {
      const level = Utils.stockLevel(p.quantity, p.lowStock);
      return `
        <div class="flex-between" style="padding:0.75rem 0;border-bottom:1px solid var(--border)">
          <div class="flex-center">
            <span style="font-size:1.5rem">${Utils.getProductEmoji(p.category)}</span>
            <div>
              <strong style="font-size:0.9rem">${p.name}</strong>
              <div class="text-muted" style="font-size:0.75rem">SKU: ${p.sku}</div>
            </div>
          </div>
          <div style="text-align:right;min-width:100px">
            <div style="font-weight:600;color:var(--${level.class === 'danger' ? 'danger' : 'warning'})">${p.quantity} units</div>
            <div class="progress-bar" style="margin-top:4px">
              <div class="fill ${level.class}" style="width:${level.percent}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderQuickActions() {
    const container = document.getElementById('quick-actions');
    if (!container) return;
    const actions = [
      { href: 'products.html?action=add', icon: '➕', label: 'Add Product' },
      { href: 'stock.html', icon: '📋', label: 'Stock Update' },
      { href: 'reports.html', icon: '📊', label: 'View Reports' },
      { href: 'suppliers.html?action=add', icon: '🏭', label: 'Add Supplier' },
      { href: 'warehouses.html', icon: '🔄', label: 'Transfer Stock' },
      { href: 'products.html', icon: '🔍', label: 'Search SKU' }
    ];
    container.innerHTML = actions.map(a => `
      <a href="${a.href}" class="quick-action-btn">
        <span class="icon">${a.icon}</span>
        ${a.label}
      </a>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('dashboard');
  Dashboard.init();
  Utils.initModals();
  Utils.hideLoader();
});

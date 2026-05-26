/**
 * Stock tracking page
 */
const StockPage = {
  init() {
    this.renderOverview();
    this.renderInventory();
    this.renderMovements();
    this.bindEvents();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('stock-filter')?.addEventListener('change', () => this.renderInventory());
    document.getElementById('stock-search')?.addEventListener('input', Utils.debounce(() => this.renderInventory(), 300));
    document.getElementById('update-stock-form')?.addEventListener('submit', e => this.handleStockUpdate(e));
  },

  renderOverview() {
    const products = Storage.getProducts();
    const inStock = products.filter(p => p.quantity > (p.lowStock || 15)).length;
    const lowStock = products.filter(p => p.status === 'low_stock').length;
    const outStock = products.filter(p => p.status === 'out_of_stock').length;
    const total = products.reduce((s, p) => s + p.quantity, 0);

    const stats = [
      { label: 'Total Units', value: total, icon: '📦', color: 'primary' },
      { label: 'In Stock', value: inStock, icon: '✅', color: 'success' },
      { label: 'Low Stock', value: lowStock, icon: '⚠️', color: 'warning' },
      { label: 'Out of Stock', value: outStock, icon: '🔴', color: 'danger' }
    ];

    document.getElementById('stock-overview').innerHTML = stats.map(s => `
      <div class="glass-card stat-card reveal">
        <div class="stat-icon" style="background:rgba(124,58,237,0.15)">${s.icon}</div>
        <div class="stat-value" data-count="${s.value}">0</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');

    document.querySelectorAll('#stock-overview [data-count]').forEach(el => {
      Charts.animateCounter(el, parseInt(el.dataset.count));
    });
  },

  renderInventory() {
    const filter = document.getElementById('stock-filter')?.value || 'all';
    const search = (document.getElementById('stock-search')?.value || '').toLowerCase();
    let products = Storage.getProducts();

    if (filter === 'in') products = products.filter(p => p.status === 'active');
    else if (filter === 'low') products = products.filter(p => p.status === 'low_stock');
    else if (filter === 'out') products = products.filter(p => p.status === 'out_of_stock');

    if (search) products = products.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));

    const tbody = document.getElementById('stock-table-body');
    tbody.innerHTML = products.map(p => {
      const level = Utils.stockLevel(p.quantity, p.lowStock);
      const max = (p.lowStock || 15) * 5;
      const pct = Math.min(100, (p.quantity / max) * 100);
      return `
        <tr>
          <td><div class="flex-center"><span>${Utils.getProductEmoji(p.category)}</span><div><strong>${p.name}</strong><br><span class="text-muted" style="font-size:0.75rem">${p.sku}</span></div></div></td>
          <td><strong>${p.quantity}</strong></td>
          <td style="min-width:140px">
            <div class="progress-bar"><div class="fill ${level.class}" style="width:${pct}%"></div></div>
            <span class="badge badge-${level.class === 'success' ? 'success' : level.class === 'warning' ? 'warning' : 'danger'} badge-pulse" style="margin-top:4px">${level.label}</span>
          </td>
          <td>${p.category}</td>
          <td>
            <button class="btn btn-sm btn-primary" data-update="${p.id}">Update</button>
          </td>
        </tr>`;
    }).join('') || '<tr><td colspan="5" class="empty-state">No products found</td></tr>';

    tbody.querySelectorAll('[data-update]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = Storage.getProducts().find(x => x.id === btn.dataset.update);
        if (p) {
          document.getElementById('update-product-id').value = p.id;
          document.getElementById('update-product-name').textContent = p.name;
          document.getElementById('update-quantity').value = p.quantity;
          Utils.showModal('update-stock-modal');
        }
      });
    });
  },

  renderMovements() {
    const movements = Storage.get('movements') || [];
    const container = document.getElementById('stock-timeline');
    const typeIcons = { in: '📥', out: '📤', transfer: '🔄' };
    const typeColors = { in: 'success', out: 'danger', transfer: 'primary' };

    container.innerHTML = movements.map(m => `
      <div class="timeline-item reveal">
        <div class="flex-between">
          <strong>${m.product}</strong>
          <span class="badge badge-${typeColors[m.type] || 'muted'}">${typeIcons[m.type] || ''} ${m.type.toUpperCase()}</span>
        </div>
        <p class="text-muted" style="font-size:0.85rem;margin:0.25rem 0">${m.quantity} units · ${m.warehouse}</p>
        <span class="time">${Utils.formatDateTime(m.date)} · ${m.user}</span>
      </div>
    `).join('');
  },

  handleStockUpdate(e) {
    e.preventDefault();
    const id = document.getElementById('update-product-id').value;
    const qty = parseInt(document.getElementById('update-quantity').value, 10);
    const product = Storage.updateProduct(id, { quantity: qty });
    if (product) {
      const movements = Storage.get('movements') || [];
      movements.unshift({
        id: 'm' + Date.now(),
        productId: id,
        product: product.name,
        type: 'in',
        quantity: qty,
        warehouse: 'Main DC',
        date: new Date().toISOString(),
        user: Storage.getUser()?.name || 'Admin'
      });
      Storage.set('movements', movements.slice(0, 50));
      if (product.status === 'low_stock') {
        Storage.addNotification({ type: 'warning', title: 'Low Stock', message: `${product.name} is below minimum level` });
      }
    }
    Utils.hideModal('update-stock-modal');
    this.renderOverview();
    this.renderInventory();
    this.renderMovements();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('stock');
  StockPage.init();
  Utils.initModals();
  Utils.hideLoader();
});

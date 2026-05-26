/**
 * Warehouses page
 */
const WarehousesPage = {
  init() {
    this.render();
    this.bindEvents();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('transfer-form')?.addEventListener('submit', e => this.handleTransfer(e));
  },

  render() {
    const warehouses = Storage.getWarehouses();
    const grid = document.getElementById('warehouses-grid');
    const usagePct = w => Math.round((w.used / w.capacity) * 100);

    grid.innerHTML = warehouses.map(w => {
      const pct = usagePct(w);
      const barClass = pct > 85 ? 'danger' : pct > 60 ? 'warning' : 'success';
      return `
        <div class="glass-card reveal warehouse-card">
          <div class="flex-between" style="margin-bottom:1rem">
            <div>
              <h3>🏢 ${w.name}</h3>
              <p class="text-muted" style="font-size:0.85rem">📍 ${w.location}</p>
            </div>
            ${Utils.statusBadge(w.status)}
          </div>
          <div class="warehouse-map" style="height:120px;background:var(--gradient-card);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;border:1px solid var(--border)">
            <div style="text-align:center">
              <div style="font-size:2rem">🗺️</div>
              <div class="text-muted" style="font-size:0.75rem">${w.location}</div>
            </div>
          </div>
          <div style="margin-bottom:0.5rem" class="flex-between">
            <span class="text-muted" style="font-size:0.85rem">Capacity Usage</span>
            <strong>${pct}%</strong>
          </div>
          <div class="progress-bar" style="margin-bottom:1rem">
            <div class="fill ${barClass}" style="width:${pct}%"></div>
          </div>
          <div class="grid-2" style="gap:0.5rem;font-size:0.85rem">
            <div><span class="text-muted">Capacity:</span> <strong>${w.capacity.toLocaleString()}</strong></div>
            <div><span class="text-muted">Used:</span> <strong>${w.used.toLocaleString()}</strong></div>
            <div><span class="text-muted">Products:</span> <strong>${w.products}</strong></div>
            <div><span class="text-muted">Available:</span> <strong>${(w.capacity - w.used).toLocaleString()}</strong></div>
          </div>
        </div>`;
    }).join('');

    const fromSelect = document.getElementById('transfer-from');
    const toSelect = document.getElementById('transfer-to');
    [fromSelect, toSelect].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="">Select warehouse</option>' +
        warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
    });

    const products = Storage.getProducts();
    const prodSelect = document.getElementById('transfer-product');
    if (prodSelect) {
      prodSelect.innerHTML = '<option value="">Select product</option>' +
        products.map(p => `<option value="${p.id}">${p.name} (${p.quantity} units)</option>`).join('');
    }

    Charts.drawBarChart('warehouse-analytics-chart',
      warehouses.map(w => w.name.split(' ')[0]),
      warehouses.map(w => w.used),
      { height: 240 }
    );
  },

  handleTransfer(e) {
    e.preventDefault();
    const from = document.getElementById('transfer-from').value;
    const to = document.getElementById('transfer-to').value;
    const productId = document.getElementById('transfer-product').value;
    const qty = parseInt(document.getElementById('transfer-qty').value, 10);

    if (from === to) { alert('Select different warehouses'); return; }

    const product = Storage.getProducts().find(p => p.id === productId);
    const warehouses = Storage.getWarehouses();
    const fromW = warehouses.find(w => w.id === from);
    const toW = warehouses.find(w => w.id === to);

    if (product && fromW && toW) {
      const movements = Storage.get('movements') || [];
      movements.unshift({
        id: 'm' + Date.now(),
        productId,
        product: product.name,
        type: 'transfer',
        quantity: qty,
        warehouse: `${fromW.name} → ${toW.name}`,
        date: new Date().toISOString(),
        user: Storage.getUser()?.name || 'Admin'
      });
      Storage.set('movements', movements);
      Storage.addNotification({ type: 'info', title: 'Stock Transfer', message: `${qty} units of ${product.name} transferred` });
      e.target.reset();
      alert('Transfer completed successfully!');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('warehouses');
  WarehousesPage.init();
  Utils.initModals();
  Utils.hideLoader();
});

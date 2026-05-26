/**
 * Suppliers page
 */
const SuppliersPage = {
  init() {
    this.render();
    this.bindEvents();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('add-supplier-btn')?.addEventListener('click', () => this.openModal());
    document.getElementById('supplier-form')?.addEventListener('submit', e => this.handleSubmit(e));
    document.getElementById('supplier-search')?.addEventListener('input', Utils.debounce(() => this.render(), 300));
    document.getElementById('supplier-status-filter')?.addEventListener('change', () => this.render());
    if (new URLSearchParams(location.search).get('action') === 'add') {
      setTimeout(() => this.openModal(), 500);
    }
  },

  getFiltered() {
    const q = (document.getElementById('supplier-search')?.value || '').toLowerCase();
    const status = document.getElementById('supplier-status-filter')?.value || '';
    return Storage.getSuppliers().filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchS = !status || s.status === status;
      return matchQ && matchS;
    });
  },

  render() {
    const suppliers = this.getFiltered();
    const grid = document.getElementById('suppliers-grid');
    grid.innerHTML = suppliers.map(s => `
      <div class="glass-card reveal" style="display:flex;flex-direction:column;gap:1rem">
        <div class="flex-between">
          <div class="flex-center">
            <div style="width:48px;height:48px;border-radius:12px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1.25rem">🏭</div>
            <div>
              <h3>${s.name}</h3>
              ${Utils.statusBadge(s.status)}
            </div>
          </div>
          <div class="flex-center" style="gap:0.25rem">
            <button class="btn btn-sm btn-secondary" data-edit="${s.id}">Edit</button>
            <button class="btn btn-sm btn-danger" data-delete="${s.id}">×</button>
          </div>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary)">
          <p>📧 ${s.email}</p>
          <p>📞 ${s.phone}</p>
          <p>📍 ${s.address}</p>
        </div>
        <div class="grid-2" style="gap:0.75rem">
          <div style="text-align:center;padding:0.75rem;background:rgba(124,58,237,0.1);border-radius:8px">
            <div style="font-size:1.25rem;font-weight:700">${s.products}</div>
            <div class="text-muted" style="font-size:0.75rem">Products</div>
          </div>
          <div style="text-align:center;padding:0.75rem;background:rgba(6,182,212,0.1);border-radius:8px">
            <div style="font-size:1.25rem;font-weight:700">${s.totalOrders}</div>
            <div class="text-muted" style="font-size:0.75rem">Orders</div>
          </div>
        </div>
      </div>
    `).join('') || '<div class="empty-state glass-card"><p>No suppliers found</p></div>';

    grid.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => this.openModal(btn.dataset.edit)));
    grid.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
      if (confirm('Remove supplier?')) { Storage.deleteSupplier(btn.dataset.delete); this.render(); }
    }));

    const purchases = Storage.get('purchases') || [];
    document.getElementById('purchase-history-body').innerHTML = purchases.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.supplier}</td>
        <td>${p.items}</td>
        <td>${Utils.formatCurrency(p.total)}</td>
        <td>${Utils.statusBadge(p.status)}</td>
        <td>${Utils.formatDate(p.date)}</td>
      </tr>
    `).join('');
  },

  openModal(id) {
    document.getElementById('supplier-form').reset();
    document.getElementById('supplier-id').value = '';
    document.getElementById('supplier-modal-title').textContent = id ? 'Edit Supplier' : 'Add Supplier';
    if (id) {
      const s = Storage.getSuppliers().find(x => x.id === id);
      if (s) {
        document.getElementById('supplier-id').value = s.id;
        document.getElementById('supplier-name').value = s.name;
        document.getElementById('supplier-email').value = s.email;
        document.getElementById('supplier-phone').value = s.phone;
        document.getElementById('supplier-address').value = s.address;
        document.getElementById('supplier-status').value = s.status;
      }
    }
    Utils.showModal('supplier-modal');
  },

  handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('supplier-id').value;
    const data = {
      name: document.getElementById('supplier-name').value,
      email: document.getElementById('supplier-email').value,
      phone: document.getElementById('supplier-phone').value,
      address: document.getElementById('supplier-address').value,
      status: document.getElementById('supplier-status').value,
      products: 0,
      totalOrders: 0
    };
    if (id) Storage.updateSupplier(id, data);
    else Storage.addSupplier(data);
    Utils.hideModal('supplier-modal');
    this.render();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('suppliers');
  SuppliersPage.init();
  Utils.initModals();
  Utils.hideLoader();
});

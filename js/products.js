/**
 * Products page logic
 */
const ProductsPage = {
  view: 'grid',
  page: 1,
  perPage: 8,
  selected: new Set(),
  filters: { search: '', category: '', status: '' },

  init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) this.filters.search = params.get('search');
    if (params.get('action') === 'add') setTimeout(() => Utils.showModal('product-modal'), 500);

    const searchInput = document.getElementById('search-products');
    if (searchInput && this.filters.search) searchInput.value = this.filters.search;
    document.getElementById('global-search')?.setAttribute('value', this.filters.search);
    this.bindEvents();
    this.populateFilters();
    this.render();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('add-product-btn')?.addEventListener('click', () => this.openModal());
    document.getElementById('product-form')?.addEventListener('submit', e => this.handleSubmit(e));
    document.getElementById('search-products')?.addEventListener('input', Utils.debounce(e => {
      this.filters.search = e.target.value;
      this.page = 1;
      this.render();
    }));
    document.getElementById('filter-category')?.addEventListener('change', e => {
      this.filters.category = e.target.value;
      this.page = 1;
      this.render();
    });
    document.getElementById('filter-status')?.addEventListener('change', e => {
      this.filters.status = e.target.value;
      this.page = 1;
      this.render();
    });
    document.getElementById('view-grid')?.addEventListener('click', () => { this.view = 'grid'; this.render(); });
    document.getElementById('view-list')?.addEventListener('click', () => { this.view = 'list'; this.render(); });
    document.getElementById('generate-sku')?.addEventListener('click', () => {
      const cat = document.getElementById('product-category')?.value;
      document.getElementById('product-sku').value = Storage.generateSKU(cat);
    });
    document.getElementById('bulk-delete')?.addEventListener('click', () => this.bulkDelete());
    document.getElementById('select-all')?.addEventListener('change', e => {
      const filtered = this.getFiltered();
      if (e.target.checked) filtered.forEach(p => this.selected.add(p.id));
      else this.selected.clear();
      this.render();
    });
  },

  populateFilters() {
    const catSelect = document.getElementById('filter-category');
    if (catSelect) {
      CATEGORIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      });
    }
    const formCat = document.getElementById('product-category');
    if (formCat) {
      CATEGORIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        formCat.appendChild(opt);
      });
    }
    const suppliers = Storage.getSuppliers();
    const supSelect = document.getElementById('product-supplier');
    if (supSelect) {
      suppliers.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = s.name;
        supSelect.appendChild(opt);
      });
    }
  },

  getFiltered() {
    return Storage.getProducts().filter(p => {
      const q = this.filters.search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCat = !this.filters.category || p.category === this.filters.category;
      const matchStatus = !this.filters.status || p.status === this.filters.status;
      return matchSearch && matchCat && matchStatus;
    });
  },

  render() {
    const filtered = this.getFiltered();
    const total = filtered.length;
    const start = (this.page - 1) * this.perPage;
    const pageItems = filtered.slice(start, start + this.perPage);
    const container = document.getElementById('products-container');
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = `${total} products`;

    document.getElementById('view-grid')?.classList.toggle('active', this.view === 'grid');
    document.getElementById('view-list')?.classList.toggle('active', this.view === 'list');

    if (this.view === 'grid') {
      container.className = 'product-grid';
      container.innerHTML = pageItems.map(p => this.gridCard(p)).join('');
    } else {
      container.className = 'table-wrap glass-card';
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="select-all" ${this.selected.size === pageItems.length && pageItems.length ? 'checked' : ''}></th>
              <th>Product</th><th>SKU</th><th>Price</th><th>Qty</th><th>Status</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>${pageItems.map(p => this.listRow(p)).join('')}</tbody>
        </table>`;
      document.getElementById('select-all')?.addEventListener('change', e => {
        if (e.target.checked) pageItems.forEach(p => this.selected.add(p.id));
        else pageItems.forEach(p => this.selected.delete(p.id));
        this.render();
      });
    }

    this.renderPagination(total);
    this.updateBulkBar();
    container.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => this.openModal(btn.dataset.edit)));
    container.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => this.deleteProduct(btn.dataset.delete)));
    container.querySelectorAll('[data-select]').forEach(cb => cb.addEventListener('change', e => {
      if (e.target.checked) this.selected.add(e.target.dataset.select);
      else this.selected.delete(e.target.dataset.select);
      this.updateBulkBar();
    }));
    container.querySelectorAll('[data-barcode]').forEach(btn => btn.addEventListener('click', () => this.showBarcode(btn.dataset.barcode)));
  },

  gridCard(p) {
    return `
      <div class="product-card reveal">
        <div class="product-card-img">${Utils.getProductEmoji(p.category)}</div>
        <div class="product-card-body">
          <h3>${p.name}</h3>
          <div class="text-muted" style="font-size:0.8rem">${p.sku}</div>
          <div class="product-card-meta">
            <strong>${Utils.formatCurrency(p.price)}</strong>
            ${Utils.statusBadge(p.status)}
          </div>
          <div class="flex-between" style="margin-top:0.75rem;font-size:0.85rem">
            <span>Qty: <strong>${p.quantity}</strong></span>
            <span class="text-muted">${p.category}</span>
          </div>
          <div class="flex-center" style="margin-top:1rem;gap:0.5rem">
            <button class="btn btn-sm btn-secondary" data-edit="${p.id}">Edit</button>
            <button class="btn btn-sm btn-secondary" data-barcode="${p.sku}">Barcode</button>
            <button class="btn btn-sm btn-danger" data-delete="${p.id}">Delete</button>
          </div>
        </div>
      </div>`;
  },

  listRow(p) {
    return `
      <tr>
        <td><input type="checkbox" data-select="${p.id}" ${this.selected.has(p.id) ? 'checked' : ''}></td>
        <td><div class="flex-center"><span>${Utils.getProductEmoji(p.category)}</span><strong>${p.name}</strong></div></td>
        <td>${p.sku}</td>
        <td>${Utils.formatCurrency(p.price)}</td>
        <td>${p.quantity}</td>
        <td>${Utils.statusBadge(p.status)}</td>
        <td>${p.category}</td>
        <td>
          <button class="btn btn-sm btn-secondary" data-edit="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger" data-delete="${p.id}">Del</button>
        </td>
      </tr>`;
  },

  renderPagination(total) {
    const pages = Math.ceil(total / this.perPage) || 1;
    const el = document.getElementById('pagination');
    if (!el) return;
    let html = `<button ${this.page === 1 ? 'disabled' : ''} data-page="${this.page - 1}">‹</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="${i === this.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button ${this.page === pages ? 'disabled' : ''} data-page="${this.page + 1}">›</button>`;
    el.innerHTML = html;
    el.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page);
        if (p >= 1 && p <= pages) { this.page = p; this.render(); }
      });
    });
  },

  updateBulkBar() {
    const bar = document.getElementById('bulk-bar');
    if (!bar) return;
    bar.style.display = this.selected.size ? 'flex' : 'none';
    document.getElementById('bulk-count').textContent = this.selected.size;
  },

  openModal(id) {
    const form = document.getElementById('product-form');
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = id ? 'Edit Product' : 'Add Product';
    if (id) {
      const p = Storage.getProducts().find(x => x.id === id);
      if (p) {
        document.getElementById('product-id').value = p.id;
        document.getElementById('product-name').value = p.name;
        document.getElementById('product-sku').value = p.sku;
        document.getElementById('product-price').value = p.price;
        document.getElementById('product-quantity').value = p.quantity;
        document.getElementById('product-category').value = p.category;
        document.getElementById('product-supplier').value = p.supplier;
        document.getElementById('product-lowstock').value = p.lowStock || 15;
      }
    } else {
      document.getElementById('product-sku').value = Storage.generateSKU('GEN');
    }
    Utils.showModal('product-modal');
  },

  handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const data = {
      name: document.getElementById('product-name').value,
      sku: document.getElementById('product-sku').value,
      price: parseFloat(document.getElementById('product-price').value),
      quantity: parseInt(document.getElementById('product-quantity').value, 10),
      category: document.getElementById('product-category').value,
      supplier: document.getElementById('product-supplier').value,
      lowStock: parseInt(document.getElementById('product-lowstock').value, 10) || 15,
      image: ''
    };
    if (id) Storage.updateProduct(id, data);
    else Storage.addProduct(data);
    Utils.hideModal('product-modal');
    this.render();
    Storage.addNotification({ type: 'success', title: 'Product Saved', message: `${data.name} has been ${id ? 'updated' : 'added'}` });
  },

  deleteProduct(id) {
    if (confirm('Delete this product?')) {
      Storage.deleteProduct(id);
      this.selected.delete(id);
      this.render();
    }
  },

  bulkDelete() {
    if (!confirm(`Delete ${this.selected.size} products?`)) return;
    this.selected.forEach(id => Storage.deleteProduct(id));
    this.selected.clear();
    this.render();
  },

  showBarcode(sku) {
    document.getElementById('barcode-sku').textContent = sku;
    document.getElementById('barcode-bars').innerHTML = sku.split('').map(() =>
      `<span style="display:inline-block;width:${Math.random() > 0.5 ? 2 : 4}px;height:60px;background:#000;margin:0 1px"></span>`
    ).join('');
    Utils.showModal('barcode-modal');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('products');
  ProductsPage.init();
  Utils.initModals();
  Utils.hideLoader();
});

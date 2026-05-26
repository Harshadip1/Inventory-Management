/**
 * Utility functions
 */
const Utils = {
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  formatDateTime(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    return this.formatDate(dateStr);
  },

  statusBadge(status) {
    const map = {
      active: 'badge-success',
      low_stock: 'badge-warning badge-pulse',
      out_of_stock: 'badge-danger badge-pulse',
      completed: 'badge-success',
      processing: 'badge-primary',
      pending: 'badge-warning',
      shipped: 'badge-primary',
      operational: 'badge-success',
      maintenance: 'badge-warning',
      inactive: 'badge-muted',
      received: 'badge-success',
      in_transit: 'badge-primary'
    };
    const label = (status || '').replace(/_/g, ' ');
    return `<span class="badge ${map[status] || 'badge-muted'}">${label}</span>`;
  },

  stockLevel(quantity, lowStock = 15) {
    if (quantity <= 0) return { class: 'danger', label: 'Out of Stock', percent: 0 };
    const percent = Math.min(100, (quantity / (lowStock * 5)) * 100);
    if (quantity <= lowStock) return { class: 'warning', label: 'Low Stock', percent };
    return { class: 'success', label: 'In Stock', percent };
  },

  debounce(fn, delay = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  },

  showModal(id) {
    document.getElementById(id)?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  hideModal(id) {
    document.getElementById(id)?.classList.remove('active');
    document.body.style.overflow = '';
  },

  initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.hideModal(overlay.id);
      });
      overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => this.hideModal(overlay.id));
      });
    });
  },

  initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  requireAuth() {
    const authPages = ['login.html', 'register.html', 'forgot-password.html'];
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (authPages.includes(page)) return;
    if (!Storage.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  hideLoader() {
    setTimeout(() => {
      document.getElementById('page-loader')?.classList.add('hidden');
    }, 400);
  },

  exportCSV(filename, headers, rows) {
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  getProductEmoji(category) {
    return PRODUCT_EMOJIS[category] || '📦';
  }
};

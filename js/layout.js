/**
 * Shared layout - Sidebar & Topbar
 */
const Layout = {
  navItems: [
    { section: 'Main', items: [
      { href: 'index.html', icon: '📊', label: 'Dashboard', page: 'dashboard' },
      { href: 'products.html', icon: '📦', label: 'Products', page: 'products' },
      { href: 'stock.html', icon: '📋', label: 'Stock Tracking', page: 'stock' },
      { href: 'reports.html', icon: '📈', label: 'Sales & Reports', page: 'reports' }
    ]},
    { section: 'Operations', items: [
      { href: 'suppliers.html', icon: '🏭', label: 'Suppliers', page: 'suppliers' },
      { href: 'warehouses.html', icon: '🏢', label: 'Warehouses', page: 'warehouses' }
    ]},
    { section: 'Account', items: [
      { href: 'profile.html', icon: '👤', label: 'Profile & Settings', page: 'profile' }
    ]}
  ],

  render(currentPage) {
    const user = Storage.getUser();
    const initials = (user?.name || 'NA').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const unread = (Storage.getNotifications() || []).filter(n => !n.read).length;

    const navHtml = this.navItems.map(section => `
      <div class="nav-section">
        <div class="nav-section-title">${section.section}</div>
        ${section.items.map(item => `
          <a href="${item.href}" class="nav-link ${item.page === currentPage ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            ${item.label}
          </a>
        `).join('')}
      </div>
    `).join('');

    const layout = document.getElementById('app-layout');
    if (!layout) return;

    layout.innerHTML = `
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">📦</div>
          <div class="sidebar-brand">
            <h1>Niks Inventory</h1>
            <span>Enterprise IMS</span>
          </div>
        </div>
        <nav class="sidebar-nav">${navHtml}</nav>
        <div class="sidebar-footer">
          <a href="profile.html" class="sidebar-user">
            <div class="sidebar-user-avatar">${initials}</div>
            <div class="sidebar-user-info">
              <strong>${user?.name || 'User'}</strong>
              <span>${user?.role || 'Admin'}</span>
            </div>
          </a>
        </div>
      </aside>
      <div class="main-wrapper">
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">☰</button>
            <div class="search-box" id="global-search-box">
              <span>🔍</span>
              <input type="search" id="global-search" placeholder="Search products, orders, SKU..." autocomplete="off">
            </div>
          </div>
          <div class="topbar-right">
            <button class="topbar-btn" data-theme-toggle aria-label="Toggle theme">🌙</button>
            <div class="notification-wrapper">
              <button class="topbar-btn" id="notif-toggle" aria-label="Notifications">
                🔔
                ${unread > 0 ? `<span class="notification-badge">${unread > 9 ? '9+' : unread}</span>` : ''}
              </button>
              <div class="notifications-dropdown" id="notifications-dropdown"></div>
            </div>
            <a href="profile.html" class="topbar-btn" aria-label="Profile">👤</a>
          </div>
        </header>
        <main class="page-content" id="page-content"></main>
      </div>
    `;

    const source = document.getElementById('page-content-source');
    const target = document.getElementById('page-content');
    if (source && target) {
      while (source.firstChild) target.appendChild(source.firstChild);
      source.remove();
    }

    this.bindEvents();
    Notifications.renderDropdown();
    Theme.init();
  },

  bindEvents() {
    const toggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    toggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('active');
    });
    overlay?.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
    });

    document.getElementById('notif-toggle')?.addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('notifications-dropdown')?.classList.toggle('active');
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.notification-wrapper')) {
        document.getElementById('notifications-dropdown')?.classList.remove('active');
      }
    });

    const globalSearch = document.getElementById('global-search');
    globalSearch?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = globalSearch.value.trim();
        if (q) window.location.href = `products.html?search=${encodeURIComponent(q)}`;
      }
    });
  }
};

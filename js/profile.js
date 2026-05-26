/**
 * Profile & Settings page
 */
const ProfilePage = {
  init() {
    this.loadProfile();
    this.loadSettings();
    this.bindEvents();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('profile-form')?.addEventListener('submit', e => this.saveProfile(e));
    document.getElementById('company-form')?.addEventListener('submit', e => this.saveCompany(e));
    document.getElementById('notif-form')?.addEventListener('change', () => this.saveNotifPrefs());
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Storage.logout();
      window.location.href = 'login.html';
    });
    document.querySelectorAll('[data-theme-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        Theme.set(btn.dataset.themePick);
        document.querySelectorAll('[data-theme-pick]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },

  loadProfile() {
    const user = Storage.getUser();
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-role').value = user.role || '';
    document.getElementById('profile-company').value = user.company || '';
    const initials = (user.name || 'NA').split(' ').map(n => n[0]).join('').substring(0, 2);
    document.getElementById('profile-avatar').textContent = initials;
    document.getElementById('profile-display-name').textContent = user.name;
    document.getElementById('profile-display-role').textContent = user.role;
  },

  loadSettings() {
    const settings = Storage.getSettings();
    document.getElementById('company-name').value = settings.companyName || '';
    document.getElementById('currency').value = settings.currency || 'USD';
    document.getElementById('low-stock-threshold').value = settings.lowStockThreshold || 15;
    const notif = settings.notifications || {};
    document.getElementById('notif-email').checked = notif.email !== false;
    document.getElementById('notif-push').checked = notif.push !== false;
    document.getElementById('notif-lowstock').checked = notif.lowStock !== false;
    document.getElementById('notif-orders').checked = notif.orders !== false;
    const theme = settings.theme || Theme.get();
    document.querySelector(`[data-theme-pick="${theme}"]`)?.classList.add('active');
  },

  saveProfile(e) {
    e.preventDefault();
    const user = {
      ...Storage.getUser(),
      name: document.getElementById('profile-name').value,
      email: document.getElementById('profile-email').value,
      role: document.getElementById('profile-role').value,
      company: document.getElementById('profile-company').value
    };
    Storage.saveUser(user);
    this.loadProfile();
    Storage.addNotification({ type: 'success', title: 'Profile Updated', message: 'Your profile has been saved' });
  },

  saveCompany(e) {
    e.preventDefault();
    const settings = Storage.getSettings();
    settings.companyName = document.getElementById('company-name').value;
    settings.currency = document.getElementById('currency').value;
    settings.lowStockThreshold = parseInt(document.getElementById('low-stock-threshold').value, 10);
    Storage.saveSettings(settings);
    Storage.addNotification({ type: 'success', title: 'Settings Saved', message: 'Company settings updated' });
  },

  saveNotifPrefs() {
    const settings = Storage.getSettings();
    settings.notifications = {
      email: document.getElementById('notif-email').checked,
      push: document.getElementById('notif-push').checked,
      lowStock: document.getElementById('notif-lowstock').checked,
      orders: document.getElementById('notif-orders').checked
    };
    Storage.saveSettings(settings);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('profile');
  ProfilePage.init();
  Utils.initModals();
  Utils.hideLoader();
});

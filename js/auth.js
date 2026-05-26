/**
 * Authentication pages
 */
const Auth = {
  init(page) {
    Theme.init();
    Utils.hideLoader();
    if (Storage.isLoggedIn() && page !== 'forgot') {
      window.location.href = 'index.html';
      return;
    }
    if (page === 'login') this.initLogin();
    else if (page === 'register') this.initRegister();
    else if (page === 'forgot') this.initForgot();
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  },

  hideErrors() {
    document.querySelectorAll('.auth-error').forEach(el => el.classList.remove('show'));
  },

  initLogin() {
    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.hideErrors();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!this.validateEmail(email)) {
        this.showError('login-error', 'Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        this.showError('login-error', 'Password must be at least 6 characters');
        return;
      }
      Storage.login(email);
      window.location.href = 'index.html';
    });
  },

  initRegister() {
    document.getElementById('register-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.hideErrors();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      if (!name) { this.showError('register-error', 'Name is required'); return; }
      if (!this.validateEmail(email)) { this.showError('register-error', 'Invalid email'); return; }
      if (password.length < 6) { this.showError('register-error', 'Password must be 6+ characters'); return; }
      if (password !== confirm) { this.showError('register-error', 'Passwords do not match'); return; }
      const user = Storage.getUser();
      user.name = name;
      user.email = email;
      Storage.saveUser(user);
      Storage.login(email);
      window.location.href = 'index.html';
    });
  },

  initForgot() {
    document.getElementById('forgot-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.hideErrors();
      const email = document.getElementById('forgot-email').value.trim();
      if (!this.validateEmail(email)) {
        this.showError('forgot-error', 'Please enter a valid email');
        return;
      }
      document.getElementById('forgot-error').classList.remove('show');
      document.getElementById('forgot-success').classList.add('show');
      document.getElementById('forgot-success').textContent = 'Reset link sent! Check your inbox.';
      e.target.querySelector('button[type=submit]').disabled = true;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  const page = document.body.dataset.authPage;
  Auth.init(page);
});

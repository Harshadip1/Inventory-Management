/**
 * Theme switching - Dark/Light mode
 */
const Theme = {
  init() {
    const settings = Storage.getSettings();
    const saved = settings?.theme || localStorage.getItem('niks_theme') || 'dark';
    this.set(saved);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('niks_theme', theme);
    const settings = Storage.getSettings();
    if (settings) {
      settings.theme = theme;
      Storage.saveSettings(settings);
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  get() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
};

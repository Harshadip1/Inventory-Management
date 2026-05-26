/**
 * Notifications system
 */
const Notifications = {
  icons: { warning: '⚠️', danger: '🔴', success: '✅', info: 'ℹ️' },

  renderDropdown() {
    const container = document.getElementById('notifications-dropdown');
    if (!container) return;

    const list = Storage.getNotifications();
    const unread = list.filter(n => !n.read).length;

    container.innerHTML = `
      <div class="notifications-header">
        <strong>Notifications</strong>
        ${unread > 0 ? `<button class="btn btn-sm btn-secondary" id="mark-all-read">Mark all read</button>` : ''}
      </div>
      <div class="notifications-list">
        ${list.length ? list.slice(0, 8).map(n => `
          <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
            <div class="notification-icon ${n.type}">${this.icons[n.type] || 'ℹ️'}</div>
            <div class="notification-content">
              <p><strong>${n.title}</strong> — ${n.message}</p>
              <span class="time">${Utils.formatDateTime(n.time)}</span>
            </div>
          </div>
        `).join('') : '<div class="empty-state" style="padding:2rem"><p>No notifications</p></div>'}
      </div>
      <div class="notifications-footer">
        <a href="stock.html">View all alerts</a>
      </div>
    `;

    document.getElementById('mark-all-read')?.addEventListener('click', () => {
      Storage.markAllNotificationsRead();
      this.renderDropdown();
      this.updateBadge();
    });

    container.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        Storage.markNotificationRead(item.dataset.id);
        this.renderDropdown();
        this.updateBadge();
      });
    });
  },

  updateBadge() {
    const unread = (Storage.getNotifications() || []).filter(n => !n.read).length;
    const btn = document.getElementById('notif-toggle');
    if (!btn) return;
    let badge = btn.querySelector('.notification-badge');
    if (unread > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge';
        btn.appendChild(badge);
      }
      badge.textContent = unread > 9 ? '9+' : unread;
    } else if (badge) badge.remove();
  }
};

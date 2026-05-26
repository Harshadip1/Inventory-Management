/**
 * Sales & Reports page
 */
const ReportsPage = {
  init() {
    this.renderCharts();
    this.renderTopProducts();
    this.renderSalesTable();
    this.bindEvents();
    Utils.initReveal();
  },

  bindEvents() {
    document.getElementById('export-report')?.addEventListener('click', () => this.exportReport());
    document.getElementById('date-from')?.addEventListener('change', () => this.renderSalesTable());
    document.getElementById('date-to')?.addEventListener('change', () => this.renderSalesTable());
    document.getElementById('report-period')?.addEventListener('change', e => {
      this.updateChartsForPeriod(e.target.value);
    });
  },

  renderCharts() {
    const monthly = SEED_DATA.salesMonthly;
    Charts.drawLineChart('report-revenue-chart', monthly.map(m => m.month), [
      { data: monthly.map(m => m.revenue), color: '#7C3AED' }
    ], { height: 300 });
    Charts.drawBarChart('report-performance-chart',
      SEED_DATA.topProducts.slice(0, 5).map(p => p.name.substring(0, 12) + '…'),
      SEED_DATA.topProducts.slice(0, 5).map(p => p.sold),
      { height: 300 }
    );
    Charts.drawPieChart('report-category-chart',
      SEED_DATA.categorySales.map(c => c.category),
      SEED_DATA.categorySales.map(c => c.value)
    );
    window.addEventListener('resize', Utils.debounce(() => this.renderCharts(), 250));
  },

  updateChartsForPeriod(period) {
    const multipliers = { week: 0.25, month: 1, quarter: 3, year: 12 };
    const m = multipliers[period] || 1;
    const monthly = SEED_DATA.salesMonthly.map(x => ({ ...x, revenue: Math.round(x.revenue * m / 5) }));
    Charts.drawLineChart('report-revenue-chart', monthly.map(x => x.month), [
      { data: monthly.map(x => x.revenue), color: '#7C3AED' }
    ], { height: 300 });
  },

  renderTopProducts() {
    const container = document.getElementById('top-products-list');
    container.innerHTML = SEED_DATA.topProducts.map((p, i) => `
      <div class="flex-between reveal" style="padding:0.85rem 0;border-bottom:1px solid var(--border)">
        <div class="flex-center">
          <span style="width:28px;height:28px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600">${i + 1}</span>
          <div>
            <strong style="font-size:0.9rem">${p.name}</strong>
            <div class="text-muted" style="font-size:0.75rem">${p.sold} units sold</div>
          </div>
        </div>
        <strong style="color:var(--success)">${Utils.formatCurrency(p.revenue)}</strong>
      </div>
    `).join('');
  },

  renderSalesTable() {
    const orders = Storage.get('orders') || [];
    const tbody = document.getElementById('sales-table-body');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${o.items}</td>
        <td>${Utils.formatCurrency(o.total)}</td>
        <td>${Utils.statusBadge(o.status)}</td>
        <td>${Utils.formatDate(o.date)}</td>
      </tr>
    `).join('');
  },

  exportReport() {
    const orders = Storage.get('orders') || [];
    Utils.exportCSV('niks-inventory-report.csv',
      ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'],
      orders.map(o => [o.id, o.customer, o.items, o.total, o.status, o.date])
    );
    Storage.addNotification({ type: 'success', title: 'Report Exported', message: 'Sales report downloaded successfully' });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Storage.init();
  Utils.requireAuth();
  Layout.render('reports');
  ReportsPage.init();
  Utils.initModals();
  Utils.hideLoader();
});

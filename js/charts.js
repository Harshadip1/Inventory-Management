/**
 * Canvas charts - Vanilla JS
 */
const Charts = {
  colors: ['#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#A78BFA'],

  drawLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 280) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (options.height || 280) + 'px';
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = options.height || 280;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const allValues = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allValues, 1) * 1.1;
    const minVal = Math.min(0, ...allValues);

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = pad.left + (chartW / (labels.length - 1 || 1)) * i;
      ctx.fillText(label, x, h - 10);
    });

    datasets.forEach((ds, di) => {
      const color = ds.color || this.colors[di % this.colors.length];
      const points = ds.data.map((val, i) => ({
        x: pad.left + (chartW / (labels.length - 1 || 1)) * i,
        y: pad.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
      }));

      // Gradient fill
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '00');
      ctx.beginPath();
      ctx.moveTo(points[0].x, pad.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      // Points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  },

  drawBarChart(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 280) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (options.height || 280) + 'px';
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = options.height || 280;
    const pad = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data, 1) * 1.1;
    const barW = chartW / data.length * 0.6;
    const gap = chartW / data.length;

    ctx.clearRect(0, 0, w, h);

    data.forEach((val, i) => {
      const barH = (val / maxVal) * chartH;
      const x = pad.left + gap * i + (gap - barW) / 2;
      const y = pad.top + chartH - barH;
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, this.colors[i % this.colors.length]);
      grad.addColorStop(1, this.colors[(i + 1) % this.colors.length] + '80');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 4);
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, h - 15);
    });
  },

  drawPieChart(canvasId, labels, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.clientWidth, 260);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);
    const total = data.reduce((a, b) => a + b, 0);
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 30;
    let start = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);
    data.forEach((val, i) => {
      const slice = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();
      start += slice;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#0F172A';
    ctx.fill();

    // Legend
    let ly = 20;
    labels.forEach((label, i) => {
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fillRect(size - 100, ly, 10, 10);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'left';
      ctx.fillText(`${label} (${data[i]}%)`, size - 85, ly + 9);
      ly += 18;
    });
  },

  animateCounter(el, target, duration = 1500, prefix = '', suffix = '') {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
};

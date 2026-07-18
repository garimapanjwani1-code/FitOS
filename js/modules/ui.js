/**
 * UI Utilities
 */

export const UI = {
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  showModal(title, content, onClose) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" id="modal-close-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">${content}</div>
        </div>
      </div>
    `;
    const overlay = container.querySelector('.modal-overlay');
    const closeBtn = container.querySelector('#modal-close-btn');
    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => { container.innerHTML = ''; if (onClose) onClose(); }, 200);
    };
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    return { close, modal: container.querySelector('.modal-body') };
  },

  id() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  today() {
    return new Date().toISOString().split('T')[0];
  },

  formatDate(date) {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  },

  // Get current week's dates (Mon-Sun)
  getCurrentWeekDates() {
    return this.getWeekDatesForDate(this.today());
  },

  // Get week dates (Mon-Sun) for any given date
  getWeekDatesForDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  },

  // Get the Monday of the week for a given date
  getWeekStartForDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    return monday.toISOString().split('T')[0];
  },

  progressRing(size, strokeWidth, progress, color) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return `
      <div class="progress-ring" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}">
          <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}" 
            stroke-width="${strokeWidth}" fill="none"/>
          <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${radius}" 
            stroke-width="${strokeWidth}" fill="none"
            stroke="${color || 'var(--accent)'}"
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${offset}"/>
        </svg>
      </div>
    `;
  }
};

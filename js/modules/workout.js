/**
 * Workout Tab - 6 day buttons with full workout plans + exercise images
 */

import { UI } from './ui.js';
import { WORKOUT_PLAN, DAY_LABELS, DAY_COLORS } from '../data/workouts.js';

export class WorkoutPage {
  constructor(container) {
    this.container = container;
    this.selectedDay = this.getTodayDay();
  }

  getTodayDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return WORKOUT_PLAN[today] ? today : 'monday';
  }

  render() {
    const days = Object.keys(WORKOUT_PLAN);
    const workout = WORKOUT_PLAN[this.selectedDay];
    const todayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];

    this.container.innerHTML = `
      <div class="page animate-fade">
        <div class="page-header">
          <h1 class="title">Workout</h1>
        </div>

        <!-- Day Selector - 6 Buttons -->
        <div class="day-selector">
          ${days.map(day => `
            <button class="day-btn ${day === this.selectedDay ? 'active' : ''} ${day === todayName ? 'today' : ''}" 
                    data-day="${day}" 
                    style="${day === this.selectedDay ? `background:${DAY_COLORS[day]};color:#000;` : ''}">
              <span class="day-btn-label">${DAY_LABELS[day]}</span>
            </button>
          `).join('')}
        </div>

        <!-- Workout Card -->
        <div class="workout-detail">
          <div class="workout-title-card" style="border-left: 4px solid ${DAY_COLORS[this.selectedDay]};">
            <div class="headline">${workout.title}</div>
            <div class="caption">${workout.time}</div>
          </div>

          <!-- Warmup -->
          <div class="workout-section">
            <div class="workout-section-title">🔥 Warm-up & Mobility</div>
            <ul class="warmup-list">
              ${workout.warmup.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>

          <!-- Exercises -->
          <div class="workout-section">
            <div class="workout-section-title">💪 Exercises</div>
            ${workout.exercises.map((ex, i) => `
              <div class="exercise-row has-image" data-image="${ex.image || ''}">
                <div class="exercise-num">${i + 1}</div>
                <div class="exercise-info">
                  <div class="exercise-name-row">
                    <span class="exercise-name">${ex.name}</span>
                    <span class="exercise-badge">${ex.type}</span>
                  </div>
                  <div class="exercise-detail">${ex.sets} × ${ex.reps}</div>
                  ${ex.muscles ? `<div class="exercise-muscles">${ex.muscles}</div>` : ''}
                  ${ex.note ? `<div class="exercise-note">${ex.note}</div>` : ''}
                  ${ex.image ? `
                    <div class="exercise-img-container" id="img-${i}">
                      <img src="images/exercises/${ex.image}" 
                           alt="${ex.name}" 
                           class="exercise-img"
                           loading="lazy"
                           onerror="this.parentElement.classList.add('no-image')">
                      <div class="img-placeholder">📷 Tap to expand</div>
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Core Section -->
          ${workout.core && workout.core.length > 0 ? `
            <div class="workout-section">
              <div class="workout-section-title">🧱 Core</div>
              ${workout.core.map(ex => `
                <div class="exercise-row">
                  <div class="exercise-num">•</div>
                  <div class="exercise-info">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-detail">${ex.sets} × ${ex.reps}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Day selector
    this.container.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedDay = btn.dataset.day;
        this.render();
      });
    });

    // Tap exercise row to expand/collapse image
    this.container.querySelectorAll('.exercise-row.has-image').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const imgContainer = row.querySelector('.exercise-img-container');
        if (imgContainer) {
          imgContainer.classList.toggle('expanded');
        }
      });
    });

    // Tap image to view fullscreen
    this.container.querySelectorAll('.exercise-img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showFullImage(img.src, img.alt);
      });
    });
  }

  showFullImage(src, alt) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay" style="align-items:center; padding: 20px;">
        <div style="position:relative; max-width:100%; max-height:90vh;">
          <img src="${src}" alt="${alt}" style="width:100%; height:auto; border-radius:var(--radius-md); max-height:85vh; object-fit:contain;">
          <div style="text-align:center; margin-top:var(--space-md); color:var(--text-secondary); font-size:var(--text-sm);">${alt}</div>
        </div>
      </div>
    `;
    container.querySelector('.modal-overlay').addEventListener('click', () => {
      container.innerHTML = '';
    });
  }

  destroy() {}
}

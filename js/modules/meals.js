/**
 * Meals Tab - Pre-loaded meals with edit, cheat tracking, weekly averages
 */

import { DB } from './db.js';
import { UI } from './ui.js';
import { DEFAULT_MEALS, MEAL_SLOTS, SLOT_LABELS, DAILY_TARGETS } from '../data/meals.js';

export class MealsPage {
  constructor(container) {
    this.container = container;
    this.selectedDate = UI.today();
  }

  // Get saved/edited meals (falls back to defaults)
  // Uses a version key to detect when defaults change in code updates
  getSavedMeals() {
    const MEAL_VERSION = '2'; // Bump this when DEFAULT_MEALS change
    const savedVersion = localStorage.getItem('fitos-meals-version');
    if (savedVersion !== MEAL_VERSION) {
      // Defaults have changed — reset to new defaults
      localStorage.removeItem('fitos-saved-meals');
      localStorage.setItem('fitos-meals-version', MEAL_VERSION);
      return DEFAULT_MEALS;
    }
    const saved = localStorage.getItem('fitos-saved-meals');
    return saved ? JSON.parse(saved) : DEFAULT_MEALS;
  }

  saveMeals(meals) {
    localStorage.setItem('fitos-saved-meals', JSON.stringify(meals));
  }

  async render() {
    const entries = await DB.getByIndex('nutrition', 'date', this.selectedDate);
    const allNutrition = await DB.getAll('nutrition');
    const savedMeals = this.getSavedMeals();

    // Group by slot
    const slotMeals = {};
    MEAL_SLOTS.forEach(s => slotMeals[s] = []);
    entries.forEach(e => {
      if (slotMeals[e.slot]) slotMeals[e.slot].push(e);
    });

    // Day totals
    let dayCal = 0, dayProtein = 0, dayCarbs = 0, dayFat = 0, dayFiber = 0;
    entries.forEach(e => {
      dayCal += e.calories || 0;
      dayProtein += e.protein || 0;
      dayCarbs += e.carbs || 0;
      dayFat += e.fat || 0;
      dayFiber += e.fiber || 0;
    });

    // Weekly average
    const weekDates = UI.getWeekDatesForDate(this.selectedDate);
    let weekCal = 0, weekDaysLogged = 0;
    weekDates.forEach(dateStr => {
      const dayEntries = allNutrition.filter(n => n.date === dateStr);
      if (dayEntries.length > 0) {
        weekDaysLogged++;
        dayEntries.forEach(e => { weekCal += e.calories || 0; });
      }
    });
    const weekAvg = weekDaysLogged > 0 ? Math.round(weekCal / weekDaysLogged) : 0;

    // Cheat day check
    const cheatData = JSON.parse(localStorage.getItem('fitos-cheat-days') || '{}');
    const isCheatDay = cheatData[this.selectedDate] || false;

    // Weekly history
    const weeklyHistory = this.getWeeklyHistory(allNutrition);

    const isToday = this.selectedDate === UI.today();
    const displayDate = new Date(this.selectedDate + 'T00:00:00');
    const dateLabel = displayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    this.container.innerHTML = `
      <div class="page animate-fade">
        <div class="page-header">
          <h1 class="title">Meals</h1>
        </div>

        <!-- Date Selector -->
        <div class="date-selector">
          <button class="btn-icon date-nav" id="date-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="date-display" id="date-picker-btn">
            <span>${isToday ? 'Today' : dateLabel}</span>
            <input type="date" id="date-input" value="${this.selectedDate}" style="position:absolute;opacity:0;width:0;height:0;">
          </button>
          <button class="btn-icon date-nav" id="date-next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- Day Summary -->
        <div class="card day-summary">
          <div class="flex-between">
            <div>
              <div class="headline">${dayCal} cal</div>
              <div class="caption">of ${DAILY_TARGETS.calories} target</div>
            </div>
            <div style="text-align:right;">
              <div class="headline" style="color:${DAILY_TARGETS.calories - dayCal >= 0 ? 'var(--success)' : 'var(--danger)'}">
                ${DAILY_TARGETS.calories - dayCal}
              </div>
              <div class="caption">remaining</div>
            </div>
          </div>
          <div class="progress-bar" style="margin-top:var(--space-md);">
            <div class="fill" style="width:${Math.min(100, (dayCal / DAILY_TARGETS.calories) * 100)}%"></div>
          </div>
          <div class="macro-bar-compact">
            <span style="color:var(--accent)">P: ${dayProtein}g</span>
            <span style="color:var(--warning)">C: ${dayCarbs}g</span>
            <span style="color:var(--danger)">F: ${dayFat}g</span>
            <span style="color:var(--success)">Fb: ${dayFiber}g</span>
          </div>
        </div>

        <!-- Cheat Day Toggle -->
        <div class="card cheat-card" style="margin-bottom: var(--space-md);">
          <div class="flex-between">
            <div>
              <span style="font-size: var(--text-base); font-weight: var(--weight-medium);">Did you cheat today? 🍕</span>
            </div>
            <button class="toggle ${isCheatDay ? 'active' : ''}" id="cheat-toggle"></button>
          </div>
          ${isCheatDay ? '<div class="caption" style="margin-top:var(--space-sm);color:var(--warning);">It\'s okay — one day won\'t break your progress. Get back on track tomorrow! 💛</div>' : ''}
        </div>

        <!-- Weekly Average Badge -->
        <div class="card week-avg-card">
          <div class="flex-between">
            <span class="caption">This week's daily avg</span>
            <span class="headline">${weekAvg} cal/day</span>
          </div>
        </div>

        <!-- Quick Add Preloaded Meals -->
        <div class="section" style="margin-top: var(--space-lg);">
          <div class="section-header">
            <span class="subheadline">TODAY'S PLAN</span>
            <button class="btn btn-ghost btn-sm" id="edit-meals-btn">✏️ Edit Plan</button>
          </div>
          <div class="preloaded-meals">
            ${savedMeals.map(meal => {
              const alreadyAdded = entries.some(e => e.presetId === meal.id && e.slot === meal.slot);
              return `
                <div class="preloaded-meal ${alreadyAdded ? 'added' : ''}">
                  <div class="preloaded-meal-info">
                    <div class="preloaded-meal-slot">${SLOT_LABELS[meal.slot]}</div>
                    <div class="preloaded-meal-name">${meal.name}</div>
                    <div class="preloaded-meal-macros">${meal.calories} cal • P:${meal.protein}g C:${meal.carbs}g F:${meal.fat}g Fb:${meal.fiber}g</div>
                  </div>
                  ${alreadyAdded 
                    ? '<span class="preloaded-check">✓</span>'
                    : `<button class="btn btn-sm btn-primary add-preset-btn" data-meal-id="${meal.id}">+</button>`
                  }
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Logged Meals by Slot -->
        <div class="section" style="margin-top: var(--space-xl);">
          <div class="section-header">
            <span class="subheadline">LOGGED TODAY</span>
          </div>
          ${MEAL_SLOTS.map(slot => this.renderSlot(slot, slotMeals[slot])).join('')}
        </div>

        <!-- Weekly History -->
        ${weeklyHistory.length > 0 ? `
          <div class="section" style="margin-top: var(--space-xl);">
            <div class="subheadline" style="margin-bottom: var(--space-md);">WEEKLY AVERAGES</div>
            ${weeklyHistory.slice(0, 6).map(w => `
              <div class="list-item">
                <div class="list-item-content">
                  <div class="list-item-title">Week of ${w.weekStart}</div>
                  <div class="list-item-subtitle">${w.daysLogged} days logged</div>
                </div>
                <span style="font-weight:600; color:${w.avg <= DAILY_TARGETS.calories ? 'var(--success)' : 'var(--danger)'};">${w.avg} cal/day</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    this.attachEvents();
  }

  renderSlot(slot, items) {
    if (items.length === 0) return '';
    const totalCal = items.reduce((sum, i) => sum + (i.calories || 0), 0);
    return `
      <div class="meal-slot-card">
        <div class="meal-slot-header">
          <span class="meal-slot-title">${SLOT_LABELS[slot]}</span>
          <span class="meal-slot-cal">${totalCal} cal</span>
        </div>
        ${items.map(item => `
          <div class="food-item">
            <div>
              <div class="food-name">${item.name}</div>
              <div class="food-macros">P:${item.protein}g C:${item.carbs}g F:${item.fat}g Fb:${item.fiber || 0}g</div>
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-sm);">
              <span class="food-cal">${item.calories}</span>
              <button class="delete-food" data-id="${item.id}">×</button>
            </div>
          </div>
        `).join('')}
        <button class="add-meal-btn" data-slot="${slot}">+ Add more</button>
      </div>
    `;
  }

  getWeeklyHistory(allNutrition) {
    const weeks = {};
    allNutrition.forEach(entry => {
      const weekStart = UI.getWeekStartForDate(entry.date);
      if (!weeks[weekStart]) weeks[weekStart] = { cal: 0, days: new Set() };
      weeks[weekStart].cal += entry.calories || 0;
      weeks[weekStart].days.add(entry.date);
    });
    return Object.entries(weeks)
      .map(([weekStart, data]) => ({
        weekStart,
        avg: Math.round(data.cal / data.days.size),
        daysLogged: data.days.size
      }))
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }

  attachEvents() {
    // Date navigation
    this.container.querySelector('#date-prev')?.addEventListener('click', () => {
      const d = new Date(this.selectedDate + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      this.selectedDate = d.toISOString().split('T')[0];
      this.render();
    });
    this.container.querySelector('#date-next')?.addEventListener('click', () => {
      const d = new Date(this.selectedDate + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      this.selectedDate = d.toISOString().split('T')[0];
      this.render();
    });

    // Date picker
    const dateInput = this.container.querySelector('#date-input');
    const dateBtn = this.container.querySelector('#date-picker-btn');
    dateBtn?.addEventListener('click', () => { dateInput.showPicker?.() || dateInput.click(); });
    dateInput?.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      this.render();
    });

    // Cheat toggle
    this.container.querySelector('#cheat-toggle')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      const cheatData = JSON.parse(localStorage.getItem('fitos-cheat-days') || '{}');
      cheatData[this.selectedDate] = btn.classList.contains('active');
      localStorage.setItem('fitos-cheat-days', JSON.stringify(cheatData));
      this.render();
    });

    // Add preset meal
    this.container.querySelectorAll('.add-preset-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const savedMeals = this.getSavedMeals();
        const meal = savedMeals.find(m => m.id === btn.dataset.mealId);
        if (!meal) return;

        await DB.add('nutrition', {
          id: UI.id(),
          date: this.selectedDate,
          slot: meal.slot,
          presetId: meal.id,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber
        });
        UI.toast(`${meal.name} added`, 'success');
        this.render();
      });
    });

    // Delete food
    this.container.querySelectorAll('.delete-food').forEach(btn => {
      btn.addEventListener('click', async () => {
        await DB.delete('nutrition', btn.dataset.id);
        this.render();
      });
    });

    // Add more to slot
    this.container.querySelectorAll('.add-meal-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showAddCustom(btn.dataset.slot));
    });

    // Edit meals plan
    this.container.querySelector('#edit-meals-btn')?.addEventListener('click', () => {
      this.showEditMeals();
    });
  }

  showAddCustom(slot) {
    const savedMeals = this.getSavedMeals();
    const customMeals = JSON.parse(localStorage.getItem('fitos-extra-meals') || '[]');
    const allOptions = [...savedMeals, ...customMeals];

    const content = `
      <div class="flex-col">
        ${allOptions.length > 0 ? `
          <div class="subheadline" style="margin-bottom:var(--space-sm);">Quick Add Saved Meal</div>
          <div class="preset-list">
            ${allOptions.map(m => `
              <button class="preset-meal-btn" data-meal='${JSON.stringify(m)}'>
                <div class="preset-name">${m.name}</div>
                <div class="preset-macros">${m.calories} cal • P:${m.protein}g C:${m.carbs}g</div>
              </button>
            `).join('')}
          </div>
          <div class="divider"></div>
        ` : ''}
        <div class="subheadline" style="margin-bottom:var(--space-sm);">Add Custom Food</div>
        <div class="input-group">
          <input class="input" id="meal-name" placeholder="Food name">
        </div>
        <div class="grid-2">
          <div class="input-group">
            <label class="input-label">Calories</label>
            <input class="input" id="meal-cal" type="number" placeholder="0">
          </div>
          <div class="input-group">
            <label class="input-label">Protein (g)</label>
            <input class="input" id="meal-protein" type="number" placeholder="0">
          </div>
        </div>
        <div class="grid-3">
          <div class="input-group">
            <label class="input-label">Carbs</label>
            <input class="input" id="meal-carbs" type="number" placeholder="0">
          </div>
          <div class="input-group">
            <label class="input-label">Fat</label>
            <input class="input" id="meal-fat" type="number" placeholder="0">
          </div>
          <div class="input-group">
            <label class="input-label">Fiber</label>
            <input class="input" id="meal-fiber" type="number" placeholder="0">
          </div>
        </div>
        <label style="display:flex;align-items:center;gap:var(--space-sm);color:var(--text-secondary);font-size:var(--text-sm);margin-top:var(--space-sm);">
          <input type="checkbox" id="save-extra"> Save for future use
        </label>
        <button class="btn btn-primary btn-full" id="add-custom-meal" style="margin-top:var(--space-md);">Add</button>
      </div>
    `;

    const { close, modal } = UI.showModal(`Add to ${SLOT_LABELS[slot]}`, content);

    // Quick add preset
    modal.querySelectorAll('.preset-meal-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const meal = JSON.parse(btn.dataset.meal);
        await DB.add('nutrition', {
          id: UI.id(),
          date: this.selectedDate,
          slot,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber || 0
        });
        close();
        UI.toast(`${meal.name} added`, 'success');
        this.render();
      });
    });

    // Custom add
    modal.querySelector('#add-custom-meal').addEventListener('click', async () => {
      const name = modal.querySelector('#meal-name').value.trim();
      if (!name) { UI.toast('Enter a name', 'error'); return; }

      const data = {
        name,
        calories: parseInt(modal.querySelector('#meal-cal').value) || 0,
        protein: parseInt(modal.querySelector('#meal-protein').value) || 0,
        carbs: parseInt(modal.querySelector('#meal-carbs').value) || 0,
        fat: parseInt(modal.querySelector('#meal-fat').value) || 0,
        fiber: parseInt(modal.querySelector('#meal-fiber').value) || 0
      };

      await DB.add('nutrition', { id: UI.id(), date: this.selectedDate, slot, ...data });

      if (modal.querySelector('#save-extra').checked) {
        const extras = JSON.parse(localStorage.getItem('fitos-extra-meals') || '[]');
        extras.push({ id: UI.id(), slot, ...data });
        localStorage.setItem('fitos-extra-meals', JSON.stringify(extras));
      }

      close();
      UI.toast(`${name} added`, 'success');
      this.render();
    });
  }

  showEditMeals() {
    const savedMeals = this.getSavedMeals();

    const content = `
      <div class="flex-col">
        <p class="caption" style="margin-bottom: var(--space-md);">Edit your default meal plan. Changes apply to future days.</p>
        ${savedMeals.map((meal, i) => `
          <div class="card" style="margin-bottom: var(--space-md); padding: var(--space-md);">
            <div class="flex-between" style="margin-bottom: var(--space-sm);">
              <div>
                <div style="font-size:var(--text-xs);color:var(--text-secondary);">${SLOT_LABELS[meal.slot]}</div>
                <div style="font-weight:var(--weight-semibold);">${meal.name}</div>
              </div>
              <button class="btn btn-sm btn-ghost edit-single-meal" data-index="${i}">Edit</button>
            </div>
            <div style="font-size:var(--text-xs);color:var(--text-secondary);">
              ${meal.calories} cal • P:${meal.protein}g C:${meal.carbs}g F:${meal.fat}g Fb:${meal.fiber}g
            </div>
          </div>
        `).join('')}
        <button class="btn btn-secondary btn-full" id="reset-defaults">Reset to Defaults</button>
      </div>
    `;

    const { close, modal } = UI.showModal('Edit Meal Plan', content);

    // Edit individual meal
    modal.querySelectorAll('.edit-single-meal').forEach(btn => {
      btn.addEventListener('click', () => {
        close();
        this.showEditSingleMeal(parseInt(btn.dataset.index));
      });
    });

    // Reset to defaults
    modal.querySelector('#reset-defaults')?.addEventListener('click', () => {
      localStorage.removeItem('fitos-saved-meals');
      close();
      UI.toast('Reset to default meals', 'success');
      this.render();
    });
  }

  showEditSingleMeal(index) {
    const savedMeals = this.getSavedMeals();
    const meal = savedMeals[index];

    const content = `
      <div class="flex-col">
        <div class="input-group">
          <label class="input-label">Meal Name</label>
          <input class="input" id="edit-name" value="${meal.name}">
        </div>
        <div class="input-group">
          <label class="input-label">Slot</label>
          <select class="input" id="edit-slot">
            ${MEAL_SLOTS.map(s => `<option value="${s}" ${s === meal.slot ? 'selected' : ''}>${SLOT_LABELS[s]}</option>`).join('')}
          </select>
        </div>
        <div class="grid-2">
          <div class="input-group">
            <label class="input-label">Calories</label>
            <input class="input" id="edit-cal" type="number" value="${meal.calories}">
          </div>
          <div class="input-group">
            <label class="input-label">Protein (g)</label>
            <input class="input" id="edit-protein" type="number" value="${meal.protein}">
          </div>
        </div>
        <div class="grid-3">
          <div class="input-group">
            <label class="input-label">Carbs</label>
            <input class="input" id="edit-carbs" type="number" value="${meal.carbs}">
          </div>
          <div class="input-group">
            <label class="input-label">Fat</label>
            <input class="input" id="edit-fat" type="number" value="${meal.fat}">
          </div>
          <div class="input-group">
            <label class="input-label">Fiber</label>
            <input class="input" id="edit-fiber" type="number" value="${meal.fiber}">
          </div>
        </div>
        <div class="subheadline" style="margin-top: var(--space-md);">Ingredients</div>
        <textarea class="input" id="edit-ingredients" rows="4" style="resize:vertical;">${(meal.ingredients || []).map(i => i.name).join('\n')}</textarea>
        <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);">
          <button class="btn btn-primary btn-full" id="save-edit">Save</button>
          <button class="btn btn-danger btn-sm" id="delete-meal">Delete</button>
        </div>
      </div>
    `;

    const { close, modal } = UI.showModal(`Edit: ${meal.name}`, content);

    modal.querySelector('#save-edit').addEventListener('click', () => {
      savedMeals[index] = {
        ...meal,
        name: modal.querySelector('#edit-name').value.trim() || meal.name,
        slot: modal.querySelector('#edit-slot').value,
        calories: parseInt(modal.querySelector('#edit-cal').value) || 0,
        protein: parseInt(modal.querySelector('#edit-protein').value) || 0,
        carbs: parseInt(modal.querySelector('#edit-carbs').value) || 0,
        fat: parseInt(modal.querySelector('#edit-fat').value) || 0,
        fiber: parseInt(modal.querySelector('#edit-fiber').value) || 0
      };
      this.saveMeals(savedMeals);
      close();
      UI.toast('Meal updated', 'success');
      this.render();
    });

    modal.querySelector('#delete-meal')?.addEventListener('click', () => {
      savedMeals.splice(index, 1);
      this.saveMeals(savedMeals);
      close();
      UI.toast('Meal removed from plan', 'success');
      this.render();
    });
  }

  destroy() {}
}

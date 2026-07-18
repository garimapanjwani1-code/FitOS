/**
 * Home Tab - Dashboard showing calories, macros, streak
 */

import { DB } from './db.js';
import { UI } from './ui.js';
import { DAILY_TARGETS } from '../data/meals.js';

export class HomePage {
  constructor(container) {
    this.container = container;
  }

  async render() {
    const today = UI.today();
    const todayEntries = await DB.getByIndex('nutrition', 'date', today);

    // Today's totals
    let dayCal = 0, dayProtein = 0, dayCarbs = 0, dayFat = 0, dayFiber = 0;
    todayEntries.forEach(e => {
      dayCal += e.calories || 0;
      dayProtein += e.protein || 0;
      dayCarbs += e.carbs || 0;
      dayFat += e.fat || 0;
      dayFiber += e.fiber || 0;
    });

    // Week totals (Mon-Sun of current week)
    const weekDates = UI.getCurrentWeekDates();
    const allNutrition = await DB.getAll('nutrition');
    let weekCal = 0, weekProtein = 0, weekCarbs = 0, weekFiber = 0, weekDaysLogged = 0;

    weekDates.forEach(dateStr => {
      const dayEntries = allNutrition.filter(n => n.date === dateStr);
      if (dayEntries.length > 0) {
        weekDaysLogged++;
        dayEntries.forEach(e => {
          weekCal += e.calories || 0;
          weekProtein += e.protein || 0;
          weekCarbs += e.carbs || 0;
          weekFiber += e.fiber || 0;
        });
      }
    });

    const weekAvgCal = weekDaysLogged > 0 ? Math.round(weekCal / weekDaysLogged) : 0;
    const weekAvgProtein = weekDaysLogged > 0 ? Math.round(weekProtein / weekDaysLogged) : 0;
    const weekAvgCarbs = weekDaysLogged > 0 ? Math.round(weekCarbs / weekDaysLogged) : 0;
    const weekAvgFiber = weekDaysLogged > 0 ? Math.round(weekFiber / weekDaysLogged) : 0;

    // Weekly calorie budget
    const weeklyBudget = DAILY_TARGETS.calories * 7;
    const weeklyRemaining = weeklyBudget - weekCal;

    // Streak
    const streak = await this.calculateStreak(allNutrition);

    // Remaining today
    const dayRemaining = DAILY_TARGETS.calories - dayCal;
    const calPercent = Math.min(100, (dayCal / DAILY_TARGETS.calories) * 100);

    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    this.container.innerHTML = `
      <div class="page animate-fade">
        <div class="page-header">
          <h1 class="title-large">FitOS</h1>
          <p class="caption">${dateStr}</p>
        </div>

        <!-- Daily Calories Card -->
        <div class="card" style="margin-bottom: var(--space-lg); text-align: center;">
          <div class="subheadline" style="margin-bottom: var(--space-md);">TODAY</div>
          <div class="calorie-ring-container">
            ${UI.progressRing(150, 10, calPercent)}
            <div style="position:absolute; text-align:center;">
              <div style="font-size:var(--text-3xl); font-weight:var(--weight-bold); color:${dayRemaining >= 0 ? 'var(--text-primary)' : 'var(--danger)'};">${dayRemaining}</div>
              <div class="caption">of ${DAILY_TARGETS.calories} remaining</div>
            </div>
          </div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-top: var(--space-sm);">
            ${dayCal} consumed
          </div>
        </div>

        <!-- Daily Macros -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <div class="subheadline" style="margin-bottom: var(--space-md);">TODAY'S MACROS</div>
          <div class="macro-grid">
            ${this.macroRow('Protein', dayProtein, DAILY_TARGETS.protein, 'g', 'var(--accent)')}
            ${this.macroRow('Carbs', dayCarbs, DAILY_TARGETS.carbs, 'g', 'var(--warning)')}
            ${this.macroRow('Fat', dayFat, DAILY_TARGETS.fat, 'g', 'var(--danger)')}
            ${this.macroRow('Fiber', dayFiber, DAILY_TARGETS.fiber, 'g', 'var(--success)')}
          </div>
        </div>

        <!-- Weekly Summary -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <div class="subheadline" style="margin-bottom: var(--space-md);">WEEKLY SUMMARY</div>
          <div class="grid-2" style="margin-bottom: var(--space-md);">
            <div class="stat-mini">
              <div class="stat-mini-value">${weekCal}</div>
              <div class="stat-mini-label">of ${weeklyBudget} cal</div>
            </div>
            <div class="stat-mini">
              <div class="stat-mini-value" style="color:${weeklyRemaining >= 0 ? 'var(--success)' : 'var(--danger)'};">${weeklyRemaining}</div>
              <div class="stat-mini-label">remaining this week</div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="subheadline" style="margin-bottom: var(--space-sm);">DAILY AVERAGES (${weekDaysLogged} days logged)</div>
          <div class="grid-2" style="gap: var(--space-sm);">
            <div class="avg-item"><span class="avg-val">${weekAvgCal}</span><span class="avg-label">cal/day</span></div>
            <div class="avg-item"><span class="avg-val">${weekAvgProtein}g</span><span class="avg-label">protein</span></div>
            <div class="avg-item"><span class="avg-val">${weekAvgCarbs}g</span><span class="avg-label">carbs</span></div>
            <div class="avg-item"><span class="avg-val">${weekAvgFiber}g</span><span class="avg-label">fiber</span></div>
          </div>
        </div>

        <!-- Streak -->
        <div class="card streak-card">
          <div class="flex-between">
            <div>
              <div class="subheadline">STREAK</div>
              <div style="font-size:var(--text-3xl); font-weight:var(--weight-bold); margin-top:4px;">
                🔥 ${streak}
              </div>
              <div class="caption">days logged</div>
            </div>
            <div style="font-size: 48px;">💪</div>
          </div>
        </div>
      </div>
    `;
  }

  macroRow(label, current, target, unit, color) {
    const percent = Math.min(100, (current / target) * 100);
    return `
      <div class="macro-row">
        <div class="macro-row-header">
          <span class="macro-row-label">${label}</span>
          <span class="macro-row-values">${current}${unit} / ${target}${unit}</span>
        </div>
        <div class="progress-bar">
          <div class="fill" style="width:${percent}%; background:${color};"></div>
        </div>
      </div>
    `;
  }

  async calculateStreak(allNutrition) {
    // Count consecutive days with logged meals going backwards from today
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasEntries = allNutrition.some(n => n.date === dateStr);
      if (hasEntries) {
        streak++;
      } else if (i > 0) { // Don't break on today if nothing logged yet
        break;
      }
    }
    return streak;
  }

  destroy() {}
}

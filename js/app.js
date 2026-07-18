/**
 * FitOS - Personal Fitness Operating System
 * 3-Tab Architecture: Home | Meals | Workout
 */

import { DB } from './modules/db.js';
import { Router } from './modules/router.js';
import { HomePage } from './modules/home.js';
import { MealsPage } from './modules/meals.js';
import { WorkoutPage } from './modules/workout.js';

class FitOS {
  constructor() {
    this.pages = {
      home: HomePage,
      meals: MealsPage,
      workout: WorkoutPage
    };
  }

  async init() {
    await DB.init();
    this.loadTheme();
    Router.init(this.pages);
    this.setupNav();
    this.registerSW();
    Router.navigate('home');
  }

  loadTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  setupNav() {
    const nav = document.getElementById('bottom-nav');
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-item');
      if (!btn) return;
      const page = btn.dataset.page;
      if (page) {
        nav.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Router.navigate(page);
      }
    });
  }

  async registerSW() {
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('./sw.js'); } catch (e) {}
    }
  }
}

const app = new FitOS();
app.init();

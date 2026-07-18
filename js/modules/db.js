/**
 * Database Module - IndexedDB wrapper for FitOS
 */

const DB_NAME = 'FitOS';
const DB_VERSION = 1;

export const DB = {
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Workouts store
        if (!db.objectStoreNames.contains('workouts')) {
          const workouts = db.createObjectStore('workouts', { keyPath: 'id' });
          workouts.createIndex('date', 'date');
          workouts.createIndex('split', 'split');
        }

        // Exercises (template library)
        if (!db.objectStoreNames.contains('exercises')) {
          db.createObjectStore('exercises', { keyPath: 'id' });
        }

        // Nutrition logs
        if (!db.objectStoreNames.contains('nutrition')) {
          const nutrition = db.createObjectStore('nutrition', { keyPath: 'id' });
          nutrition.createIndex('date', 'date');
        }

        // Meals (saved templates)
        if (!db.objectStoreNames.contains('meals')) {
          db.createObjectStore('meals', { keyPath: 'id' });
        }

        // Body measurements
        if (!db.objectStoreNames.contains('measurements')) {
          const measurements = db.createObjectStore('measurements', { keyPath: 'id' });
          measurements.createIndex('date', 'date');
        }

        // Personal Records
        if (!db.objectStoreNames.contains('prs')) {
          const prs = db.createObjectStore('prs', { keyPath: 'id' });
          prs.createIndex('exercise', 'exercise');
        }

        // Planner entries
        if (!db.objectStoreNames.contains('planner')) {
          const planner = db.createObjectStore('planner', { keyPath: 'id' });
          planner.createIndex('date', 'date');
        }

        // Water tracking
        if (!db.objectStoreNames.contains('water')) {
          const water = db.createObjectStore('water', { keyPath: 'date' });
        }

        // Daily notes
        if (!db.objectStoreNames.contains('notes')) {
          const notes = db.createObjectStore('notes', { keyPath: 'date' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  },

  // Generic CRUD operations
  async add(store, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async get(store, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const s = tx.objectStore(store);
      const req = s.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getAll(store) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const s = tx.objectStore(store);
      const req = s.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getByIndex(store, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const s = tx.objectStore(store);
      const index = s.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async delete(store, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async clear(store) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  // Export all data as JSON
  async exportAll() {
    const stores = ['workouts', 'exercises', 'nutrition', 'meals', 'measurements', 'prs', 'planner', 'water', 'notes'];
    const data = {};
    for (const store of stores) {
      data[store] = await this.getAll(store);
    }
    data.settings = {
      theme: localStorage.getItem('fitos-theme'),
      accent: localStorage.getItem('fitos-accent'),
      units: localStorage.getItem('fitos-units'),
      profile: JSON.parse(localStorage.getItem('fitos-profile') || '{}')
    };
    return data;
  },

  // Import data from JSON
  async importAll(data) {
    const stores = ['workouts', 'exercises', 'nutrition', 'meals', 'measurements', 'prs', 'planner', 'water', 'notes'];
    for (const store of stores) {
      if (data[store]) {
        for (const item of data[store]) {
          await this.add(store, item);
        }
      }
    }
    if (data.settings) {
      if (data.settings.theme) localStorage.setItem('fitos-theme', data.settings.theme);
      if (data.settings.accent) localStorage.setItem('fitos-accent', data.settings.accent);
      if (data.settings.units) localStorage.setItem('fitos-units', data.settings.units);
      if (data.settings.profile) localStorage.setItem('fitos-profile', JSON.stringify(data.settings.profile));
    }
  }
};

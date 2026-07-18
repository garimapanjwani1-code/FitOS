/**
 * Router Module - SPA page navigation
 */

export const Router = {
  container: null,
  pages: {},
  currentPage: null,

  init(pages) {
    this.container = document.getElementById('page-container');
    this.pages = pages;
  },

  navigate(pageName) {
    if (!this.pages[pageName]) return;

    // Cleanup current page
    if (this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
    }

    // Clear container
    this.container.innerHTML = '';
    this.container.scrollTop = 0;

    // Render new page
    const PageClass = this.pages[pageName];
    this.currentPage = new PageClass(this.container);
    this.currentPage.render();

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });
  }
};

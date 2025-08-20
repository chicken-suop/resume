class NightModeToggleElement extends HTMLElement {
  constructor() {
    super();
    this.isDarkMode = false;
    this.isAnimating = false;
  }

  applyTheme() {
    const root = document.documentElement;

    if (this.isDarkMode) {
      root.style.setProperty(
        '--color-background',
        'var(--color-background-dark)',
      );
      root.style.setProperty('--color-dimmed', 'var(--color-dimmed-dark)');
      root.style.setProperty('--color-primary', 'var(--color-primary-dark)');
      root.style.setProperty(
        '--color-secondary',
        'var(--color-secondary-dark)',
      );
      root.style.setProperty('--color-accent', 'var(--color-accent-dark)');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.style.setProperty(
        '--color-background',
        'var(--color-background-light)',
      );
      root.style.setProperty('--color-dimmed', 'var(--color-dimmed-light)');
      root.style.setProperty('--color-primary', 'var(--color-primary-light)');
      root.style.setProperty(
        '--color-secondary',
        'var(--color-secondary-light)',
      );
      root.style.setProperty('--color-accent', 'var(--color-accent-light)');
      root.setAttribute('data-theme', 'light');
    }
  }

  connectedCallback() {
    this.loadThemePreference();
    this.render();
    this.setupEventListeners();
    this.applyTheme();
  }

  createSmoothTransition() {
    const root = document.documentElement;

    // Add a smooth transition for all color-related properties
    root.style.setProperty(
      '--transition-theme',
      'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    );

    // Apply the transition to key elements
    document.body.style.transition =
      'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // Apply theme changes
    this.isDarkMode = !this.isDarkMode;
    this.updateToggle();
    this.applyTheme();
    this.saveThemePreference();
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('resume-theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    this.isDarkMode =
      savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
  }

  render() {
    this.innerHTML = `
      <button 
        class="night-mode-toggle ${this.isDarkMode ? 'dark' : ''}"
        title="${this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}"
        aria-label="${this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}"
        role="switch"
        aria-checked="${this.isDarkMode}"
      >
        <div class="toggle-glow"></div>
        <div class="toggle-track">
          <div class="toggle-handle">
            <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        <div class="tooltip">${this.isDarkMode ? 'Light mode' : 'Dark mode'}</div>
      </button>
    `;
  }

  saveThemePreference() {
    localStorage.setItem('resume-theme', this.isDarkMode ? 'dark' : 'light');
  }

  setupEventListeners() {
    const button = this.querySelector('.night-mode-toggle');

    button.addEventListener('click', () => this.toggleTheme());

    button.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Listen for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (localStorage.getItem('resume-theme') === null) {
          this.isDarkMode = e.matches;
          this.updateToggle();
          this.applyTheme();
        }
      });
  }

  toggleTheme() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    // Create smooth transition
    this.createSmoothTransition();

    // Clean up after animation completes
    setTimeout(() => {
      document.body.style.transition = '';
      document.documentElement.style.removeProperty('--transition-theme');
      this.isAnimating = false;
    }, 300);
  }

  updateToggle() {
    const button = this.querySelector('.night-mode-toggle');
    const tooltip = this.querySelector('.tooltip');

    if (this.isDarkMode) {
      button.classList.add('dark');
      button.setAttribute('title', 'Switch to light mode');
      button.setAttribute('aria-label', 'Switch to light mode');
      tooltip.textContent = 'Light mode';
    } else {
      button.classList.remove('dark');
      button.setAttribute('title', 'Switch to dark mode');
      button.setAttribute('aria-label', 'Switch to dark mode');
      tooltip.textContent = 'Dark mode';
    }

    button.setAttribute('aria-checked', this.isDarkMode);
  }
}

customElements.define('night-mode-toggle', NightModeToggleElement);

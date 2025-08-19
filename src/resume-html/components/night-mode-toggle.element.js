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
      <style>
        .night-mode-toggle {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 1000;
          width: 4rem;
          height: 2rem;
          background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
          border: none;
          border-radius: 2rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .night-mode-toggle:hover {
          transform: scale(1.05);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .night-mode-toggle.dark:hover {
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .night-mode-toggle:focus {
          outline: none;
        }

        .night-mode-toggle:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .night-mode-toggle.dark {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #0f1419 100%);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .toggle-track {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.3rem;
        }

        .toggle-handle {
          position: absolute;
          width: 1.6rem;
          height: 1.6rem;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 50%;
          left: 0.2rem;
          top: 0.2rem;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .night-mode-toggle.dark .toggle-handle {
          transform: translateX(2rem);
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 0 8px rgba(203, 213, 224, 0.3);
        }

        .sun-icon, .moon-icon {
          position: absolute;
          width: 1rem;
          height: 1rem;
          transition: all 0.4s ease;
        }

        .sun-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .moon-icon {
          opacity: 0;
          transform: rotate(180deg) scale(0.5);
        }

        .night-mode-toggle.dark .sun-icon {
          opacity: 0;
          transform: rotate(-180deg) scale(0.5);
        }

        .night-mode-toggle.dark .moon-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .night-mode-toggle.dark .stars {
          opacity: 1;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite ease-in-out;
        }

        .star:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
        .star:nth-child(2) { top: 60%; left: 25%; animation-delay: 0.5s; }
        .star:nth-child(3) { top: 30%; left: 70%; animation-delay: 1s; }
        .star:nth-child(4) { top: 70%; left: 80%; animation-delay: 1.5s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .toggle-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 2rem;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .night-mode-toggle:hover .toggle-glow {
          opacity: 1;
        }

        .tooltip {
          position: absolute;
          bottom: -2.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .night-mode-toggle:hover .tooltip {
          opacity: 1;
        }

        @media (max-width: 48em) {
          .night-mode-toggle {
            top: 1rem;
            right: 1rem;
            width: 3.5rem;
            height: 1.75rem;
          }

          .toggle-handle {
            width: 1.4rem;
            height: 1.4rem;
          }

          .night-mode-toggle.dark .toggle-handle {
            transform: translateX(1.75rem);
          }

          .sun-icon, .moon-icon {
            width: 0.9rem;
            height: 0.9rem;
          }
        }
      </style>

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

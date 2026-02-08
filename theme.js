/**
 * Theme management module for the text encryption application.
 * Handles dark/light theme switching and persistence.
 */

/**
 * Gets the current theme preference.
 * Checks localStorage first, then system preference.
 *
 * @returns {string} 'light' or 'dark'.
 */
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies the specified theme to the document.
 *
 * @param {string} theme - 'light' or 'dark'.
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcon(theme);
}

/**
 * Updates the theme toggle button icon.
 *
 * @param {string} theme - Current theme ('light' or 'dark').
 */
function updateThemeToggleIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Initializes the theme system.
 * Applies saved or system-preferred theme and sets up listeners.
 */
function initializeTheme() {
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}
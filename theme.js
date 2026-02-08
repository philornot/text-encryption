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
    const icon = document.getElementById('themeIcon');
    if (icon) {
        if (theme === 'dark') {
            // sun icon for dark mode (clicking it will switch to light)
            icon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>';
        } else {
            // moon icon for light mode (clicking it will switch to dark)
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
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

    // listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}
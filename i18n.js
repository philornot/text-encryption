/**
 * Internationalization (i18n) module for the text encryption application.
 * Manages translations and language switching.
 */

const translations = {
    en: {
        // Page title and headings
        pageTitle: 'text encryption',
        encryptHeading: 'encrypt',
        decryptHeading: 'decrypt',

        // Placeholders
        plaintextPlaceholder: 'enter text to encrypt...',
        encryptedPlaceholder: 'encrypted text will appear here...',
        encryptedInputPlaceholder: 'paste encrypted text...',
        decryptedPlaceholder: 'decrypted text will appear here...',
        keyPlaceholder: 'enter secret key...',

        // Labels
        autoGenerateKeyLabel: 'auto-generate secret key',
        keyDisplayPrefix: 'key (click to copy): ',

        // Buttons
        encryptButton: 'encrypt',
        reEncryptButton: 're-encrypt',
        decryptButton: 'decrypt',
        reDecryptButton: 're-decrypt',
        copyEncryptedButton: 'copy encrypted text',
        copyDecryptedButton: 'copy decrypted text',

        // Status messages
        encryptedStatus: 'encrypted',
        reEncryptedStatus: 're-encrypted',
        decryptedStatus: 'decrypted',
        reDecryptedStatus: 're-decrypted',
        againSuffix: ' again',
        keyCopiedStatus: 'key copied',
        encryptedCopiedStatus: 'encrypted text copied',
        decryptedCopiedStatus: 'decrypted text copied',

        // Warnings
        noTextWarning: 'please enter text to encrypt',
        noKeyWarning: 'please enter a secret key',
        noEncryptedTextWarning: 'please paste encrypted text',
        noDecryptKeyWarning: 'please enter the secret key',
        nothingToCopyEncryptWarning: 'nothing to copy. encrypt text first',
        nothingToCopyDecryptWarning: 'nothing to copy. decrypt text first',
        noKeyToCopyWarning: 'no key to copy',

        // Errors
        encryptionFailedError: 'encryption failed: ',
        decryptionFailedError: 'decryption failed: ',
        decryptionCheckError: 'decryption failed. check your key or text',

        // Accessibility
        themeToggleAria: 'Toggle dark/light theme',
        githubLinkAria: 'View source code on GitHub'
    }
};

let currentLanguage = 'en';

/**
 * Gets a translated string for the current language.
 *
 * @param {string} key - The translation key.
 * @returns {string} The translated string.
 */
function t(key) {
    return translations[currentLanguage][key] || key;
}

/**
 * Updates all translatable elements on the page.
 */
function updatePageTranslations() {
    // Update page title
    document.title = t('pageTitle');

    // Update headings
    document.querySelector('h1').textContent = t('pageTitle');
    document.querySelectorAll('h2')[0].textContent = t('encryptHeading');
    document.querySelectorAll('h2')[1].textContent = t('decryptHeading');

    // Update placeholders
    document.getElementById('plaintext').placeholder = t('plaintextPlaceholder');
    document.getElementById('ciphertext').placeholder = t('encryptedPlaceholder');
    document.getElementById('encryptedInput').placeholder = t('encryptedInputPlaceholder');
    document.getElementById('decryptedText').placeholder = t('decryptedPlaceholder');
    document.getElementById('encryptKey').placeholder = t('keyPlaceholder');
    document.getElementById('decryptKey').placeholder = t('keyPlaceholder');

    // Update labels
    document.querySelector('label[for="autoGenerateKey"]').childNodes[1].textContent = t('autoGenerateKeyLabel');

    // Update buttons (only if they're in their default state)
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');

    if (!buttonStates.encrypt.timeout) {
        encryptBtn.textContent = buttonStates.encrypt.hasEncrypted ? t('reEncryptButton') : t('encryptButton');
    }

    if (!buttonStates.decrypt.timeout) {
        decryptBtn.textContent = buttonStates.decrypt.hasDecrypted ? t('reDecryptButton') : t('decryptButton');
    }

    document.getElementById('copyEncryptedBtn').textContent = t('copyEncryptedButton');
    document.getElementById('copyDecryptedBtn').textContent = t('copyDecryptedButton');

    // Update button states original text
    buttonStates.copyEncrypted.originalText = t('copyEncryptedButton');
    buttonStates.copyDecrypted.originalText = t('copyDecryptedButton');
    buttonStates.encrypt.originalText = t('encryptButton');
    buttonStates.decrypt.originalText = t('decryptButton');

    // Update ARIA labels
    document.getElementById('themeToggle').setAttribute('aria-label', t('themeToggleAria'));
    document.getElementById('githubLink').setAttribute('aria-label', t('githubLinkAria'));
}

/**
 * Sets the current language and updates the page.
 *
 * @param {string} lang - The language code (e.g., 'en', 'pl').
 */
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        updatePageTranslations();
        localStorage.setItem('preferredLanguage', lang);
    }
}

/**
 * Initializes the i18n system.
 * Loads the user's preferred language from localStorage or browser settings.
 */
function initializeI18n() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];

    if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
    } else if (translations[browserLanguage]) {
        setLanguage(browserLanguage);
    } else {
        setLanguage('en');
    }
}
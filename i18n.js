/**
 * internationalization (i18n) module for the text encryption application.
 * manages translations and language switching.
 */

const translations = {
    en: {
        // page title and headings
        pageTitle: 'text encryption',
        encryptHeading: 'encrypt',
        decryptHeading: 'decrypt',

        // placeholders
        plaintextPlaceholder: 'enter text to encrypt...',
        encryptedPlaceholder: 'encrypted text will appear here...',
        encryptedInputPlaceholder: 'paste encrypted text...',
        decryptedPlaceholder: 'decrypted text will appear here...',
        keyPlaceholder: 'enter secret key...',

        // labels
        autoGenerateKeyLabel: 'auto-generate secret key',
        keyDisplayPrefix: 'key (click to copy): ',

        // buttons
        encryptButton: 'encrypt',
        reEncryptButton: 're-encrypt',
        decryptButton: 'decrypt',
        reDecryptButton: 're-decrypt',
        copyEncryptedButton: 'copy encrypted text',
        copyDecryptedButton: 'copy decrypted text',

        // status messages
        encryptedStatus: 'encrypted',
        reEncryptedStatus: 're-encrypted',
        decryptedStatus: 'decrypted',
        reDecryptedStatus: 're-decrypted',
        againSuffix: ' again',
        keyCopiedStatus: 'key copied',
        encryptedCopiedStatus: 'encrypted text copied',
        decryptedCopiedStatus: 'decrypted text copied',

        // warnings
        noTextWarning: 'please enter text to encrypt',
        noKeyWarning: 'please enter a secret key',
        noEncryptedTextWarning: 'please paste encrypted text',
        noDecryptKeyWarning: 'please enter the secret key',
        nothingToCopyEncryptWarning: 'nothing to copy. encrypt text first',
        nothingToCopyDecryptWarning: 'nothing to copy. decrypt text first',
        noKeyToCopyWarning: 'no key to copy',

        // errors
        encryptionFailedError: 'encryption failed: ',
        decryptionFailedError: 'decryption failed: ',
        decryptionCheckError: 'decryption failed. check your key or text',

        // accessibility
        themeToggleAria: 'toggle dark/light theme',
        githubLinkAria: 'view source code on github',
        languageToggleAria: 'switch language'
    },
    pl: {
        // page title and headings
        pageTitle: 'szyfrowanie tekstu',
        encryptHeading: 'szyfruj',
        decryptHeading: 'deszyfruj',

        // placeholders
        plaintextPlaceholder: 'wpisz tekst do zaszyfrowania...',
        encryptedPlaceholder: 'zaszyfrowany tekst pojawi się tutaj...',
        encryptedInputPlaceholder: 'wklej zaszyfrowany tekst...',
        decryptedPlaceholder: 'odszyfrowany tekst pojawi się tutaj...',
        keyPlaceholder: 'wpisz tajny klucz...',

        // labels
        autoGenerateKeyLabel: 'automatycznie wygeneruj tajny klucz',
        keyDisplayPrefix: 'klucz (kliknij aby skopiować): ',

        // buttons
        encryptButton: 'szyfruj',
        reEncryptButton: 'szyfruj ponownie',
        decryptButton: 'deszyfruj',
        reDecryptButton: 'deszyfruj ponownie',
        copyEncryptedButton: 'kopiuj zaszyfrowany tekst',
        copyDecryptedButton: 'kopiuj odszyfrowany tekst',

        // status messages
        encryptedStatus: 'zaszyfrowano',
        reEncryptedStatus: 'ponownie zaszyfrowano',
        decryptedStatus: 'odszyfrowano',
        reDecryptedStatus: 'ponownie odszyfrowano',
        againSuffix: ' jeszcze raz',
        keyCopiedStatus: 'klucz skopiowany',
        encryptedCopiedStatus: 'zaszyfrowany tekst skopiowany',
        decryptedCopiedStatus: 'odszyfrowany tekst skopiowany',

        // warnings
        noTextWarning: 'wpisz tekst do zaszyfrowania',
        noKeyWarning: 'wpisz tajny klucz',
        noEncryptedTextWarning: 'wklej zaszyfrowany tekst',
        noDecryptKeyWarning: 'wpisz tajny klucz',
        nothingToCopyEncryptWarning: 'nie ma czego kopiować. zaszyfruj tekst najpierw',
        nothingToCopyDecryptWarning: 'nie ma czego kopiować. odszyfruj tekst najpierw',
        noKeyToCopyWarning: 'brak klucza do skopiowania',

        // errors
        encryptionFailedError: 'szyfrowanie nie powiodło się: ',
        decryptionFailedError: 'deszyfrowanie nie powiodło się: ',
        decryptionCheckError: 'deszyfrowanie nie powiodło się. sprawdź klucz lub tekst',

        // accessibility
        themeToggleAria: 'przełącz tryb ciemny/jasny',
        githubLinkAria: 'zobacz kod źródłowy na githubie',
        languageToggleAria: 'zmień język'
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
    // update page title
    document.title = t('pageTitle');

    // update headings
    document.querySelector('h1').textContent = t('pageTitle');
    document.querySelectorAll('h2')[0].textContent = t('encryptHeading');
    document.querySelectorAll('h2')[1].textContent = t('decryptHeading');

    // update placeholders
    document.getElementById('plaintext').placeholder = t('plaintextPlaceholder');
    document.getElementById('ciphertext').placeholder = t('encryptedPlaceholder');
    document.getElementById('encryptedInput').placeholder = t('encryptedInputPlaceholder');
    document.getElementById('decryptedText').placeholder = t('decryptedPlaceholder');
    document.getElementById('encryptKey').placeholder = t('keyPlaceholder');
    document.getElementById('decryptKey').placeholder = t('keyPlaceholder');

    // update labels
    document.querySelector('label[for="autoGenerateKey"]').childNodes[1].textContent = t('autoGenerateKeyLabel');

    // update buttons (only if they're in their default state)
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

    // update button states original text
    buttonStates.copyEncrypted.originalText = t('copyEncryptedButton');
    buttonStates.copyDecrypted.originalText = t('copyDecryptedButton');
    buttonStates.encrypt.originalText = t('encryptButton');
    buttonStates.decrypt.originalText = t('decryptButton');

    // update ARIA labels
    document.getElementById('themeToggle').setAttribute('aria-label', t('themeToggleAria'));
    const githubLinks = document.querySelectorAll('a[href*="github"]');
    if (githubLinks.length > 0) {
        githubLinks[0].setAttribute('aria-label', t('githubLinkAria'));
    }
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
        langToggle.setAttribute('aria-label', t('languageToggleAria'));
    }
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
        updateLanguageIcon();
        localStorage.setItem('preferredLanguage', lang);
    }
}

/**
 * Initializes the i18n system.
 * loads the user's preferred language from localStorage or browser settings.
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

/**
 * Toggles between available languages.
 */
function toggleLanguage() {
    const languages = Object.keys(translations);
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);

    // update language button icon
    updateLanguageIcon();
}

/**
 * Updates the language toggle button to show current language.
 */
function updateLanguageIcon() {
    const langButton = document.getElementById('languageToggle');
    if (langButton) {
        langButton.textContent = currentLanguage.toUpperCase();
    }
}
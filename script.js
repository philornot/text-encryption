/**
 * generates a cryptographically secure random key.
 * uses 32 random bytes converted to base64 for strong security.
 *
 * @returns {string} A secure random key string.
 */
function generateSecureKey() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
}


/**
 * masks a key string, showing only first 8 and last 4 characters.
 *
 * @param {string} key - The key to mask.
 * @returns {string} Masked key string.
 */
function maskKey(key) {
    if (key.length <= 12) return key;
    const start = key.substring(0, 8);
    const end = key.substring(key.length - 4);
    const middle = '*'.repeat(Math.min(20, key.length - 12));
    return start + middle + end;
}


const buttonStates = {
    copyEncrypted: { timeout: null, againCount: 0, originalText: '' },
    copyDecrypted: { timeout: null, againCount: 0, originalText: '' },
    copyKey: { timeout: null, againCount: 0, originalText: '' },
    encrypt: { timeout: null, againCount: 0, originalText: '', hasEncrypted: false },
    decrypt: { timeout: null, againCount: 0, originalText: '', hasDecrypted: false }
};


/**
 * shows a status message in a button temporarily.
 *
 * @param {string} buttonId - ID of the button element.
 * @param {string} message - Message to display.
 * @param {string} type - Type of message: 'success', 'warning', or 'error'.
 * @param {number} duration - Duration in milliseconds (default 2000).
 */
function showButtonStatus(buttonId, message, type, duration = 2000) {
    const button = document.getElementById(buttonId);
    const state = buttonStates[buttonId.replace('Btn', '')];

    if (!state) {
        const originalText = button.textContent;
        button.textContent = message;
        button.className = 'status-' + type;

        setTimeout(() => {
            button.textContent = originalText;
            button.className = '';
        }, duration);
        return;
    }

    if (state.timeout) {
        clearTimeout(state.timeout);
    }

    button.textContent = message;
    button.className = 'status-' + type;

    state.timeout = setTimeout(() => {
        button.textContent = state.originalText;
        button.className = '';
        state.timeout = null;
        state.againCount = 0;
    }, duration);
}


/**
 * updates button states' original text from translations.
 * called after language changes.
 */
function updateButtonStatesText() {
    buttonStates.copyEncrypted.originalText = t('copyEncryptedButton');
    buttonStates.copyDecrypted.originalText = t('copyDecryptedButton');
    buttonStates.encrypt.originalText = buttonStates.encrypt.hasEncrypted ? t('reEncryptButton') : t('encryptButton');
    buttonStates.decrypt.originalText = buttonStates.decrypt.hasDecrypted ? t('reDecryptButton') : t('decryptButton');
}


let currentKey = '';


/**
 * toggles between auto-generated key and manual key input.
 */
function toggleKeyInput() {
    const autoGenerate = document.getElementById('autoGenerateKey').checked;
    const keyInput = document.getElementById('encryptKey');
    const generatedKeyDisplay = document.getElementById('generatedKeyDisplay');

    if (autoGenerate) {
        keyInput.style.display = 'none';
        keyInput.value = '';
        generatedKeyDisplay.style.display = 'none';
        currentKey = '';
    } else {
        keyInput.style.display = 'block';
        generatedKeyDisplay.style.display = 'none';
        currentKey = '';
    }
}


/**
 * encrypts the plaintext using the provided key.
 * uses AES-256 encryption with a random salt for each encryption.
 */
function encrypt() {
    const plaintext = document.getElementById('plaintext').value;
    const autoGenerate = document.getElementById('autoGenerateKey').checked;
    const state = buttonStates.encrypt;
    let key;

    if (!plaintext) {
        showButtonStatus('encryptBtn', t('noTextWarning'), 'warning');
        return;
    }

    if (autoGenerate) {
        key = generateSecureKey();
        currentKey = key;
        const maskedKey = maskKey(key);
        document.getElementById('generatedKeyDisplay').textContent = t('keyDisplayPrefix') + maskedKey;
        document.getElementById('generatedKeyDisplay').style.display = 'block';
    } else {
        key = document.getElementById('encryptKey').value;
        if (!key) {
            showButtonStatus('encryptBtn', t('noKeyWarning'), 'warning');
            return;
        }
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
        document.getElementById('ciphertext').value = encrypted;

        const button = document.getElementById('encryptBtn');

        if (state.timeout) {
            clearTimeout(state.timeout);
            state.againCount++;
        } else {
            state.againCount = 0;
        }

        const prefix = state.hasEncrypted ? t('reEncryptedStatus') : t('encryptedStatus');
        const againText = t('againSuffix').repeat(state.againCount);
        button.textContent = prefix + againText;
        button.className = 'status-success';

        state.timeout = setTimeout(() => {
            button.textContent = t('reEncryptButton');
            button.className = '';
            state.timeout = null;
            state.againCount = 0;
            state.hasEncrypted = true;
            state.originalText = t('reEncryptButton');
        }, 2000);

    } catch (error) {
        showButtonStatus('encryptBtn', t('encryptionFailedError') + error.message, 'error');
    }
}


/**
 * copies the generated key to clipboard.
 */
function copyGeneratedKey() {
    if (!currentKey) {
        const keyDisplay = document.getElementById('generatedKeyDisplay');
        const originalText = keyDisplay.textContent;
        keyDisplay.textContent = t('noKeyToCopyWarning');
        keyDisplay.style.color = 'var(--color-warning)';

        setTimeout(() => {
            keyDisplay.textContent = originalText;
            keyDisplay.style.color = '';
        }, 2000);
        return;
    }

    const tempInput = document.createElement('input');
    tempInput.value = currentKey;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    const keyDisplay = document.getElementById('generatedKeyDisplay');
    const state = buttonStates.copyKey;

    if (state.timeout) {
        clearTimeout(state.timeout);
        state.againCount++;
    } else {
        state.againCount = 0;
        state.originalText = keyDisplay.textContent;
    }

    const againText = t('againSuffix').repeat(state.againCount);
    keyDisplay.textContent = t('keyCopiedStatus') + againText;
    keyDisplay.style.color = 'var(--color-success)';

    state.timeout = setTimeout(() => {
        keyDisplay.textContent = state.originalText;
        keyDisplay.style.color = '';
        state.timeout = null;
        state.againCount = 0;
    }, 2000);
}


/**
 * decrypts the encrypted text using the provided key.
 */
function decrypt() {
    const encryptedText = document.getElementById('encryptedInput').value;
    const key = document.getElementById('decryptKey').value;
    const state = buttonStates.decrypt;

    if (!encryptedText) {
        showButtonStatus('decryptBtn', t('noEncryptedTextWarning'), 'warning');
        return;
    }

    if (!key) {
        showButtonStatus('decryptBtn', t('noDecryptKeyWarning'), 'warning');
        return;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

        if (!plaintext) {
            showButtonStatus('decryptBtn', t('decryptionCheckError'), 'error', 3000);
            return;
        }

        document.getElementById('decryptedText').value = plaintext;

        const button = document.getElementById('decryptBtn');

        if (state.timeout) {
            clearTimeout(state.timeout);
            state.againCount++;
        } else {
            state.againCount = 0;
        }

        const prefix = state.hasDecrypted ? t('reDecryptedStatus') : t('decryptedStatus');
        const againText = t('againSuffix').repeat(state.againCount);
        button.textContent = prefix + againText;
        button.className = 'status-success';

        state.timeout = setTimeout(() => {
            button.textContent = t('reDecryptButton');
            button.className = '';
            state.timeout = null;
            state.againCount = 0;
            state.hasDecrypted = true;
            state.originalText = t('reDecryptButton');
        }, 2000);

    } catch (error) {
        showButtonStatus('decryptBtn', t('decryptionFailedError') + error.message, 'error', 3000);
    }
}


/**
 * copies the encrypted text to clipboard.
 */
function copyEncrypted() {
    const ciphertext = document.getElementById('ciphertext');

    if (!ciphertext.value) {
        showButtonStatus('copyEncryptedBtn', t('nothingToCopyEncryptWarning'), 'warning', 2500);
        return;
    }

    ciphertext.select();
    document.execCommand('copy');

    const state = buttonStates.copyEncrypted;

    if (state.timeout) {
        clearTimeout(state.timeout);
        state.againCount++;
    } else {
        state.againCount = 0;
    }

    const againText = t('againSuffix').repeat(state.againCount);
    showButtonStatus('copyEncryptedBtn', t('encryptedCopiedStatus') + againText, 'success');
}


/**
 * copies the decrypted text to clipboard.
 */
function copyDecrypted() {
    const decryptedText = document.getElementById('decryptedText');

    if (!decryptedText.value) {
        showButtonStatus('copyDecryptedBtn', t('nothingToCopyDecryptWarning'), 'warning', 2500);
        return;
    }

    decryptedText.select();
    document.execCommand('copy');

    const state = buttonStates.copyDecrypted;

    if (state.timeout) {
        clearTimeout(state.timeout);
        state.againCount++;
    } else {
        state.againCount = 0;
    }

    const againText = t('againSuffix').repeat(state.againCount);
    showButtonStatus('copyDecryptedBtn', t('decryptedCopiedStatus') + againText, 'success');
}


/**
 * handles Enter key press in encrypt key input.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleEncryptKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        encrypt();
    }
}


/**
 * handles Enter key press in decrypt key input.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleDecryptKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        decrypt();
    }
}


/**
 * initializes the application.
 * sets up theme, i18n, and button states.
 */
function initializeApp() {
    initializeTheme();
    initializeI18n();
    updateButtonStatesText();
}

// initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
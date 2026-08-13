const windowObject = typeof window !== 'undefined' ? window : null;
const API_KEY_STORAGE_KEY = 'weatherly_openweather_api_key';
const API_KEY_PLACEHOLDERS = [
    '',
    'your_api_key_here',
    'your_actual_api_key',
    'replace_with_your_openweather_api_key',
    'your_real_api_key_here',
    'your_primary_api_key_here',
    'your_backup_api_key_here'
];

const localConfig = (windowObject && windowObject.__WEATHERLY_CONFIG__)
    ? windowObject.__WEATHERLY_CONFIG__
    : {};

function normalizeApiKey(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function isUsableApiKey(value) {
    const normalized = normalizeApiKey(value);
    if (!normalized) return false;
    return !API_KEY_PLACEHOLDERS.includes(normalized.toLowerCase());
}

function pickApiKeyFromSource(source) {
    if (!source || typeof source !== 'object') return '';

    const directKey = normalizeApiKey(source.OPENWEATHER_API_KEY);
    if (isUsableApiKey(directKey)) return directKey;

    if (Array.isArray(source.OPENWEATHER_API_KEYS)) {
        const firstValid = source.OPENWEATHER_API_KEYS
            .map(normalizeApiKey)
            .find(isUsableApiKey);
        if (firstValid) return firstValid;
    }
    return '';
}

function readApiKeyFromQuery(win) {
    if (!win || !win.location) return '';
    const params = new URLSearchParams(win.location.search);
    return normalizeApiKey(params.get('apiKey') || params.get('apikey') || params.get('appid'));
}

function readApiKeyFromStorage(win) {
    if (!win || !win.localStorage) return '';
    try {
        return normalizeApiKey(win.localStorage.getItem(API_KEY_STORAGE_KEY));
    } catch (error) {
        console.warn('Unable to read API key from localStorage:', error);
        return '';
    }
}

function persistApiKey(win, apiKey) {
    if (!win || !win.localStorage || !isUsableApiKey(apiKey)) return;
    try {
        win.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } catch (error) {
        console.warn('Unable to persist API key to localStorage:', error);
    }
}

function resolveConfiguredApiKey(source, win) {
    const fromConfig = pickApiKeyFromSource(source);
    if (fromConfig) return fromConfig;

    const fromQuery = readApiKeyFromQuery(win);
    if (isUsableApiKey(fromQuery)) {
        persistApiKey(win, fromQuery);
        return fromQuery;
    }

    const fromStorage = readApiKeyFromStorage(win);
    if (isUsableApiKey(fromStorage)) return fromStorage;

    return 'your_api_key_here';
}

const config = {
    OPENWEATHER_API_KEY: resolveConfiguredApiKey(localConfig, windowObject),
    API_KEY_STORAGE_KEY,
    hasValidApiKey: isUsableApiKey
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

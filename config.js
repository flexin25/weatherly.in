const localConfig = (typeof window !== 'undefined' && window.__WEATHERLY_CONFIG__)
    ? window.__WEATHERLY_CONFIG__
    : {};

function resolveConfiguredApiKey(source) {
    if (typeof source.OPENWEATHER_API_KEY === 'string' && source.OPENWEATHER_API_KEY.trim() !== '') {
        return source.OPENWEATHER_API_KEY.trim();
    }
    if (Array.isArray(source.OPENWEATHER_API_KEYS)) {
        const firstKey = source.OPENWEATHER_API_KEYS.find(key => typeof key === 'string' && key.trim() !== '');
        if (firstKey) return firstKey.trim();
    }
    return "your_api_key_here";
}

const config = {
    OPENWEATHER_API_KEY: resolveConfiguredApiKey(localConfig)
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

const config = {
    OPENWEATHER_API_KEY:
        (typeof globalThis !== 'undefined' && globalThis.OPENWEATHER_API_KEY) ||
        (typeof process !== 'undefined' && process.env && process.env.OPENWEATHER_API_KEY) ||
        ''
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

// Detect if running locally (VS Code Live Server) or on Vercel
const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const config = {
    isLocal,

    // Build the correct API URL depending on environment
    // Locally: direct OpenWeatherMap call (key from config.local.js)
    // On Vercel: serverless proxy call (key stays server-side)
    buildUrl(endpoint, params = {}) {
        if (isLocal) {
            const apiKey = (typeof globalThis !== 'undefined' && globalThis.OPENWEATHER_API_KEY) || '';
            const qs = new URLSearchParams({ ...params, appid: apiKey, units: 'metric' }).toString();
            return `https://api.openweathermap.org/data/2.5/${endpoint}?${qs}`;
        } else {
            const qs = new URLSearchParams({ endpoint, ...params, units: 'metric' }).toString();
            return `/api/weather?${qs}`;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

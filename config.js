// API key is never exposed here — all requests go through /api/weather proxy
const config = {
    // Base URL for all weather API calls (Vercel serverless proxy)
    API_BASE: '/api/weather'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

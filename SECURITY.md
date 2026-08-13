## For Developers Cloning This Repo:

1. Copy `config.local.example.js` to `config.local.js`:
   ```bash
   copy config.local.example.js config.local.js
   ```

2. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

3. Edit `config.local.js` and replace `your_real_api_key_here` with your actual key:
   ```js
   window.__WEATHERLY_CONFIG__ = {
       OPENWEATHER_API_KEY: "your_real_api_key"
   };
   ```

4. `config.local.js` is gitignored, so your real key stays out of commits.
5. The app will work immediately!

## 📍 Zip Code Format:

When searching by zip/postal code in Weatherly, use this format:

**Format:** `{zip code},{country code}`

**Examples:**
- India: `700001,IN` (Kolkata)
- USA: `10001,US` (New York)
- UK: `SW1,GB` (London)
- Canada: `M5H,CA` (Toronto)
- Australia: `2000,AU` (Sydney)

**Country Code:** Use ISO 3166-1 alpha-2 (2-letter codes)
- See full list: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

---

**Current Status:** Frontend app reads key from `config.local.js` (local) via `config.js` fallback.  
**Next Step:** For production, move API calls behind a backend so the key is never exposed to clients.

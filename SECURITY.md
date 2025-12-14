# 🔐 API Key Security Setup

## Files Created:

✅ **`.env`** - Contains your actual API key (already in .gitignore, won't be pushed to GitHub)  
✅ **`.env.example`** - Template file showing required environment variables (safe to commit)  
✅ **`config.js`** - Configuration loader for the API key  
✅ Updated **`.gitignore`** - Already protecting .env files

## What Changed:

- **Removed hardcoded API key** from `script.js` and `airquality.js`
- **Created config.js** to centralize API key management
- **Updated HTML files** to load config.js before other scripts
- **Your API key is now in .env** which is gitignored

## ⚠️ Important Security Notes:

### Client-Side Limitation:
Even with this setup, **client-side JavaScript cannot fully protect API keys** because:
- Any visitor can view the config.js file in their browser
- API keys in frontend code are always visible in network requests

### Recommended Solutions:

1. **🏆 Best Practice: Use a Backend Server**
   - Create a simple Node.js/Python backend
   - Backend makes API calls with the key
   - Frontend calls your backend (not OpenWeatherMap directly)
   - API key stays completely hidden

2. **🛡️ Alternative: OpenWeatherMap Security**
   - Use OpenWeatherMap's free tier (limited calls)
   - Set up API key restrictions in your OpenWeatherMap dashboard:
     - Limit by domain (only your website can use it)
     - Set call limits
     - Monitor usage

3. **📊 For GitHub Repository:**
   - The .env file won't be committed (protected by .gitignore)
   - Others cloning your repo will use .env.example as a template
   - They'll need to get their own API key

## For Developers Cloning This Repo:

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

3. Edit `.env` and replace `your_api_key_here` with your actual key

4. The app will work immediately!

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

**Current Status:** ✅ API key moved from public code, protected in .env file  
**Next Step:** Consider implementing a backend server for production use

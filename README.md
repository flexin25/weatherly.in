# ⛅ Weatherly

**Your Sleek Weather & Air Quality Companion**

Weatherly is a modern, minimalist weather web app that gives you real‑time weather data and air quality information for any city in the world — built entirely with vanilla HTML, CSS, and JavaScript.

🔗 **Live Demo:** [weatherly25.vercel.app](https://weatherly25.vercel.app)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=flat)

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages Overview](#-pages-overview)
- [Getting Started](#-getting-started)
- [Zip / Postal Code Search Format](#-zip--postal-code-search-format)
- [Configuration](#-configuration)
- [Security Notes](#-security-notes)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌦️ About

Weatherly is a sleek, user-friendly weather application that provides real-time weather information for any city around the globe. Built with a focus on clean design and an intuitive user experience, it delivers essential weather and air-quality data in a beautiful, easy-to-read format — no heavy frameworks required.

## ✨ Features

- 🌡️ **Real-Time Temperature** — accurate current readings with a toggle between Celsius and Fahrenheit
- ☁️ **Weather Conditions** — current weather status with intuitive icons
- 💧 **Humidity Levels** — atmospheric moisture percentage
- 📈 **Atmospheric Pressure** — barometric pressure in hectopascals (hPa)
- 💨 **Wind Speed** — current wind conditions in m/s
- 🌡️ **Feels Like / Min-Max Temp** — perceived temperature and the day's temperature range
- 👁️ **Visibility** — visibility distance in km
- 📅 **5-Day Forecast** — plan ahead with extended weather predictions
- 🍃 **Air Quality Index (AQI)** — real-time AQI rating (e.g. Good, Moderate, Poor) for any searched city
- 🧪 **Pollutant Tracking** — detailed levels for PM2.5, PM10, CO, NO₂, O₃, and SO₂
- 🌅 **Sunrise / Sunset** — daily sun timings on the Air Quality page
- 🔍 **Flexible Search** — search by city name or zip/postal code
- 📱 **Responsive Design** — works seamlessly across desktop, tablet, and mobile
- 🎨 **Playful, Modern UI** — bold, friendly interface with animated cloud graphics
- 📩 **Contact Form** — a built-in "get in touch" form on the About page

## 🛠️ Tech Stack

Weatherly is intentionally built **without any frontend framework**, to show that a polished, functional app doesn't always need one.

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom, no CSS framework) |
| Logic | Vanilla JavaScript (ES6+) |
| Data Fetching | Fetch API |
| Weather & AQI Data | [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather, 5-Day Forecast & Air Pollution endpoints) |
| Icons | Google [Material Symbols Outlined](https://fonts.google.com/icons) |
| Social Icons | [Devicon](https://devicon.dev/) (GitHub icon) & inline SVG (Instagram, X/Twitter) |
| Hosting / Deployment | [Vercel](https://vercel.com) |

## 📂 Project Structure

```
weatherly.in/
├── assets/                     # Weather icons and status illustrations
│   ├── weather/                # SVG icons per weather condition
│   └── message/                # "search city" / "not found" illustrations
├── index.html                  # Landing / home page
├── weather.html                # Main weather dashboard
├── airquality.html             # Air Quality Index & pollutants dashboard
├── about.html                  # About page + contact form
├── profile.html                # Developer profile page
├── script.js                   # Core weather logic (fetch, render, search)
├── airquality.js               # Air quality logic (fetch, render)
├── contact-form.js             # Handles the contact form on About page
├── config.js                   # Public config fallback (no secrets)
├── config.local.js             # Local-only config holding your API key (gitignored)
├── style.css                   # Styles for the weather / air quality app screens
├── home-style.css              # Styles for the home / about / profile screens
├── magnoos.jpg                 # Profile image asset
├── .gitignore
└── SECURITY.md                 # API key setup & security notes
```

## 🖥️ Pages Overview

| Page | Description |
|---|---|
| `index.html` | Animated landing page introducing Weatherly's feature set with a call-to-action to enter the app |
| `weather.html` | The main dashboard — search a city/zip code and view temperature, conditions, humidity, pressure, wind, feels-like, visibility, min/max, and a 5-day forecast |
| `airquality.html` | Displays AQI rating, sunrise/sunset, visibility, and detailed pollutant breakdown (PM2.5, PM10, CO, NO₂, O₃, SO₂) for the last searched location |
| `about.html` | Explains what Weatherly is, lists key features and the tech stack, and includes a contact form |
| `profile.html` | A short profile page about the developer |

## 🚀 Getting Started

Weatherly is a static site with no build step or dependencies to install — you just need a free API key.

### 1. Clone the repository

```bash
git clone https://github.com/flexin25/weatherly.in.git
cd weatherly.in
```

### 2. Set up your API key

Copy the example config file to create your local config:

```bash
copy config.local.example.js config.local.js   # Windows
# or
cp config.local.example.js config.local.js     # macOS / Linux
```

### 3. Get a free API key

Sign up and grab a free API key from [OpenWeatherMap](https://openweathermap.org/api).

### 4. Add your key

Open `config.local.js` and replace the placeholder with your real key:

```js
window.__WEATHERLY_CONFIG__ = {
    OPENWEATHER_API_KEY: "your_real_api_key"
};
```

`config.local.js` is listed in `.gitignore`, so your real key never gets committed.

### 5. Run it

Since it's a static site, just open `index.html` in your browser, or serve the folder with any local static server, e.g.:

```bash
npx serve .
```

The app should work immediately once your key is in place.

## 📍 Zip / Postal Code Search Format

When searching by zip/postal code on the Weather page, use the format:

**`{zip code},{country code}`**

| Country | Example |
|---|---|
| India | `700001,IN` (Kolkata) |
| USA | `10001,US` (New York) |
| UK | `SW1,GB` (London) |
| Canada | `M5H,CA` (Toronto) |
| Australia | `2000,AU` (Sydney) |

Country codes follow the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) standard (2-letter codes).

## ⚙️ Configuration

Weatherly loads its API key in two layers, in this order:

1. **`config.local.js`** (gitignored) — your personal key for local development. This is what `weather.html` and `airquality.html` load first.
2. **`config.js`** — a public fallback used when no local override is present.

This keeps real API keys out of version control while still letting the app "just work" out of the box for anyone who follows the setup steps above.

## 🔐 Security Notes

- The app currently reads the OpenWeatherMap API key on the **client side** via `config.local.js` / `config.js`.
- `config.local.js` is excluded from git via `.gitignore`, so personal keys are never committed.
- **Current limitation:** because this is a purely static frontend, the API key is still visible in the browser at runtime.
- **Recommended next step for production:** proxy API calls through a backend/serverless function so the key is never exposed to clients.

## 🗺️ Roadmap

- [ ] Move OpenWeatherMap API calls behind a backend/serverless proxy to hide the API key
- [ ] Add automated tests
- [ ] Add a License file

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Abhishek Bardhan** ([@flexin25](https://github.com/flexin25))

- GitHub: [github.com/flexin25](https://github.com/flexin25)
- Instagram: [@flexin25_](https://www.instagram.com/flexin25_)
- X (Twitter): [@1mflexin_](https://twitter.com/1mflexin_)

## 📄 License

No license file is currently included in this repository. All rights are reserved by the author (© 2025 Abhishek Bardhan) unless a license is added.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather, forecast, and air pollution data
- [Google Material Symbols](https://fonts.google.com/icons) for UI icons
- [Devicon](https://devicon.dev/) for the GitHub footer icon
- [Vercel](https://vercel.com/) for hosting

---

<p align="center">Made with ⛅ by Abhishek Bardhan</p>

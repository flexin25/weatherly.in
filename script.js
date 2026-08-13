const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const countryTxt = document.querySelector('.country-txt');
const temperatureTxt = document.querySelector('.temp-text');
const descriptionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const pressureTxt = document.querySelector('.pressure-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const feelsLikeTxt = document.querySelector('.feels-like-value-txt');
const visibilityValueTxt = document.querySelector('.visibility-value-txt');
const minMaxValueTxt = document.querySelector('.minmax-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

function buildInlineWeatherFallback(iconName) {
    const emojiByIcon = {
        'thunderstorm.svg': '⛈️',
        'drizzle.svg': '🌦️',
        'rain.svg': '🌧️',
        'snow.svg': '❄️',
        'atmosphere.svg': '🌫️',
        'clear.svg': '☀️',
        'clouds.svg': '☁️',
        'mostly-cloudy.svg': '🌥️'
    };
    const symbol = emojiByIcon[iconName] || '☁️';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="18" fill="#FFF9EC" stroke="#22223B" stroke-width="4"/><text x="48" y="58" text-anchor="middle" font-size="40">${symbol}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Helper to set image src with an automatic fallback
function setImageWithFallback(imgElem, src, fallbackSrc) {
    if (!imgElem) return;
    const resolvedFallback = fallbackSrc || buildInlineWeatherFallback('clouds.svg');
    try {
        const tester = new Image();
        tester.onload = function () {
            imgElem.src = src;
        };
        tester.onerror = function () {
            imgElem.src = resolvedFallback;
        };
        tester.src = src;
        imgElem.onerror = function () {
            imgElem.onerror = null;
            imgElem.src = resolvedFallback;
        };
    } catch (e) {
        imgElem.src = resolvedFallback;
    }
}

const tempUnitSlider = document.querySelector('.temp-unit-slider');
const tempUnitOptions = document.querySelectorAll('.temp-unit-option');

function resolveApiKey() {
    if (typeof config === 'undefined' || !config || typeof config.OPENWEATHER_API_KEY !== 'string') return '';
    return config.OPENWEATHER_API_KEY.trim();
}

function toTitleCase(text) {
    return text
        .split(' ')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function hasValidApiKey(key) {
    if (typeof config !== 'undefined' && config && typeof config.hasValidApiKey === 'function') {
        return config.hasValidApiKey(key);
    }
    const normalized = typeof key === 'string' ? key.trim().toLowerCase() : '';
    const placeholders = [
        '',
        'your_actual_api_key',
        'your_api_key_here',
        'replace_with_your_openweather_api_key',
        'your_real_api_key_here',
        'your_primary_api_key_here',
        'your_backup_api_key_here'
    ];
    return !placeholders.includes(normalized);
}

function readApiKeyFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('apiKey') || params.get('apikey') || params.get('appid') || '').trim();
}

function readApiKeyFromStorage() {
    try {
        return (localStorage.getItem(API_KEY_STORAGE_KEY) || '').trim();
    } catch (error) {
        console.warn('Unable to read API key from localStorage:', error);
        return '';
    }
}

function getActiveApiKey() {
    const configuredKey = resolveApiKey();
    if (hasValidApiKey(configuredKey)) return configuredKey;

    const queryKey = readApiKeyFromQuery();
    if (hasValidApiKey(queryKey)) return queryKey;

    const storedKey = readApiKeyFromStorage();
    if (hasValidApiKey(storedKey)) return storedKey;

    return configuredKey;
}

const infoBtn = document.querySelector('.info-btn');
const searchHint = document.querySelector('.search-hint');

if (infoBtn && searchHint) {
    // Show hint on hover
    infoBtn.addEventListener('mouseenter', () => {
        searchHint.style.display = 'flex';
    });

    // Hide hint when mouse leaves both button and hint
    infoBtn.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!searchHint.matches(':hover')) {
                searchHint.style.display = 'none';
            }
        }, 100);
    });

    searchHint.addEventListener('mouseleave', () => {
        searchHint.style.display = 'none';
    });
}

let currentUnit = localStorage.getItem('temperatureUnit') || 'celsius';
let currentWeatherData = null;
let currentLocationData = null;

window.addEventListener('DOMContentLoaded', () => {
    if (tempUnitSlider && currentUnit === 'fahrenheit') {
        tempUnitSlider.classList.add('fahrenheit');
    }
});

if (tempUnitOptions) {
    tempUnitOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newUnit = option.dataset.unit;
            if (newUnit === currentUnit) return;

            currentUnit = newUnit;
            localStorage.setItem('temperatureUnit', currentUnit);

            if (tempUnitSlider) {
                if (currentUnit === 'fahrenheit') {
                    tempUnitSlider.classList.add('fahrenheit');
                } else {
                    tempUnitSlider.classList.remove('fahrenheit');
                }
            }

            if (currentWeatherData) {
                updateTemperatureDisplay();
            }
        });
    });
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function convertTemperature(temp) {
    if (currentUnit === 'fahrenheit') {
        return Math.round(celsiusToFahrenheit(temp));
    }
    return Math.round(temp);
}

function getUnitSymbol() {
    return currentUnit === 'celsius' ? '°C' : '°F';
}

function updateTemperatureDisplay() {
    if (!currentWeatherData) return;

    const mainTemp = currentWeatherData.main.temp;
    temperatureTxt.textContent = `${convertTemperature(mainTemp)}${getUnitSymbol()}`;
    if (feelsLikeTxt) {
        feelsLikeTxt.textContent = `${convertTemperature(currentWeatherData.main.feels_like)}${getUnitSymbol()}`;
    }
    if (minMaxValueTxt) {
        minMaxValueTxt.textContent = `${convertTemperature(currentWeatherData.main.temp_min)}${getUnitSymbol()} / ${convertTemperature(currentWeatherData.main.temp_max)}${getUnitSymbol()}`;
    }
    if (visibilityValueTxt) {
        visibilityValueTxt.textContent = `${(currentWeatherData.visibility / 1000).toFixed(1)} km`;
    }

    const forecastItems = document.querySelectorAll('.forecast-item-temp');
    currentWeatherData.forecastTemps.forEach((temp, index) => {
        if (forecastItems[index]) {
            forecastItems[index].textContent = `${convertTemperature(temp)}${getUnitSymbol()}`;
        }
    });
}

function validateCityInput(input) {
    input = input.trim();

    if (input === '') {
        return { valid: false, message: 'Please enter a city name or zip code' };
    }

    if (input.length < 2) {
        return { valid: false, message: 'Input is too short' };
    }
    if (input.length > 50) {
        return { valid: false, message: 'Input is too long' };
    }

    const zipWithCountryPattern = /^\d{3,10},[A-Z]{2}$/i;
    const zipOnlyPattern = /^\d{5,10}$/;
    const cityPattern = /^[a-zA-Z\s\-'\.]+(?:,[a-zA-Z]{2})?$/;

    const isZipCode = zipWithCountryPattern.test(input) || zipOnlyPattern.test(input);

    if (!isZipCode && !cityPattern.test(input)) {
        return { valid: false, message: 'Please enter a valid city name or zip code' };
    }

    return { valid: true, message: '', isZipCode: isZipCode };
}

function showInputError(message) {
    let errorElement = document.querySelector('.input-error-message');
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'input-error-message';
        const inputContainer = document.querySelector('.input-container');
        inputContainer.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

function setSectionMessage(section, title, subtitle) {
    const titleElement = section.querySelector('h1');
    const subtitleElement = section.querySelector('h4');
    if (titleElement) titleElement.textContent = title;
    if (subtitleElement) subtitleElement.textContent = subtitle;
}

function showApiSetupError() {
    setSectionMessage(
        notFoundSection,
        'API Key Missing',
        'Set your OpenWeather API key in config.local.js or use ?apiKey=YOUR_KEY and reload'
    );
    showDisplaySection(notFoundSection);
}

function showForecastNotice(message) {
    if (!forecastItemsContainer) return;
    forecastItemsContainer.innerHTML = `<p class="forecast-notice">${message}</p>`;
}

function normalizeApiError(status, payload) {
    const message = typeof payload?.message === 'string' ? payload.message : '';
    const codValue = payload?.cod;
    const cod = codValue !== undefined ? String(codValue) : '';
    const lowered = message.toLowerCase();

    if (status === 401 || cod === '401' || lowered.includes('invalid api key') || lowered.includes('unauthorized')) {
        return {
            type: 'auth',
            title: 'Invalid API Key',
            message: 'Your OpenWeather API key is invalid or inactive'
        };
    }
    if (status === 404 || cod === '404') {
        return {
            type: 'not_found',
            title: 'Location Not Found',
            message: 'Please enter a valid city or zip code'
        };
    }
    return {
        type: 'api',
        title: 'Weather Service Error',
        message: 'Could not load weather data right now. Please try again'
    };
}

async function fetchOpenWeatherJson(apiUrl) {
    let response;
    try {
        response = await fetch(apiUrl);
    } catch (error) {
        const networkError = new Error('Network request failed');
        networkError.kind = 'network';
        throw networkError;
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        const parseError = new Error('Invalid API response');
        parseError.kind = 'parse';
        throw parseError;
    }

    if (!response.ok || (payload?.cod !== undefined && String(payload.cod) !== '200')) {
        const apiErrorInfo = normalizeApiError(response.status, payload);
        const apiError = new Error(apiErrorInfo.message);
        apiError.kind = apiErrorInfo.type;
        apiError.title = apiErrorInfo.title;
        throw apiError;
    }

    return payload;
}

searchButton.addEventListener('click', () => {
    const validation = validateCityInput(cityInput.value);
    if (!validation.valid) {
        showInputError(validation.message);
        return;
    }
    const activeApiKey = getActiveApiKey();

if (!activeApiKey) {
    showApiSetupError();
    return;
}
    updateWeatherInfo(cityInput.value.trim(), validation.isZipCode);
    cityInput.value = '';
    cityInput.blur();
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const validation = validateCityInput(cityInput.value);
        if (!validation.valid) {
            showInputError(validation.message);
            return;
        }
        if (!hasValidApiKey(getActiveApiKey())) {
            showApiSetupError();
            return;
        }
        updateWeatherInfo(cityInput.value.trim(), validation.isZipCode);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiKey = getActiveApiKey();
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    return fetchOpenWeatherJson(apiUrl);
}

function getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return 'thunderstorm.svg';
    if (id >= 300 && id <= 321) return 'drizzle.svg';
    if (id >= 500 && id <= 531) return 'rain.svg';
    if (id >= 600 && id <= 622) return 'snow.svg';
    if (id >= 700 && id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    if (id === 801 || id === 802) return 'clouds.svg';
    if (id === 803 || id === 804) return 'clouds.svg';
    return 'clouds.svg';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(input, isZipCode = false) {
    try {
        let weatherData;

        if (isZipCode) {
            const apiKey = getActiveApiKey();
            let zipParam = input;
            if (!input.includes(',')) {
                zipParam = `${input},US`;
            }
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipParam}&appid=${apiKey}&units=metric`;
            weatherData = await fetchOpenWeatherJson(apiUrl);
        } else {
            weatherData = await getFetchData('weather', input);
        }

        const {
            name: cityName,
            main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
            weather: [{ id, description }],
            wind: { speed },
            visibility,
            sys: { country: countryCode },
            coord: { lat, lon }
        } = weatherData;

        currentWeatherData = {
            main: { temp, feels_like, temp_min, temp_max },
            visibility,
            forecastTemps: []
        };

        currentLocationData = {
            lat: lat,
            lon: lon,
            name: `${cityName}, ${countryCode}`
        };

        countryTxt.textContent = `${cityName}, ${countryCode}`;
        temperatureTxt.textContent = `${convertTemperature(temp)}${getUnitSymbol()}`;
        descriptionTxt.textContent = toTitleCase(description);
        humidityTxt.textContent = `${humidity}%`;
        pressureTxt.textContent = `${pressure} hPa`;
        windValueTxt.textContent = `${speed.toFixed(1)} M/s`;
        if (feelsLikeTxt) {
            feelsLikeTxt.textContent = `${convertTemperature(feels_like)}${getUnitSymbol()}`;
        }
        if (visibilityValueTxt) {
            visibilityValueTxt.textContent = `${(visibility / 1000).toFixed(1)} km`;
        }
        if (minMaxValueTxt) {
            minMaxValueTxt.textContent = `${convertTemperature(temp_min)}${getUnitSymbol()} / ${convertTemperature(temp_max)}${getUnitSymbol()}`;
        }
        const iconName = getWeatherIcon(id);
        setImageWithFallback(
            weatherSummaryImg,
            `assets/weather/${iconName}`,
            buildInlineWeatherFallback(iconName)
        );


        try {
            await updateForecastInfo(input, isZipCode);
        } catch (error) {
            showForecastNotice('Forecast unavailable right now, current weather is still shown');
        }

        if (currentDateTxt) {
            currentDateTxt.textContent = getCurrentDate();
        }

        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn && currentLocationData) {
            dashboardBtn.href = `airquality.html?lat=${currentLocationData.lat}&lon=${currentLocationData.lon}&name=${encodeURIComponent(currentLocationData.name)}`;
            dashboardBtn.style.display = 'flex';
        }

        showDisplaySection(weatherInfoSection);
    } catch (error) {
        const isAuthError = error?.kind === 'auth';
        const isNotFoundError = error?.kind === 'not_found';
        const isNetworkError = error?.kind === 'network';

        if (isAuthError) {
            setSectionMessage(notFoundSection, 'Invalid API Key', 'Please update your API key in config.local.js or via ?apiKey=YOUR_KEY');
        } else if (isNotFoundError) {
            setSectionMessage(notFoundSection, 'Location Not Found', 'Please search with a valid city or zip,country');
        } else if (isNetworkError) {
            setSectionMessage(notFoundSection, 'Network Error', 'Unable to reach OpenWeather. Check your connection and retry');
        } else {
            setSectionMessage(notFoundSection, 'Weather Error', 'Unable to load weather report. Please try again');
        }
        showDisplaySection(notFoundSection);
    }
}

async function updateForecastInfo(input, isZipCode = false) {
    let forecastsData;

    if (isZipCode) {
        const apiKey = getActiveApiKey();
        let zipParam = input;
        if (!input.includes(',')) {
            zipParam = `${input},US`;
        }
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipParam}&appid=${apiKey}&units=metric`;
        forecastsData = await fetchOpenWeatherJson(apiUrl);
    } else {
        forecastsData = await getFetchData('forecast', input);
    }
    if (!forecastsData || !forecastsData.list) {
        const forecastDataError = new Error('Forecast data missing');
        forecastDataError.kind = 'api';
        throw forecastDataError;
    }

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    currentWeatherData.forecastTemps = [];

    const filtered = forecastsData.list.filter(forecast => {
        return forecast.dt_txt.includes(timeTaken) && !forecast.dt_txt.includes(todayDate);
    });

    if (filtered.length === 0) {
        showForecastNotice('No forecast data available for the next days');
        return;
    }

    filtered.forEach(forecast => {
        currentWeatherData.forecastTemps.push(forecast.main.temp);
        updateForecastItems(forecast);
    });
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp },
    } = weatherData;

    const iconName = getWeatherIcon(id);
    const fallbackIconSrc = buildInlineWeatherFallback(iconName);
    const formattedDate = formatDate(date);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="assets/weather/${iconName}" class="forecast-item-img" alt="" onerror="this.onerror=null;this.src='${fallbackIconSrc}'">
            <h5 class="forecast-item-temp">${convertTemperature(temp)}${getUnitSymbol()}</h5>
        </div>`;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function showDisplaySection(section) {
    [weatherInfoSection, notFoundSection, searchCitySection].forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}

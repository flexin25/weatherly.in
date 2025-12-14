const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn')

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const countryTxt = document.querySelector('.country-txt');
const temperatureTxt = document.querySelector('.temp-text');
const descriptionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const pressureTxt = document.querySelector('.pressure-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');
const unitToggleBtns = document.querySelectorAll('.unit-toggle-btn');
const tempUnitSlider = document.querySelector('.temp-unit-slider');
const tempUnitOptions = document.querySelectorAll('.temp-unit-option');
const suggestionsDropdown = document.querySelector('.suggestions-dropdown');

const apiKey = config.OPENWEATHER_API_KEY;

let debounceTimer;

const infoBtn = document.querySelector('.info-btn');
const searchHint = document.querySelector('.search-hint');

if (infoBtn && searchHint) {
    infoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchHint.style.display === 'none' || searchHint.style.display === '') {
            searchHint.style.display = 'flex';
        } else {
            searchHint.style.display = 'none';
        }
    });
}

async function fetchCitySuggestions(query) {
    if (query.length < 2) {
        suggestionsDropdown.style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${apiKey}`);
        const data = await response.json();
        
        if (data.length > 0) {
            displaySuggestions(data);
        } else {
            suggestionsDropdown.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsDropdown.style.display = 'none';
    }
}

function displaySuggestions(locations) {
    const suggestionItems = locations.map(location => {
        const cityName = location.name;
        const stateName = location.state ? `, ${location.state}` : '';
        const countryName = location.country;
        return `<div class="suggestion-item" data-city="${cityName}">${cityName}${stateName}, ${countryName}</div>`;
    }).join('');
    
    suggestionsDropdown.innerHTML = suggestionItems;
    suggestionsDropdown.style.display = 'block';
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const cityName = item.getAttribute('data-city');
            cityInput.value = cityName;
            suggestionsDropdown.style.display = 'none';
            updateWeatherInfo(cityName);
        });
    });
}

cityInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestionsDropdown.style.display = 'none';
        return;
    }
    
    debounceTimer = setTimeout(() => {
        fetchCitySuggestions(query);
    }, 300);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-container')) {
        suggestionsDropdown.style.display = 'none';
    }
});

let currentUnit = localStorage.getItem('temperatureUnit') || 'celsius';
let currentWeatherData = null;
let currentLocationData = null;

window.addEventListener('DOMContentLoaded', () => {
    unitToggleBtns.forEach(btn => {
        if (btn.dataset.unit === currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (tempUnitSlider) {
        if (currentUnit === 'fahrenheit') {
            tempUnitSlider.classList.add('fahrenheit');
        }
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
            
            unitToggleBtns.forEach(btn => {
                if (btn.dataset.unit === currentUnit) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            if (currentWeatherData) {
                updateTemperatureDisplay();
            }
        });
    });
}

unitToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newUnit = btn.dataset.unit;
        if (newUnit === currentUnit) return;
        
        currentUnit = newUnit;
        localStorage.setItem('temperatureUnit', currentUnit);
        
        unitToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (currentWeatherData) {
            updateTemperatureDisplay();
        }
    });
});

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
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
    const cityPattern = /^[a-zA-Z\s\-'\.]+$/;
    
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

searchButton.addEventListener('click', () => {
    const validation = validateCityInput(cityInput.value);
    if (!validation.valid) {
        showInputError(validation.message);
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
        updateWeatherInfo(cityInput.value.trim(), validation.isZipCode);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl)
    return response.json();
}

function getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return 'thunderstorm.svg';
    if (id >= 300 && id <= 321) return 'drizzle.svg';
    if (id >= 500 && id <= 531) return 'rain.svg';
    if (id === 600) return 'snow.svg';
    if (id >= 601 && id <= 622) return 'snow.svg';
    if (id >= 700 && id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    if (id === 801 || id === 802) return 'clouds.svg';
    if (id === 803 || id === 804) return 'mostly-cloudy.svg';
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
    let weatherData;
    
    if (isZipCode) {
        let zipParam = input;
        if (!input.includes(',')) {
            zipParam = `${input},US`;
        }
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipParam}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        weatherData = await response.json();
    } else {
        weatherData = await getFetchData('weather', input);
    }
    
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);

    const {
        name: country,
        main: { temp, humidity, pressure },
        weather: [{ id, main }],
        wind: { speed },
        coord: { lat, lon }
    } = weatherData;

    currentWeatherData = {
        main: { temp },
        forecastTemps: []
    };
    
    currentLocationData = {
        lat: lat,
        lon: lon,
        name: country
    };

    countryTxt.textContent = country;
    temperatureTxt.textContent = `${convertTemperature(temp)}${getUnitSymbol()}`;
    descriptionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    pressureTxt.textContent = `${pressure} hPa`;
    windValueTxt.textContent = `${speed.toFixed(1)} M/s`;
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastInfo(input, isZipCode);

    currentDateTxt.textContent = getCurrentDate();
    
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn && currentLocationData) {
        dashboardBtn.href = `airquality.html?lat=${currentLocationData.lat}&lon=${currentLocationData.lon}&name=${encodeURIComponent(currentLocationData.name)}`;
        dashboardBtn.style.display = 'flex';
    }

    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(input, isZipCode = false) {
    let forecastsData;
    
    if (isZipCode) {
        let zipParam = input;
        if (!input.includes(',')) {
            zipParam = `${input},US`;
        }
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipParam}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        forecastsData = await response.json();
    } else {
        forecastsData = await getFetchData('forecast', input);
    }
    if (!forecastsData || !forecastsData.list) return;

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    currentWeatherData.forecastTemps = [];

    const filtered = forecastsData.list.filter(forecast => {
        return forecast.dt_txt.includes(timeTaken) && !forecast.dt_txt.includes(todayDate);
    });

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

    const formattedDate = formatDate(date);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img" alt="">
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


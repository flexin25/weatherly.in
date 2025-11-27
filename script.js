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

const apiKey = '04c90abb0c88d8da11534c112a244bc9';

searchButton.addEventListener('click', () => {
    if (cityInput.value.trim() === '') return;
    updateWeatherInfo(cityInput.value)
    cityInput.value = '';
    cityInput.blur();
});
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value)
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
    // Thunderstorm: 200-232
    if (id >= 200 && id <= 232) return 'thunderstorm.svg';
    
    // Drizzle: 300-321
    if (id >= 300 && id <= 321) return 'drizzle.svg';
    
    // Rain: 500-531
    // 500: light rain, 501: moderate rain, 502-504: heavy rain, 511: freezing rain, 520-531: showers
    if (id >= 500 && id <= 531) return 'rain.svg';
    
    // Snow: 600-622
    // 600: light snow, 601: snow, 602: heavy snow, 611-616: sleet/rain+snow, 620-622: showers
    if (id === 600) return 'snow.svg'; // Light snow
    if (id >= 601 && id <= 622) return 'snow.svg'; // All other snow
    
    // Atmosphere (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado): 700-781
    // 701: mist, 711: smoke, 721: haze, 731: dust/sand, 741: fog, 751: sand, 761: dust, 762: ash, 771: squall, 781: tornado
    if (id >= 700 && id <= 781) return 'atmosphere.svg';
    
    // Clear: 800
    if (id === 800) return 'clear.svg';
    
    // Clouds: 801-804
    // 801: few clouds (11-25%)
    // 802: scattered clouds (25-50%)
    // 803: broken clouds (51-84%)
    // 804: overcast clouds (85-100%)
    if (id === 801 || id === 802) return 'clouds.svg';
    if (id === 803 || id === 804) return 'mostly-cloudy.svg';
    
    // Default fallback
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

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
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
    } = weatherData;

    countryTxt.textContent = country;
    temperatureTxt.textContent = `${Math.round(temp)}°C`;
    descriptionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    pressureTxt.textContent = `${pressure} hPa`;
    windValueTxt.textContent = `${speed.toFixed(1)} M/s`;
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastInfo(city);

    currentDateTxt.textContent = getCurrentDate();

    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    if (!forecastsData || !forecastsData.list) return;

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';

    const filtered = forecastsData.list.filter(forecast => {
        return forecast.dt_txt.includes(timeTaken) && !forecast.dt_txt.includes(todayDate);
    });

    filtered.forEach(forecast => {
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
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
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


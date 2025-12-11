const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const airQualityInfoSection = document.querySelector('.air-quality-info');

const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-date-txt');
const sunriseTxt = document.querySelector('.sunrise-txt');
const sunsetTxt = document.querySelector('.sunset-txt');
const visibilityTxt = document.querySelector('.visibility-txt');
const aqiValueTxt = document.querySelector('.aqi-value-txt');

const pm25Txt = document.querySelector('.pm25-txt');
const pm10Txt = document.querySelector('.pm10-txt');
const coTxt = document.querySelector('.co-txt');
const no2Txt = document.querySelector('.no2-txt');
const o3Txt = document.querySelector('.o3-txt');
const so2Txt = document.querySelector('.so2-txt');

const apiKey = '04c90abb0c88d8da11534c112a244bc9';

function updateDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    };
    const dateString = currentDate.toLocaleDateString('en-US', options);
    currentDateTxt.textContent = dateString;
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function getAQILevel(aqi) {
    const levels = {
        1: { text: 'Good', color: '#10b981' },
        2: { text: 'Fair', color: '#fbbf24' },
        3: { text: 'Moderate', color: '#f97316' },
        4: { text: 'Poor', color: '#ef4444' },
        5: { text: 'Very Poor', color: '#8b5cf6' }
    };
    return levels[aqi] || levels[1];
}

async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function getAirPollutionData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function updateAirQualityInfo(lat, lon, locationName) {
    try {
        const [weatherData, airPollutionData] = await Promise.all([
            getWeatherData(lat, lon),
            getAirPollutionData(lat, lon)
        ]);
        
        searchCitySection.style.display = 'none';
        notFoundSection.style.display = 'none';
        airQualityInfoSection.style.display = 'flex';
        
        countryTxt.textContent = locationName;
        updateDate();
        
        sunriseTxt.textContent = formatTime(weatherData.sys.sunrise);
        sunsetTxt.textContent = formatTime(weatherData.sys.sunset);
        
        const visibilityKm = (weatherData.visibility / 1000).toFixed(1);
        visibilityTxt.textContent = `${visibilityKm} km`;
        
        const aqi = airPollutionData.list[0].main.aqi;
        const aqiLevel = getAQILevel(aqi);
        aqiValueTxt.textContent = aqiLevel.text;
        aqiValueTxt.style.background = aqiLevel.color;
        
        const components = airPollutionData.list[0].components;
        pm25Txt.textContent = components.pm2_5.toFixed(1);
        pm10Txt.textContent = components.pm10.toFixed(1);
        coTxt.textContent = (components.co / 1000).toFixed(2);
        no2Txt.textContent = components.no2.toFixed(1);
        o3Txt.textContent = components.o3.toFixed(1);
        so2Txt.textContent = components.so2.toFixed(1);
        
    } catch (error) {
        searchCitySection.style.display = 'none';
        airQualityInfoSection.style.display = 'none';
        notFoundSection.style.display = 'flex';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lon = urlParams.get('lon');
    const name = urlParams.get('name');
    
    if (lat && lon && name) {
        updateAirQualityInfo(parseFloat(lat), parseFloat(lon), decodeURIComponent(name));
    } else {
        searchCitySection.style.display = 'flex';
        searchCitySection.querySelector('h1').textContent = 'No Location Data';
        searchCitySection.querySelector('h4').textContent = 'Please search from the weather page first';
    }
});

// ==================== GLOBAL VARIABLES ====================
const searchWrapper = document.getElementById('searchWrapper');
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
const toastContainer = document.getElementById('toastContainer');
const appContainer = document.querySelector('.app-container');
const weatherEffects = document.getElementById('weatherEffects');

// OpenWeatherMap API Configuration
const API_KEY = '895284fb2d2c50a520ea537456963d9c';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// Weather effect intervals
let weatherEffectInterval = null;

// ==================== SEARCH BAR FUNCTIONALITY ====================

function toggleSearch() {
    searchWrapper.classList.toggle('active');
    if (searchWrapper.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
    }
}

function collapseSearch() {
    searchWrapper.classList.remove('active');
    searchInput.value = '';
}

searchIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!searchWrapper.classList.contains('active')) {
        toggleSearch();
    }
});

document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target) && searchWrapper.classList.contains('active')) {
        collapseSearch();
    }
});

searchWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchWrapper.classList.contains('active')) {
        collapseSearch();
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// ==================== SEARCH HANDLER ====================

async function handleSearch() {
    const cityName = searchInput.value.trim();

    if (!cityName) {
        showToast('Please enter a city name', 'error');
        return;
    }

    showToast('Fetching weather data...', 'info');
    const weatherData = await fetchWeather(cityName);

    if (weatherData) {
        updateWeather(weatherData);
        showToast(`Weather updated for ${weatherData.city}`, 'success');
    }

    collapseSearch();
}

// ==================== WEATHER API INTEGRATION ====================

async function fetchWeather(cityName) {
    try {
        const currentResponse = await fetch(
            `${API_BASE}/weather?q=${cityName}&units=metric&appid=${API_KEY}`
        );

        if (!currentResponse.ok) {
            if (currentResponse.status === 404) {
                showToast('City not found. Please try again.', 'error');
            } else {
                showToast('Failed to fetch weather data', 'error');
            }
            return null;
        }

        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
        );

        const forecastData = await forecastResponse.json();
        return processWeatherData(currentData, forecastData);

    } catch (error) {
        console.error('Error fetching weather:', error);
        showToast('Network error. Please check your connection.', 'error');
        return null;
    }
}

function processWeatherData(current, forecast) {
    const currentTime = Date.now() / 1000;
    const sunrise = current.sys.sunrise;
    const sunset = current.sys.sunset;
    const isDay = currentTime > sunrise && currentTime < sunset;

    const weatherMain = current.weather[0].main.toLowerCase();
    const weatherDesc = current.weather[0].description;

    const hourlyForecast = forecast.list.slice(0, 6).map((item, index) => {
        const time = new Date(item.dt * 1000);
        const timeStr = index === 0 ? 'Now' : time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });

        return {
            time: timeStr,
            icon: getWeatherIconClass(item.weather[0].main, item.weather[0].icon),
            temp: Math.round(item.main.temp)
        };
    });

    const dailyForecast = [];
    const processedDays = new Set();

    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

        if (!processedDays.has(dateStr) && dailyForecast.length < 5) {
            const dayStr = dailyForecast.length === 0 ? 'Today' :
                dailyForecast.length === 1 ? 'Tomorrow' :
                    date.toLocaleDateString('en-US', { weekday: 'short' });

            dailyForecast.push({
                date: dateStr,
                day: dayStr,
                icon: getWeatherIconClass(item.weather[0].main, item.weather[0].icon),
                tempMin: Math.round(item.main.temp_min),
                tempMax: Math.round(item.main.temp_max)
            });

            processedDays.add(dateStr);
        }
    });

    const humidity = current.main.humidity;
    const mockAQI = Math.min(Math.round(humidity * 3 + Math.random() * 50), 500);

    return {
        city: current.name,
        currentTemp: Math.round(current.main.temp),
        condition: weatherDesc,
        weatherMain: weatherMain,
        tempMin: Math.round(current.main.temp_min),
        tempMax: Math.round(current.main.temp_max),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        pressure: current.main.pressure,
        windSpeed: Math.round(current.wind.speed * 3.6),
        windDirection: getWindDirection(current.wind.deg),
        visibility: Math.round(current.visibility / 1000),
        cloudiness: current.clouds.all,
        sunrise: new Date(sunrise * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }),
        sunset: new Date(sunset * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }),
        isDay: isDay,
        aqi: mockAQI,
        aqiStatus: getAQIStatus(mockAQI).label,
        hourly: hourlyForecast,
        forecast: dailyForecast,
        icon: current.weather[0].icon
    };
}

function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}

function getWeatherIconClass(weatherMain, iconCode) {
    const iconMap = {
        'clear': 'ri-sun-line',
        'clouds': 'ri-cloudy-line',
        'rain': 'ri-rainy-line',
        'drizzle': 'ri-drizzle-line',
        'thunderstorm': 'ri-thunderstorms-line',
        'snow': 'ri-snowy-line',
        'mist': 'ri-mist-line',
        'fog': 'ri-foggy-line',
        'haze': 'ri-haze-line'
    };

    const main = weatherMain.toLowerCase();

    if (iconCode && iconCode.includes('n')) {
        if (main === 'clear') return 'ri-moon-line';
    }

    return iconMap[main] || 'ri-sun-line';
}

// ==================== WEATHER UPDATE FUNCTIONALITY ====================

function updateWeather(data) {
    document.getElementById('topCityName').textContent = data.city;
    document.getElementById('heroCity').textContent = data.city;
    document.getElementById('heroTemp').textContent = `${data.currentTemp}°`;
    document.getElementById('heroDetails').textContent =
        `${data.condition}   ${data.tempMin}° / ${data.tempMax}°   Air quality: ${data.aqi} – ${data.aqiStatus}`;

    document.getElementById('aqiStatus').textContent = `${data.aqiStatus} ${data.aqi}`;
    document.getElementById('aqiValue').textContent = data.aqi;
    document.getElementById('aqiDesc').textContent = getAQIDescription(data.aqi);

    updateHourlyForecast(data.hourly);
    updateDailyForecast(data.forecast);
    updateMetrics(data);
    updateSunTimes(data.sunrise, data.sunset);
    applyWeatherTheme(data);
}

function updateHourlyForecast(hourly) {
    const container = document.querySelector('.hourly-forecast');
    container.innerHTML = hourly.map(item => `
        <div class="hourly-item">
            <div class="hourly-time">${item.time}</div>
            <i class="${item.icon} hourly-icon"></i>
            <div class="hourly-temp">${item.temp}°</div>
        </div>
    `).join('');
}

function updateDailyForecast(forecast) {
    const container = document.querySelector('.forecast-list');
    container.innerHTML = forecast.map(item => `
        <div class="forecast-item">
            <div class="forecast-date">${item.date}</div>
            <div class="forecast-day">${item.day}</div>
            <i class="${item.icon} forecast-icon"></i>
            <div class="forecast-temp">${item.tempMin}° / ${item.tempMax}°</div>
        </div>
    `).join('');
}

function updateMetrics(data) {
    const metricsHTML = `
        <div class="metric-card glass-card">
            <i class="ri-sun-line metric-icon"></i>
            <div class="metric-label">UV Index</div>
            <div class="metric-value">6 Moderate</div>
        </div>
        <div class="metric-card glass-card">
            <i class="ri-temp-hot-line metric-icon"></i>
            <div class="metric-label">Feels like</div>
            <div class="metric-value">${data.feelsLike}°</div>
        </div>
        <div class="metric-card glass-card">
            <i class="ri-drop-line metric-icon"></i>
            <div class="metric-label">Humidity</div>
            <div class="metric-value">${data.humidity}%</div>
        </div>
        <div class="metric-card glass-card">
            <i class="ri-windy-line metric-icon"></i>
            <div class="metric-label">${data.windDirection} wind</div>
            <div class="metric-value">${data.windSpeed} km/h</div>
        </div>
        <div class="metric-card glass-card">
            <i class="ri-speed-line metric-icon"></i>
            <div class="metric-label">Air pressure</div>
            <div class="metric-value">${data.pressure} hPa</div>
        </div>
        <div class="metric-card glass-card">
            <i class="ri-eye-line metric-icon"></i>
            <div class="metric-label">Visibility</div>
            <div class="metric-value">${data.visibility} km</div>
        </div>
    `;
    document.querySelector('.metrics-grid').innerHTML = metricsHTML;
}

function updateSunTimes(sunrise, sunset) {
    document.querySelectorAll('.sun-time')[0].textContent = sunrise;
    document.querySelectorAll('.sun-time')[1].textContent = sunset;
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    if (aqi <= 100) return 'Air quality is acceptable for most people.';
    if (aqi <= 150) return 'Members of sensitive groups may experience health effects.';
    if (aqi <= 200) return 'May cause breathing discomfort for people with prolonged exposure.';
    if (aqi <= 300) return 'Everyone may experience health effects; members of sensitive groups may experience more serious effects.';
    return 'Health alert: everyone may experience more serious health effects.';
}

function applyWeatherTheme(data) {
    clearWeatherEffects();
    const themes = ['clear-day', 'clear-night', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy', 'sunset', 'sunrise'];
    themes.forEach(theme => appContainer.classList.remove(theme));

    const weatherMain = data.weatherMain;
    const isDay = data.isDay;
    let theme = 'clear-day';

    if (weatherMain.includes('rain')) {
        theme = 'rainy';
    } else if (weatherMain.includes('cloud')) {
        theme = 'cloudy';
    } else if (weatherMain.includes('fog') || weatherMain.includes('mist')) {
        theme = 'foggy';
    } else if (weatherMain.includes('clear')) {
        theme = isDay ? 'clear-day' : 'clear-night';
    }

    appContainer.classList.add(theme);
}

function clearWeatherEffects() {
    if (weatherEffectInterval) {
        clearInterval(weatherEffectInterval);
        weatherEffectInterval = null;
    }
    if (weatherEffects) {
        weatherEffects.innerHTML = '';
    }
}

// ==================== TOAST NOTIFICATION SYSTEM ====================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-check-line';
    if (type === 'error') icon = 'ri-error-warning-line';

    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        hideToast(toast);
    }, 3000);
}

function hideToast(toast) {
    toast.classList.add('hide');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#4ade80' };
    if (aqi <= 100) return { label: 'Moderate', color: '#fbbf24' };
    if (aqi <= 150) return { label: 'Unhealthy', color: '#fb923c' };
    if (aqi <= 200) return { label: 'Poor', color: '#f87171' };
    if (aqi <= 300) return { label: 'Very Poor', color: '#dc2626' };
    return { label: 'Severe', color: '#991b1b' };
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Weather App Initialized');
    document.documentElement.style.scrollBehavior = 'smooth';

    showToast('Loading weather data...', 'info');
    const defaultWeather = await fetchWeather('Surat');
    if (defaultWeather) {
        updateWeather(defaultWeather);
    }
});
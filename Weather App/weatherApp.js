// ==================== WEATHER DATA MODULE ====================
// This file contains all the weather-related data structures and mock data
// Designed to be easily replaceable with real API data

/**
 * Default weather data for Surat
 */
const defaultWeatherData = {
    city: 'Surat',
    currentTemp: 31,
    condition: 'Fog',
    tempMin: 20,
    tempMax: 32,
    aqi: 208,
    aqiStatus: 'Poor',
    aqiDescription: 'May cause breathing discomfort for people with prolonged exposure…',

    // Hourly forecast
    hourly: [
        { time: 'Now', icon: 'ri-foggy-line', temp: 31 },
        { time: '2:00 pm', icon: 'ri-cloudy-line', temp: 31 },
        { time: '3:00 pm', icon: 'ri-cloudy-line', temp: 31 },
        { time: '4:00 pm', icon: 'ri-cloudy-line', temp: 31 },
        { time: '5:00 pm', icon: 'ri-cloudy-line', temp: 29 },
        { time: '5:55 pm', icon: 'ri-sunset-line', temp: 28 }
    ],

    // 5-day forecast
    forecast: [
        { date: '29 Nov', day: 'Today', icon: 'ri-cloudy-line', tempMin: 20, tempMax: 32 },
        { date: '30 Nov', day: 'Tomorrow', icon: 'ri-sun-line', tempMin: 19, tempMax: 32 },
        { date: '1 Dec', day: 'Mon', icon: 'ri-sun-line', tempMin: 18, tempMax: 31 },
        { date: '2 Dec', day: 'Tue', icon: 'ri-sun-line', tempMin: 19, tempMax: 31 },
        { date: '3 Dec', day: 'Wed', icon: 'ri-sun-line', tempMin: 19, tempMax: 31 }
    ],

    // Metrics
    metrics: {
        uv: { value: 6, label: 'Moderate' },
        feelsLike: 31,
        humidity: 31,
        wind: { direction: 'E', speed: 14, unit: 'km/h' },
        pressure: 1013,
        visibility: 4
    },

    // Sun times
    sun: {
        sunrise: '6:58 am',
        sunset: '5:55 pm',
        progress: 65 // Percentage of day completed
    }
};

/**
 * Weather condition icons mapping
 */
const weatherIcons = {
    'Clear': 'ri-sun-line',
    'Sunny': 'ri-sun-line',
    'Cloudy': 'ri-cloudy-line',
    'Partly Cloudy': 'ri-cloudy-2-line',
    'Fog': 'ri-foggy-line',
    'Rainy': 'ri-rainy-line',
    'Heavy Rain': 'ri-heavy-showers-line',
    'Thunderstorm': 'ri-thunderstorms-line',
    'Snow': 'ri-snowy-line',
    'Haze': 'ri-mist-line',
    'Windy': 'ri-windy-line'
};

/**
 * AQI Status thresholds and colors
 */
const aqiThresholds = {
    good: { max: 50, label: 'Good', color: '#4ade80' },
    moderate: { max: 100, label: 'Moderate', color: '#fbbf24' },
    unhealthy: { max: 150, label: 'Unhealthy', color: '#fb923c' },
    poor: { max: 200, label: 'Poor', color: '#f87171' },
    veryPoor: { max: 300, label: 'Very Poor', color: '#dc2626' },
    severe: { max: 500, label: 'Severe', color: '#991b1b' }
};

/**
 * Sample city data for testing
 */
const sampleCities = {
    'Surat': {
        temp: 31,
        condition: 'Fog',
        aqi: 208,
        tempMin: 20,
        tempMax: 32
    },
    'Chennai': {
        temp: 27,
        condition: 'Fog',
        aqi: 43,
        tempMin: 23,
        tempMax: 29
    },
    'Mumbai': {
        temp: 31,
        condition: 'Fog',
        aqi: 262,
        tempMin: 26,
        tempMax: 33
    },
    'Delhi': {
        temp: 24,
        condition: 'Haze',
        aqi: 322,
        tempMin: 18,
        tempMax: 28
    },
    'Bangalore': {
        temp: 26,
        condition: 'Cloudy',
        aqi: 78,
        tempMin: 21,
        tempMax: 29
    },
    'Ahmedabad': {
        temp: 29,
        condition: 'Fog',
        aqi: 201,
        tempMin: 22,
        tempMax: 32
    },
    'Kolkata': {
        temp: 28,
        condition: 'Haze',
        aqi: 156,
        tempMin: 23,
        tempMax: 31
    },
    'Pune': {
        temp: 27,
        condition: 'Clear',
        aqi: 92,
        tempMin: 22,
        tempMax: 30
    },
    'Hyderabad': {
        temp: 30,
        condition: 'Sunny',
        aqi: 88,
        tempMin: 24,
        tempMax: 33
    }
};

/**
 * Get AQI status and color based on value
 * @param {number} aqi - Air Quality Index value
 * @returns {Object} AQI status information
 */
function getAQIStatus(aqi) {
    if (aqi <= aqiThresholds.good.max) return aqiThresholds.good;
    if (aqi <= aqiThresholds.moderate.max) return aqiThresholds.moderate;
    if (aqi <= aqiThresholds.unhealthy.max) return aqiThresholds.unhealthy;
    if (aqi <= aqiThresholds.poor.max) return aqiThresholds.poor;
    if (aqi <= aqiThresholds.veryPoor.max) return aqiThresholds.veryPoor;
    return aqiThresholds.severe;
}

/**
 * Get weather icon class based on condition
 * @param {string} condition - Weather condition
 * @returns {string} Icon class name
 */
function getWeatherIcon(condition) {
    return weatherIcons[condition] || 'ri-sun-line';
}

/**
 * Generate hourly forecast data
 * @param {number} currentTemp - Current temperature
 * @param {string} condition - Current weather condition
 * @returns {Array} Array of hourly forecast objects
 */
function generateHourlyForecast(currentTemp, condition) {
    const hours = [];
    const icon = getWeatherIcon(condition);

    hours.push({ time: 'Now', icon: icon, temp: currentTemp });

    for (let i = 1; i <= 5; i++) {
        const hour = new Date();
        hour.setHours(hour.getHours() + i);
        const timeStr = hour.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const temp = currentTemp + Math.floor(Math.random() * 5) - 2;
        hours.push({ time: timeStr, icon: icon, temp });
    }

    return hours;
}

/**
 * Generate 5-day forecast data
 * @param {number} currentTemp - Current temperature
 * @returns {Array} Array of daily forecast objects
 */
function generateDailyForecast(currentTemp) {
    const forecast = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        const dayStr = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : days[date.getDay()]);

        const tempMax = currentTemp + Math.floor(Math.random() * 3);
        const tempMin = tempMax - Math.floor(Math.random() * 10) - 5;

        const conditions = ['ri-sun-line', 'ri-cloudy-line', 'ri-cloudy-2-line'];
        const icon = conditions[Math.floor(Math.random() * conditions.length)];

        forecast.push({
            date: dateStr,
            day: dayStr,
            icon: icon,
            tempMin: tempMin,
            tempMax: tempMax
        });
    }

    return forecast;
}

/**
 * Get city weather data (mock or from sample)
 * @param {string} cityName - Name of the city
 * @returns {Object} Weather data for the city
 */
function getCityWeatherData(cityName) {
    // Check if we have sample data for this city
    const cityData = sampleCities[cityName];

    if (cityData) {
        return {
            ...cityData,
            city: cityName,
            hourly: generateHourlyForecast(cityData.temp, cityData.condition),
            forecast: generateDailyForecast(cityData.temp)
        };
    }

    // Generate random data for unknown cities
    const temp = Math.floor(Math.random() * 15) + 20;
    const conditions = Object.keys(weatherIcons);
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const aqi = Math.floor(Math.random() * 300) + 50;

    return {
        city: cityName,
        temp: temp,
        condition: condition,
        aqi: aqi,
        tempMin: temp - Math.floor(Math.random() * 5) - 2,
        tempMax: temp + Math.floor(Math.random() * 5) + 2,
        hourly: generateHourlyForecast(temp, condition),
        forecast: generateDailyForecast(temp)
    };
}

// Export for use in other modules (if using ES6 modules)
// export { defaultWeatherData, getAQIStatus, getWeatherIcon, getCityWeatherData };
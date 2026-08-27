// ==========================================
// OPEN-METEO WEATHER SERVICE UTILITY
// ==========================================

const WMO_WEATHER_MAP = {
  0: { label: "Clear Sky", icon: "sun" },
  1: { label: "Mainly Clear", icon: "sun-cloud" },
  2: { label: "Partly Cloudy", icon: "sun-cloud" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Foggy", icon: "cloud" },
  48: { label: "Rime Fog", icon: "cloud" },
  51: { label: "Light Drizzle", icon: "rain" },
  53: { label: "Moderate Drizzle", icon: "rain" },
  55: { label: "Heavy Drizzle", icon: "rain" },
  61: { label: "Slight Rain", icon: "rain" },
  63: { label: "Moderate Rain", icon: "rain" },
  65: { label: "Heavy Rain", icon: "rain" },
  71: { label: "Slight Snow", icon: "snow" },
  73: { label: "Moderate Snow", icon: "snow" },
  75: { label: "Heavy Snow", icon: "snow" },
  80: { label: "Rain Showers", icon: "rain" },
  81: { label: "Heavy Showers", icon: "rain" },
  82: { label: "Violent Showers", icon: "rain" },
  95: { label: "Thunderstorm", icon: "thunder" },
};

export const getWeatherCodeInfo = (code) => {
  return WMO_WEATHER_MAP[code] || { label: "Clear", icon: "sun" };
};

/**
 * Fetches current live weather AND historical travel weather for a given location and date.
 */
export const fetchMemoryWeatherComparison = async (locationStr, startDateStr) => {
  try {
    if (!locationStr) return null;

    // 1. Geocode location via Open-Meteo Geocoding (Try full query first, fallback to first city segment)
    let geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        locationStr
      )}&count=1&language=en&format=json`
    );
    let geoData = await geoRes.json();

    // Fallback: If full string fails (e.g. "Kochi, Kerala, India"), search using first city word "Kochi"
    if ((!geoData.results || geoData.results.length === 0) && locationStr.includes(",")) {
      const citySegment = locationStr.split(",")[0].trim();
      geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          citySegment
        )}&count=1&language=en&format=json`
      );
      geoData = await geoRes.json();
    }

    if (!geoData.results || geoData.results.length === 0) return null;

    const { latitude: lat, longitude: lon, name, country } = geoData.results[0];

    // 2. Fetch Live Current Weather
    const liveRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const liveData = await liveRes.json();

    let liveWeather = null;
    if (liveData.current_weather) {
      const codeInfo = getWeatherCodeInfo(liveData.current_weather.weathercode);
      liveWeather = {
        temp: Math.round(liveData.current_weather.temperature),
        condition: codeInfo.label,
        icon: codeInfo.icon,
        windspeed: Math.round(liveData.current_weather.windspeed),
      };
    }

    // 3. Fetch Historical Weather on Travel Start Date
    let historicalWeather = null;
    if (startDateStr) {
      const dateObj = new Date(startDateStr);
      const formattedDate = dateObj.toISOString().split("T")[0];

      const histRes = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formattedDate}&end_date=${formattedDate}&daily=temperature_2m_max,weathercode&timezone=auto`
      );
      const histData = await histRes.json();

      if (histData.daily && histData.daily.temperature_2m_max?.[0] !== undefined) {
        const tempMax = Math.round(histData.daily.temperature_2m_max[0]);
        const weatherCode = histData.daily.weathercode?.[0] || 0;
        const codeInfo = getWeatherCodeInfo(weatherCode);

        historicalWeather = {
          temp: tempMax,
          condition: codeInfo.label,
          icon: codeInfo.icon,
          date: formattedDate,
        };
      }
    }

    return {
      cityName: name,
      countryName: country,
      live: liveWeather,
      historical: historicalWeather,
    };
  } catch (err) {
    console.error("Weather comparison fetch failed:", err);
    return null;
  }
};

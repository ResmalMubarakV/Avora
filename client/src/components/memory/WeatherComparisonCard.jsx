import { useState, useEffect } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Calendar,
  Radio,
  Wind,
  Loader2,
} from "lucide-react";
import { fetchMemoryWeatherComparison } from "../../utils/weatherApi";

// ==========================================
// REAL-TIME LIVE DESTINATION WEATHER CARD
// ==========================================
/**
 * Renders real-time live destination weather alongside historical travel date weather
 * inside the public memory details sidebar.
 */
const WeatherComparisonCard = ({ location, startDate, className = "" }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      if (!location) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await fetchMemoryWeatherComparison(location, startDate);
      if (isMounted) {
        setWeatherData(data);
        setLoading(false);
      }
    };

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [location, startDate]);

  if (loading) {
    return (
      <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 backdrop-blur-md ${className}`}>
        <Loader2 size={16} className="animate-spin text-[#3559D4] dark:text-indigo-400 shrink-0" />
        <span>Fetching live destination weather...</span>
      </div>
    );
  }

  if (!weatherData || (!weatherData.live && !weatherData.historical)) return null;

  const renderWeatherIcon = (iconType, size = 18) => {
    switch (iconType) {
      case "sun":
        return <Sun size={size} className="text-amber-500 dark:text-amber-400 shrink-0" />;
      case "sun-cloud":
        return <CloudSun size={size} className="text-amber-400 dark:text-amber-300 shrink-0" />;
      case "cloud":
        return <Cloud size={size} className="text-slate-400 dark:text-slate-400 shrink-0" />;
      case "rain":
        return <CloudRain size={size} className="text-blue-500 dark:text-sky-400 shrink-0" />;
      case "snow":
        return <CloudSnow size={size} className="text-cyan-400 dark:text-cyan-300 shrink-0" />;
      case "thunder":
        return <CloudLightning size={size} className="text-purple-500 dark:text-purple-400 shrink-0" />;
      default:
        return <Thermometer size={size} className="text-blue-500 dark:text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 shadow-sm space-y-3.5 transition-colors ${className}`}>
      
      {/* Live Destination Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
            <Radio size={14} className="animate-pulse" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Real-Time Weather
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-900/40 px-2 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE</span>
        </span>
      </div>

      {/* Primary Real-Time Live Weather Display */}
      {weatherData.live && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-100 dark:border-emerald-950/80 bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-sky-950/20 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/80">
              {renderWeatherIcon(weatherData.live.icon, 22)}
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {weatherData.live.temp}°C
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {weatherData.live.condition}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>📍 {weatherData.cityName || location}</span>
                {weatherData.live.windspeed !== undefined && (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Wind size={11} /> {weatherData.live.windspeed} km/h
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Historical Travel Date Weather Pill */}
      {weatherData.historical && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <Calendar size={13} className="text-blue-500 dark:text-indigo-400 shrink-0" />
            <span>On Travel Date:</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            {renderWeatherIcon(weatherData.historical.icon, 14)}
            <span>{weatherData.historical.temp}°C • {weatherData.historical.condition}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default WeatherComparisonCard;

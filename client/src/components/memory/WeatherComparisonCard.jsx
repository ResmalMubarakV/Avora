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
  Loader2,
} from "lucide-react";
import { fetchMemoryWeatherComparison } from "../../utils/weatherApi";

// ==========================================
// WEATHER COMPARISON CARD COMPONENT
// ==========================================
/**
 * Renders side-by-side weather pill badges comparing historical weather on the travel date
 * with the real-time live destination weather today.
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
      <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-3.5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
        <Loader2 size={14} className="animate-spin text-[#3559D4] dark:text-indigo-400" />
        <span>Fetching destination weather comparison...</span>
      </div>
    );
  }

  if (!weatherData || (!weatherData.live && !weatherData.historical)) return null;

  const renderWeatherIcon = (iconType) => {
    switch (iconType) {
      case "sun":
        return <Sun size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />;
      case "sun-cloud":
        return <CloudSun size={15} className="text-amber-400 dark:text-amber-300 shrink-0" />;
      case "cloud":
        return <Cloud size={15} className="text-slate-400 dark:text-slate-400 shrink-0" />;
      case "rain":
        return <CloudRain size={15} className="text-blue-500 dark:text-sky-400 shrink-0" />;
      case "snow":
        return <CloudSnow size={15} className="text-cyan-400 dark:text-cyan-300 shrink-0" />;
      case "thunder":
        return <CloudLightning size={15} className="text-purple-500 dark:text-purple-400 shrink-0" />;
      default:
        return <Thermometer size={15} className="text-blue-500 dark:text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 shadow-sm space-y-3 transition-colors ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
            <Thermometer size={14} />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Destination Weather Comparison
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
          {weatherData.cityName || location}
        </span>
      </div>

      {/* Side-by-side Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* 1. Historical Travel Weather Badge */}
        {weatherData.historical && (
          <div className="flex items-center justify-between rounded-xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/20 p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-blue-100 dark:border-slate-700">
                <Calendar size={14} className="text-blue-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  On Travel Date
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderWeatherIcon(weatherData.historical.icon)}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {weatherData.historical.temp}°C • {weatherData.historical.condition}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Live Current Weather Badge */}
        {weatherData.live && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-emerald-100 dark:border-slate-700">
                <Radio size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>Live Right Now</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderWeatherIcon(weatherData.live.icon)}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {weatherData.live.temp}°C • {weatherData.live.condition}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherComparisonCard;

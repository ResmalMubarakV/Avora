import { useState, useEffect } from "react";
import { WifiOff, Wifi, Sparkles } from "lucide-react";

/**
 * OfflineBanner Component
 * Detects network connectivity changes and displays an Apple-grade 
 * floating notification pill when the user goes offline.
 */
const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline && !showRestored) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {isOffline ? (
        <div className="flex items-center gap-3 rounded-full border border-amber-300/60 dark:border-amber-700/60 bg-amber-50/95 dark:bg-slate-900/95 px-5 py-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-[0_10px_30px_rgba(245,158,11,0.2)] backdrop-blur-xl">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
            <WifiOff size={14} className="animate-pulse" />
          </div>
          <p className="flex items-center gap-1.5">
            <span>⚡ Offline Mode Active</span>
            <span className="hidden sm:inline font-normal text-amber-700 dark:text-amber-400">• Drafts stored locally</span>
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-full border border-emerald-300/60 dark:border-emerald-700/60 bg-emerald-50/95 dark:bg-slate-900/95 px-5 py-2.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 shadow-[0_10px_30px_rgba(16,185,129,0.2)] backdrop-blur-xl">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
            <Wifi size={14} />
          </div>
          <p className="flex items-center gap-1.5">
            <span>Connection Restored</span>
            <Sparkles size={13} className="text-emerald-500" />
          </p>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;

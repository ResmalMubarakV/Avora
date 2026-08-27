import { useState, useMemo } from "react";
import {
  Compass,
  PhoneCall,
  Coins,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from "lucide-react";
import { getDestinationGuide } from "../../utils/destinationGuide";

// ==========================================
// DESTINATION CULTURAL ETIQUETTE & EMERGENCY GUIDE CARD
// ==========================================
/**
 * Displays local emergency numbers, tipping customs, plug types, and phrases
 * for any given location string with smooth collapsible expand/collapse behavior.
 */
const DestinationGuideCard = ({ location, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const guide = useMemo(() => getDestinationGuide(location), [location]);

  if (!guide || !location?.trim()) return null;

  return (
    <div
      className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-black/50 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Card Header & Toggle Trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-indigo-950/60 text-[#3559D4] dark:text-indigo-400 border border-blue-100 dark:border-indigo-900/50">
            <Compass size={20} className="animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3559D4] dark:text-indigo-400">
                Destination Survival Guide
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                <ShieldAlert size={10} /> Local Info
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {guide.country} • Etiquette & Emergency Info
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {isExpanded ? "Collapse" : "Explore Guide"}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expanded Guide Content Body */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-4 bg-slate-50/40 dark:bg-slate-950/40 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Emergency Numbers */}
            <div className="rounded-2xl border border-red-100 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                <PhoneCall size={15} />
                <span>Emergency Contact Numbers</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200 font-semibold pt-1 flex-wrap">
                {Object.entries(guide.emergency).map(([key, num]) => (
                  <span key={key} className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-red-200/60 dark:border-red-900/40 shadow-xs capitalize">
                    {key}: <strong className="text-red-700 dark:text-red-300">{num}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Electrical Plugs & Voltage */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Zap size={15} />
                <span>Power Outlets & Voltage</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 pt-1">
                {guide.plugs}
              </p>
            </div>

            {/* 3. Tipping Customs */}
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 space-y-1.5 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Coins size={15} />
                <span>Tipping Etiquette & Currency ({guide.currency})</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                {guide.tipping}
              </p>
            </div>

            {/* 4. Essential Local Phrases */}
            <div className="rounded-2xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/40 dark:bg-purple-950/20 p-3.5 space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                <MessageSquare size={15} />
                <span>Essential Local Phrases</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px]">Hello / Greeting</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{guide.phrases.hello}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px]">Thank You</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{guide.phrases.thankYou}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px]">Emergency Help</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{guide.phrases.help}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px]">Asking Directions</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{guide.phrases.whereIs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationGuideCard;

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, ChevronDown, Check } from "lucide-react";
import MemoryAIModal from "./MemoryAIModal";
import LocationAutocomplete from "../common/LocationAutocomplete";
import DestinationGuideCard from "../common/DestinationGuideCard";

const JourneyDetails = ({ formData, setFormData, handleChange }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTravelModeOpen, setIsTravelModeOpen] = useState(false);
  const dropdownRef = useRef(null);

  const travelModes = [
    "Car",
    "Bike",
    "Bus",
    "Train",
    "Flight",
    "Walk",
    "Cycle",
    "Boat",
    "Other",
  ];

  // Ensure selected modes are handled as an array
  const selectedModes = Array.isArray(formData.modeOfTravel)
    ? formData.modeOfTravel
    : formData.modeOfTravel
    ? [formData.modeOfTravel]
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTravelModeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldName === "modeOfTravel" ? [] : "",
    }));
  };

  const handleModeToggle = (mode) => {
    const updatedModes = selectedModes.includes(mode)
      ? selectedModes.filter((m) => m !== mode)
      : [...selectedModes, mode];

    // Propagate change matching standard event structure
    handleChange({
      target: {
        name: "modeOfTravel",
        value: updatedModes,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-3.5 sm:p-5 shadow-xs space-y-3.5 transition-colors">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Journey Details
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Tell the story behind your adventure.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Memory Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Ultimate Goa Beach Hopping Expedition"
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {formData.title && (
            <button
              type="button"
              onClick={() => handleClear("title")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <LocationAutocomplete
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          {formData.location && (
            <button
              type="button"
              onClick={() => handleClear("location")}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Destination Cultural Etiquette & Emergency Guide */}
      {formData.location && (
        <DestinationGuideCard location={formData.location} />
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
            />
            {formData.startDate && (
              <button
                type="button"
                onClick={() => handleClear("startDate")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
            />
            {formData.endDate && (
              <button
                type="button"
                onClick={() => handleClear("endDate")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode of Travel (Multi-select) */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Mode of Travel <span className="text-red-500">*</span>
        </label>
        
        <div
          onClick={() => setIsTravelModeOpen(!isTravelModeOpen)}
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 pr-14 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition focus-within:border-[#3559D4] dark:focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-indigo-950/50 cursor-pointer min-h-[38px] flex items-center flex-wrap gap-1.5"
        >
          {selectedModes.length === 0 ? (
            <span className="text-slate-400 dark:text-slate-500">Select Travel Mode(s)</span>
          ) : (
            selectedModes.map((mode) => (
              <span
                key={mode}
                className="inline-flex items-center gap-1 bg-blue-50 dark:bg-indigo-950/80 text-[#3559D4] dark:text-indigo-300 border border-blue-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-md text-[11px] font-medium"
              >
                {mode}
                <X
                  size={12}
                  className="hover:text-blue-900 dark:hover:text-indigo-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModeToggle(mode);
                  }}
                />
              </span>
            ))
          )}
        </div>

        {/* Clear & Toggle Icons */}
        <div className="absolute right-2.5 top-[30px] flex items-center gap-1 text-slate-400 dark:text-slate-500">
          {selectedModes.length > 0 && (
            <button
              type="button"
              onClick={() => handleClear("modeOfTravel")}
              className="hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isTravelModeOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Options */}
        {isTravelModeOpen && (
          <div className="absolute z-25 mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-1.5 max-h-56 overflow-y-auto">
            {travelModes.map((mode) => {
              const isSelected = selectedModes.includes(mode);
              return (
                <div
                  key={mode}
                  onClick={() => handleModeToggle(mode)}
                  className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm cursor-pointer transition ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-indigo-950/80 text-[#3559D4] dark:text-indigo-300 font-medium"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{mode}</span>
                  {isSelected && <Check size={14} className="text-[#3559D4] dark:text-indigo-400" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Story / Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Story <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-[#3559D4] dark:from-indigo-600 dark:to-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles size={12} className="animate-pulse text-blue-200" />
            <span>Magic Fill</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Share your full trip experience..."
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3 pr-8 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {formData.description && (
            <button
              type="button"
              onClick={() => handleClear("description")}
              className="absolute right-2.5 top-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <MemoryAIModal
        open={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={(generatedStory) => {
          setFormData((prev) => ({
            ...prev,
            description: generatedStory,
          }));
        }}
      />
    </div>
  );
};

export default JourneyDetails;
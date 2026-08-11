import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import MemoryAIModal from "./MemoryAIModal";
import LocationAutocomplete from "../common/LocationAutocomplete";

const JourneyDetails = ({ formData, setFormData, handleChange }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-xs space-y-3.5">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Journey Details
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500">
          Tell the story behind your adventure.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Memory Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Ultimate Goa Beach Hopping Expedition"
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
          />
          {formData.title && (
            <button
              type="button"
              onClick={() => handleClear("title")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
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
              className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {formData.startDate && (
              <button
                type="button"
                onClick={() => handleClear("startDate")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {formData.endDate && (
              <button
                type="button"
                onClick={() => handleClear("endDate")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode of Travel */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Mode of Travel <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="modeOfTravel"
            value={formData.modeOfTravel}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 pr-8 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100 appearance-none"
          >
            <option value="" disabled>Select Travel Mode</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Flight</option>
            <option value="Walk">Walk</option>
            <option value="Cycle">Cycle</option>
            <option value="Boat">Boat</option>
            <option value="Other">Other</option>
          </select>
          {formData.modeOfTravel && (
            <button
              type="button"
              onClick={() => handleClear("modeOfTravel")}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Story / Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-700">
            Story <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-[#3559D4] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition hover:scale-[1.02] cursor-pointer"
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
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 pr-8 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none placeholder:text-slate-400"
          />
          {formData.description && (
            <button
              type="button"
              onClick={() => handleClear("description")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition cursor-pointer"
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
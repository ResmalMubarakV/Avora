import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import MemoryAIModal from "./MemoryAIModal";
import LocationAutocomplete from "../common/LocationAutocomplete";

// ==========================================
// JOURNEY DETAILS FORM SECTION
// ==========================================
/**
 * Renders basic memory form inputs including title, location, travel dates, 
 * mode of travel, and story description. Features an embedded AI Magic Fill button 
 * directly above the story field for accurate context-aware narrative generation.
 */
const JourneyDetails = ({ formData, setFormData, handleChange }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Helper to clear specific fields
  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-8 shadow-sm space-y-5 sm:space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
          Journey Details
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
          Tell the story behind your adventure.
        </p>
      </div>

      {/* Title Field */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
          Memory Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Ultimate Goa Beach Hopping Expedition"
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
          />
          {formData.title && (
            <button
              type="button"
              onClick={() => handleClear("title")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              title="Clear title"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Location Field (Live Autocomplete) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
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
              className="absolute right-10 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              title="Clear location"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {formData.startDate && (
              <button
                type="button"
                onClick={() => handleClear("startDate")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
                title="Clear start date"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {formData.endDate && (
              <button
                type="button"
                onClick={() => handleClear("endDate")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
                title="Clear end date"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode of Travel Field */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
          Mode of Travel <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="modeOfTravel"
            value={formData.modeOfTravel}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none"
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
              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              title="Clear travel mode"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Story / Description Field with Embedded AI Magic Fill Button */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700">
            Story <span className="text-red-500">*</span>
          </label>

          {/* AI Magic Fill Trigger Button */}
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#3559D4] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
          >
            <Sparkles size={14} className="animate-pulse text-blue-200" />
            <span>Magic Fill Story</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Share your full Goa trip experience, beach hopping highlights, coastal drives, and unforgettable sunsets..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none placeholder:text-slate-400"
          />
          {formData.description && (
            <button
              type="button"
              onClick={() => handleClear("description")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              title="Clear story"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* AI Assistant Modal for Story Generation */}
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
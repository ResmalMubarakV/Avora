import {
  Globe,
  Lock,
} from "lucide-react";

// ==========================================
// VISIBILITY CARD COMPONENT
// ==========================================
/**
 * Renders a toggle card to configure the visibility (Public vs. Private) of a travel memory.
 * Features an interactive switch control, dynamic indicator icons, and detailed helper descriptions.
 */
const VisibilityCard = ({
  formData,
  setFormData,
}) => {
  // --- Toggle Public / Private State ---
  const toggleVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
  };

  // If formData.isPublic is undefined/null initially, treat it as true (Public by default)
  const isPublic = formData.isPublic ?? true;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-4">
          {/* Icon Container */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
              isPublic ? "bg-blue-100" : "bg-slate-100"
            }`}
          >
            {isPublic ? (
              <Globe size={22} className="text-[#3559D4]" />
            ) : (
              <Lock size={22} className="text-slate-500" />
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Visibility</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isPublic
                ? "Anyone can view this memory."
                : "Only you can view this memory."}
            </p>
          </div>
        </div>

        {/* Toggle Switch (Switches to Private when active) */}
        <button
          type="button"
          onClick={toggleVisibility}
          className={`relative h-8 w-14 rounded-full transition-all duration-300 cursor-pointer ${
            !isPublic ? "bg-slate-900" : "bg-slate-300"
          }`}
          title="Toggle Private Mode"
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              !isPublic ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Info Callout Box */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Globe size={18} className="text-[#3559D4]" />
          ) : (
            <Lock size={18} className="text-slate-500" />
          )}
          <span className="text-sm font-medium text-slate-700">
            {isPublic ? "Public Memory" : "Private Memory"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isPublic
            ? "Your memory will be visible on your public profile and can be shared with anyone."
            : "Your memory will remain completely private and visible only inside your dashboard."}
        </p>
      </div>
    </div>
  );
};

export default VisibilityCard;
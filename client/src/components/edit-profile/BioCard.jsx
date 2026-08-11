const MAX_LENGTH = 200;

// ==========================================
// BIO CARD COMPONENT (COMPACT)
// ==========================================
/**
 * Renders a compact user bio textarea card with character count tracking.
 */
const BioCard = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Bio
        </h2>
        <span className="text-[10px] font-medium text-slate-400">
          {formData.bio.length} / {MAX_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div>
        <textarea
          name="bio"
          rows={3}
          maxLength={MAX_LENGTH}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell travelers a little about yourself..."
          className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-xs sm:text-sm leading-5 outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

BioCard.displayName = "BioCard";
export default BioCard;
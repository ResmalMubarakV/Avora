import { Loader2 } from "lucide-react";

// ==========================================
// ACTION BUTTONS COMPONENT
// ==========================================
const ActionButtons = ({
  loading,
  onSubmit,
  onCancel,
  buttonText = "Publish Memory",
  loadingText = "Please wait...",
}) => {
  return (
    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center w-full">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onCancel) onCancel();
        }}
        disabled={loading}
        className="cursor-pointer w-full sm:flex-1 rounded-2xl border border-slate-200 py-3 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 text-center"
      >
        Cancel
      </button>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!loading && onSubmit) {
            onSubmit();
          }
        }}
        disabled={loading}
        className="flex cursor-pointer w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] py-3 font-semibold text-white shadow-lg shadow-[#1E3A8A]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 text-center"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {loadingText}
          </>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// ACTION BUTTONS COMPONENT
// ==========================================
/**
 * Renders form action buttons (Cancel and Save Changes) with responsive layout, 
 * loading states, and dynamic redirection back to the user's profile view.
 */
const ActionButtons = ({
  loading,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  // --- Handle Cancel Navigation (Fallback to Profile or Dashboard) ---
  const handleCancel = () => {
    const profilePath = user?.username ? `/${user.username}` : "/dashboard";
    navigate(profilePath);
  };

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleCancel}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50"
      >
        <X size={18} />
        Cancel
      </button>

      {/* Save Changes Button */}
      <button
        type="button"
        disabled={loading}
        onClick={onSubmit}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3559D4] px-7 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#2448BF] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ActionButtons;
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// ACTION BUTTONS COMPONENT
// ==========================================
/**
 * Renders form action buttons (Cancel and Save Changes) with a 50/50 equal-width split layout, 
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
    const profilePath = user?.username ? `/u/${user.username}` : "/dashboard";
    navigate(profilePath);
  };

  return (
    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center w-full">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleCancel}
        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 text-center"
      >
        <X size={18} />
        Cancel
      </button>

      {/* Save Changes Button */}
      <button
        type="button"
        disabled={loading}
        onClick={onSubmit}
        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3559D4] py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#2448BF] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 text-center"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ActionButtons;
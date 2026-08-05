import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// DASHBOARD HERO COMPONENT
// ==========================================
/**
 * Renders an executive dashboard hero section with a compact mobile layout 
 * and larger, premium typography scaled for desktop screens.
 */
const DashboardHero = () => {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Compact Title & Personalized Greeting */}
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-base font-medium text-slate-500">
            Welcome back, {loading ? "Traveler" : user?.name || "Traveler"} 👋
          </p>
        </div>

        {/* Desktop & Tablet New Memory Action Button */}
        <div className="hidden sm:flex">
          <button
            type="button"
            onClick={() => navigate("/dashboard/create-memory")}
            className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
          >
            <Plus
              size={16}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span>New Memory</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
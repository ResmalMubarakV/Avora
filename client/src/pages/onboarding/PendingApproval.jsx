import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import PendingHero from "../../components/public/hero/PendingHero";
import FeaturedTravelers from "../../components/public/featuredTravelers/FeaturedTravelers";
import LandingFooter from "../../components/landing/LandingFooter";
import Logo from "../../components/common/Logo";

// ==========================================
// PENDING APPROVAL PAGE COMPONENT (RESPONSIVE)
// ==========================================
const PendingApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Route Guard: Restrict direct URL access without registration state ---
  if (!location.state?.registrationSuccess) {
    return <Navigate to="/register" replace />;
  }

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Responsive Floating Top Header */}
      <header className="absolute top-0 left-0 right-0 z-40 mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-8">
        
        {/* Seamless Logo Alignment */}
        <div className="flex items-center">
          <Logo to="/login" size="sm" />
        </div>
        
        {/* Responsive Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 sm:px-5 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-800 hover:text-white hover:border-white/30 active:scale-95 cursor-pointer shadow-lg backdrop-blur-md"
        >
          <LogOut size={15} className="text-sky-400 shrink-0" />
          <span className="hidden xs:inline">Sign Out</span>
        </button>
      </header>

      {/* Pending Account Hero Section */}
      <PendingHero />

      {/* Featured Travelers Section */}
      <div className="relative border-t border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <FeaturedTravelers />
      </div>

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default PendingApproval;
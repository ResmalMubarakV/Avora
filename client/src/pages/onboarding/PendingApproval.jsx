import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import PendingHero from "../../components/public/hero/PendingHero";
import FeaturedTravelers from "../../components/public/featuredTravelers/FeaturedTravelers";
import LandingFooter from "../../components/landing/LandingFooter";
import Logo from "../../components/common/Logo";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// PENDING APPROVAL PAGE COMPONENT (RESPONSIVE)
// ==========================================
const PendingApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

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
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <PageTitle title="Account Approval Pending" />
      
      {/* Responsive Floating Top Header */}
      <header className="absolute top-0 left-0 right-0 z-40 mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        
        {/* Seamless Logo Alignment */}
        <div className="flex items-center">
          <Logo to="/login" size="sm" />
        </div>
        
        {/* Responsive Sign Out Button (Light Theme Premium) */}
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-5 py-2.5 text-xs font-bold text-[#1E3A8A] transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <LogOut size={16} className="text-[#3559D4] shrink-0" />
          <span className="hidden xs:inline">Sign Out</span>
        </button>
      </header>

      {/* Pending Account Hero Section */}
      <PendingHero />

      {/* Featured Travelers Section */}
      <div className="relative border-t border-slate-200/60 bg-slate-50">
        <FeaturedTravelers />
      </div>

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default PendingApproval;
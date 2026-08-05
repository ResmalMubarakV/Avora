import { Navigate, useLocation } from "react-router-dom";

import PendingHero from "../../components/public/hero/PendingHero";
import FeaturedTravelers from "../../components/public/featuredTravelers/FeaturedTravelers";
import LandingFooter from "../../components/landing/LandingFooter";

// ==========================================
// PENDING APPROVAL PAGE COMPONENT
// ==========================================
/**
 * Displayed to newly registered users awaiting administrative account approval.
 * Implements a route guard ensuring users arrive directly from a successful registration,
 * and showcases a hero section, featured travelers, and footer.
 */
const PendingApproval = () => {
  const location = useLocation();

  // --- Route Guard: Restrict direct URL access without registration state ---
  if (!location.state?.registrationSuccess) {
    return <Navigate to="/register" replace />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 via-slate-800 via-slate-700 via-slate-500 via-slate-300 to-slate-50">
      {/* Pending Account Hero Section */}
      <PendingHero />

      {/* Featured Travelers Section */}
      <FeaturedTravelers />

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default PendingApproval;
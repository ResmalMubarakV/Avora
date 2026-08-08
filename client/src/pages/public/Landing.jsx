import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingHero from "../../components/landing/LandingHero";
import LandingHighlights from "../../components/landing/LandingHighlights";
import WhyChooseAvora from "../../components/landing/WhyChooseAvora";
import LandingCTA from "../../components/landing/LandingCTA";
import LandingFooter from "../../components/landing/LandingFooter";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// LANDING PAGE COMPONENT
// ==========================================
/**
 * Renders the public-facing marketing landing page for Avora.
 * Showcases the platform's value proposition, key highlights, feature breakdowns, 
 * a call-to-action section, navigation bar, and footer.
 */
const Landing = () => {
  const navigate = useNavigate();

  // Guard: If the user is already authenticated, redirect them away from the landing page
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <>
      <PageTitle title="Travel Diary Platform" />
      {/* Top Navigation Bar */}
      <LandingNavbar />

      {/* Main Hero Section */}
      <LandingHero />

      {/* Highlights & Features Section */}
      <LandingHighlights />

      {/* Why Choose Avora Value Proposition Section */}
      <WhyChooseAvora />

      {/* Call to Action Banner */}
      <LandingCTA />

      {/* Page Footer */}
      <LandingFooter />
    </>
  );
};

export default Landing;
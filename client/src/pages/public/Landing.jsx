import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingHero from "../../components/landing/LandingHero";
import LandingHighlights from "../../components/landing/LandingHighlights";
import WhyChooseAvora from "../../components/landing/WhyChooseAvora";
import LandingCTA from "../../components/landing/LandingCTA";
import LandingFooter from "../../components/landing/LandingFooter";

// ==========================================
// LANDING PAGE COMPONENT
// ==========================================
/**
 * Renders the public-facing marketing landing page for Avora.
 * Showcases the platform's value proposition, key highlights, feature breakdowns, 
 * a call-to-action section, navigation bar, and footer.
 */
const Landing = () => {
  return (
    <>
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
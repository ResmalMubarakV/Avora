import { useNavigate, useLocation } from "react-router-dom";
import Landing from "./Landing";
import LegalModal from "../../components/common/LegalModal";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// DEDICATED LEGAL PAGE / ROUTE (/privacy & /terms)
// Auto-pops LegalModal overlay over Landing page for direct URL visitors
// ==========================================
const LegalPage = ({ defaultTab = "privacy" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active tab cleanly from location pathname
  const activeTab = location.pathname === "/terms" 
    ? "terms" 
    : location.pathname === "/privacy" 
      ? "privacy" 
      : defaultTab;

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <>
      <PageTitle title={activeTab === "privacy" ? "Privacy Policy | Avora" : "Terms & Conditions | Avora"} />
      
      {/* Background Landing View */}
      <Landing />

      {/* Auto-popping Lightbox Modal */}
      <LegalModal
        key={location.pathname}
        isOpen={true}
        onClose={handleClose}
        initialTab={activeTab}
      />
    </>
  );
};

export default LegalPage;

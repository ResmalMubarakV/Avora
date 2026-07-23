import { Navigate, useLocation } from "react-router-dom";

import PendingHero from "../../components/public/hero/PendingHero";
import FeaturedTravelers from "../../components/public/featuredTravelers/FeaturedTravelers";
import LandingFooter from "../../components/landing/LandingFooter";

const PendingApproval = () => {
    const location = useLocation();

    // Temporary route protection
    if (!location.state?.registrationSuccess) {
        return <Navigate to="/register" replace />;
    }

    return (
        <main
            className="
                min-h-screen
                overflow-x-hidden
                bg-gradient-to-b
                from-slate-950
                via-slate-900
                via-slate-800
                via-slate-700
                via-slate-500
                via-slate-300
                to-slate-50
            "
        >
            <PendingHero />

            <FeaturedTravelers />

            <LandingFooter />
        </main>
    );
};

export default PendingApproval;
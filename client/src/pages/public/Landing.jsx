import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingHero from "../../components/landing/LandingHero";
import LandingHighlights from "../../components/landing/LandingHighlights";
import WhyChooseAvora from "../../components/landing/WhyChooseAvora";
import LandingCTA from "../../components/landing/LandingCTA";
import LandingFooter from "../../components/landing/LandingFooter";

const Landing = () => {
    return (
        <>
            <LandingNavbar />
            <LandingHero />
            <LandingHighlights />
            <WhyChooseAvora />
            <LandingCTA />
            <LandingFooter />
        </>
    );
};

export default Landing;
import { Link } from "react-router-dom";

// ==========================================
// LANDING CTA COMPONENT
// ==========================================
/**
 * Renders a high-impact call-to-action banner section for the landing page.
 * Features a dark slate container, bold typography encouraging user registration, 
 * descriptive copy, and a primary signup button link.
 */
const LandingCTA = () => {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <div className="rounded-[28px] border border-slate-200 bg-slate-900 px-6 py-16 text-center text-white sm:px-10 sm:py-20 lg:rounded-[36px] lg:px-12 lg:py-24 shadow-2xl">
                {/* Heading */}
                <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    Ready To Preserve
                    <br />
                    Your Next Adventure?
                </h2>

                {/* Subtitle Description */}
                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                    Every destination has a story.
                    Capture your memories,
                    relive every journey and create
                    a travel diary you'll treasure forever.
                </p>

                {/* Registration Link Button */}
                <div className="mt-10">
                    <Link
                        to="/register"
                        className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
                    >
                        Create Your Free Diary
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LandingCTA;
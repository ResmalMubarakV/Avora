// ==========================================
// LANDING CTA COMPONENT (`client/src/pages/public/LandingCTA.jsx`)
// ==========================================
import { Link } from "react-router-dom";

const LandingCTA = () => {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24 w-full">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A1128] px-6 py-20 text-center sm:px-10 sm:py-24 lg:rounded-[3rem] lg:px-12 lg:py-32 2xl:py-36 shadow-[0_30px_80px_rgba(15,23,42,0.4)] border border-blue-900/30 w-full">
                
                {/* Immersive Deep Space Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#1E3A8A]/40 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#3559D4]/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Blueprint Grid Overlay for Premium Tech Feel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-3xl w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 text-xs font-semibold text-blue-200 mb-8">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Start Your Next Chapter
                    </div>

                    {/* Heading with 2xl ultra-wide tier scaling */}
                    <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl 2xl:text-7xl">
                        Ready To Preserve
                        <br />
                        Your Next Adventure?
                    </h2>

                    {/* Subtitle Description */}
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-blue-100/70 sm:text-lg">
                        Every destination has a story.
                        Capture your memories, relive every journey, and create
                        a beautifully crafted travel diary you'll treasure forever.
                    </p>

                    {/* Registration Link Button */}
                    <div className="mt-12 flex justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-[#0F172A] shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
                        >
                            Create Your Free Diary
                        </Link>
                    </div>
                    
                    {/* Subtle micro-copy */}
                    <p className="mt-6 text-xs text-blue-200/40 font-medium">
                        No credit card required. Setup in 60 seconds.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LandingCTA;
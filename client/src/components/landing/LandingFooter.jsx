import avoraLogo from "../../assets/images/avoraLogo.png";

// ==========================================
// LANDING FOOTER COMPONENT (CENTERED GRADIENT ELITE)
// ==========================================
const LandingFooter = () => {
    return (
        <footer className="relative overflow-hidden border-t border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/40 text-slate-700">
            {/* Ambient Background Glow Accent */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-1/2 bottom-0 h-40 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            {/* Main Footer Container */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:px-8 text-center">
                
                {/* Centered Content Stack */}
                <div className="flex flex-col items-center justify-center gap-6">
                    
                    {/* Brand Logo Container with Gradient Border Glow */}
                    <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200/80 inline-flex shadow-blue-500/5">
                        <img
                            src={avoraLogo}
                            alt="Avora Logo"
                            className="h-14 sm:h-16 w-auto object-contain"
                        />
                    </div>
                    
                    {/* Title & Tagline */}
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            Avora Travel Archives
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto">
                            Every adventure deserves a place to be remembered.
                        </p>
                    </div>

                    {/* Minimalist Status Badge with subtle gradient accent */}
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 px-4 py-1.5 rounded-full border border-blue-100 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Designed for global travel creators</span>
                    </div>

                </div>

                {/* Divider Line */}
                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Bottom Copyright Notice */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs font-semibold text-slate-900">
                    <p>© 2026 Avora. All rights reserved.</p>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <p className="font-medium text-slate-900">Secure Digital Travel Journaling Ecosystem</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
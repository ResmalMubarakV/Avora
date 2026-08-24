// ==========================================
// LANDING HERO COMPONENT (`client/src/pages/public/LandingHero.jsx`)
// ==========================================
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Image as ImageIcon, ShieldCheck, Calendar, PenTool } from "lucide-react";

const LandingHero = () => {
    return (
        <section className="relative overflow-hidden mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-5 py-12 md:flex-row md:items-center md:justify-between md:gap-10 md:px-8 md:py-16 lg:min-h-[calc(100vh-96px)] lg:py-0 w-full">
            
            {/* Background Ambient Glows (Strictly Blue/Slate/Indigo) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-32 -left-32 h-[35rem] w-[35rem] rounded-full bg-blue-200/30 blur-[150px] animate-pulse [animation-duration:8s]" />
                <div className="absolute top-1/2 right-0 h-[40rem] w-[40rem] rounded-full bg-indigo-100/30 blur-[150px] animate-pulse [animation-duration:10s]" />
                
                {/* Blueprint Grid Texture */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a05_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* Animated Flight Path Ray */}
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M-100,200 Q400,20 1000,300 T2200,150"
                        fill="none"
                        stroke="url(#heroFlightGradient)"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        className="animate-[dash_35s_linear_infinite]"
                    />
                    <defs>
                        <linearGradient id="heroFlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3559D4" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Left Content Column */}
            <div className="relative z-10 w-full text-center md:max-w-md md:text-left lg:max-w-xl">
                {/* Elite Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-[#1E3A8A] shadow-[0_10px_30px_rgba(30,58,138,0.08)] sm:text-sm">
                    <span className="h-2 w-2 rounded-full bg-[#1E3A8A] animate-ping" />
                    ✈️ Your Travel Memories, Forever
                </div>

                {/* Heading with Elite Navy Blue Gradient */}
                <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:mt-8 lg:text-6xl 2xl:text-7xl lg:leading-[1.08]">
                    Every Journey
                    <br />
                    Deserves To Be
                    <br />
                    <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] bg-clip-text text-transparent">
                        Remembered.
                    </span>
                </h1>

                {/* Subtitle Description */}
                <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:mx-0 lg:mt-6">
                    Preserve every trip with photos, videos, stories and
                    locations in one beautiful digital travel diary powered by AI.
                </p>

                {/* Action CTA Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start lg:mt-10">
                    <Link
                        to="/register"
                        className="rounded-full bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2541b2] px-7 py-3.5 text-center font-semibold text-white shadow-[0_15px_30px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-5px_rgba(30,58,138,0.4)] cursor-pointer"
                    >
                        Start Your Journey
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-full border border-slate-200 bg-white/80 backdrop-blur-md px-7 py-3.5 text-center font-semibold text-slate-900 shadow-[0_5px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] cursor-pointer"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* Right Side: Elite AI Travel Diary UI Cascade */}
            <div className="relative z-10 flex w-full justify-center md:flex-1 md:justify-end">
                <div className="relative w-full max-w-[460px] h-[440px] sm:h-[500px] flex items-center justify-center">
                    
                    {/* Background Stacked Card (Tilted) */}
                    <div className="absolute w-[280px] sm:w-[320px] h-[340px] sm:h-[380px] bg-blue-50/60 rounded-[2rem] border border-blue-100/50 rotate-6 translate-x-6 translate-y-4 shadow-lg backdrop-blur-sm transition-transform duration-700 hover:rotate-12" />
                    <div className="absolute w-[280px] sm:w-[320px] h-[340px] sm:h-[380px] bg-slate-50/80 rounded-[2rem] border border-slate-200/50 -rotate-3 -translate-x-4 -translate-y-2 shadow-xl backdrop-blur-md transition-transform duration-700 hover:-rotate-6" />

                    {/* Main Foreground Diary Entry Card */}
                    <div className="relative z-20 w-[300px] sm:w-[340px] rounded-[2rem] bg-white/95 backdrop-blur-2xl p-3 shadow-[0_40px_80px_-15px_rgba(30,58,138,0.25)] border border-white transition-transform duration-500 hover:-translate-y-2 group cursor-default">
                        
                        {/* High-Resolution Memory Cover */}
                        <div className="relative h-[220px] sm:h-[250px] w-full rounded-[1.5rem] overflow-hidden shadow-inner">
                            <img
                                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
                                alt="Santorini Memory"
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Subtle Inner Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/10" />
                            
                            {/* In-Image Location Tag */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 border border-white/30">
                                <MapPin className="h-3.5 w-3.5 text-white" />
                                <span className="text-xs font-semibold text-white drop-shadow-md">Santorini, Greece</span>
                            </div>
                        </div>

                        {/* Card Content Details */}
                        <div className="px-3 py-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
                                        Aegean Blue Summer
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Aug 12 - Aug 18</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mini Photo Stack inside card */}
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                <div className="flex -space-x-3">
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1601581975053-7680f4f9b8c0?auto=format&fit=crop&w=100&q=80" alt="pic1" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=100&q=80" alt="pic2" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=100&q=80" alt="pic3" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-[#1E3A8A] z-10">
                                        +42
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-slate-400">Photos Added</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Glassmorphic Badge 1: AI Story Generator */}
                    <div className="absolute top-6 -right-2 sm:-right-8 z-30 animate-[bounce_7s_ease-in-out_infinite] rounded-[1rem] bg-white/95 backdrop-blur-xl border border-white p-3 shadow-[0_20px_40px_-10px_rgba(30,58,138,0.15)] flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white shadow-inner">
                            <PenTool className="h-4 w-4" />
                        </div>
                        <div className="pr-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Avora AI</p>
                            <p className="text-xs font-extrabold bg-gradient-to-r from-[#0F172A] to-[#3559D4] bg-clip-text text-transparent flex items-center gap-1">
                                Crafting Journal <span className="flex gap-0.5 mt-1"><span className="h-1 w-1 bg-[#3559D4] rounded-full animate-ping"/><span className="h-1 w-1 bg-[#3559D4] rounded-full animate-ping delay-75"/><span className="h-1 w-1 bg-[#3559D4] rounded-full animate-ping delay-150"/></span>
                            </p>
                        </div>
                    </div>

                    {/* Floating Glassmorphic Badge 2: Secure Vault */}
                    <div className="absolute bottom-12 -left-4 sm:-left-10 z-30 animate-[bounce_8s_ease-in-out_infinite_1s] rounded-[1rem] bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700/80 p-3 shadow-[0_20px_40px_-10px_rgba(30,58,138,0.25)] flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="pr-2">
                            <p className="text-xs font-bold text-white">Encrypted Vault</p>
                            <p className="text-[10px] text-slate-400">100% Private</p>
                        </div>
                    </div>

                    {/* Floating Sparkle Decoration */}
                    <div className="absolute top-1/4 -left-6 z-30 animate-[pulse_3s_ease-in-out_infinite] bg-white rounded-full p-2 shadow-lg border border-slate-100">
                        <Sparkles className="h-4 w-4 text-amber-400 fill-amber-100" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LandingHero;
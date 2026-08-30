// ==========================================
// AUTH LAYOUT COMPONENT (`client/src/layouts/AuthLayout.jsx`)
// ==========================================
import { useState, useEffect } from 'react';
import { Plane, Camera, MapPin, ShieldCheck, Quote, Sparkles } from 'lucide-react';
import Logo from '../components/common/Logo';
import LegalModal from '../components/common/LegalModal';

const quotes = [
  { quote: "The best memories are collected along the way.", author: "Avora Traveler" },
  { quote: "Travel. Capture. Remember.", author: "Timeless Explorer" },
  { quote: "Every destination becomes a story worth preserving.", author: "Memory Vault" }
];

const AuthLayout = ({ children }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");

  const openLegal = (tab) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* ================= SEAMLESS BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

        {/* Ambient Radial Glows (Navy & Sky) */}
        <div className="absolute -top-40 -left-40 h-[50rem] w-[50rem] rounded-full bg-[#1E3A8A]/10 dark:bg-indigo-600/15 blur-[150px] animate-pulse [animation-duration:8s]" />
        <div className="absolute bottom-0 right-0 h-[45rem] w-[45rem] rounded-full bg-[#60A5FA]/15 dark:bg-blue-500/15 blur-[120px] animate-pulse [animation-duration:12s]" />
        
        {/* Architectural Blueprint Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a08_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#6366f10a_1px,transparent_1px),linear-gradient(to_bottom,#6366f10a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]" />

        {/* Animated Flight Path Ray crossing the entire screen */}
        <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-60" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-100,600 Q400,-100 1200,400 T2400,200"
            fill="none"
            stroke="url(#authFlightGradient)"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="animate-[dash_40s_linear_infinite]"
          />
          <defs>
            <linearGradient id="authFlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0" />
              <stop offset="40%" stopColor="#3559D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ================= CONTENT GRID ================= */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-12 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 xl:gap-24">
        
        {/* LEFT COLUMN: Narrative & Animated Floating UI */}
        <section className="hidden lg:flex w-[55%] flex-col justify-center pt-8">
          
          <div className="mb-12">
            <Logo to="/" size="md" />
          </div>

          <div className="relative w-full max-w-xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1E3A8A] dark:text-indigo-300 backdrop-blur-md shadow-[0_10px_30px_rgba(30,58,138,0.08)] dark:shadow-none mb-8">
              <Sparkles className="h-4 w-4 text-[#3559D4] dark:text-indigo-400" />
              Your Digital Travel Vault
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white xl:text-6xl mb-6">
              Every Journey Starts <br />
              With A <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] dark:from-white dark:via-indigo-200 dark:to-blue-400 bg-clip-text text-transparent">Memory.</span>
            </h1>

            <p className="mb-16 text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Preserve your adventures with beautiful timelines. Relive your favorite moments. Share your timeless stories seamlessly.
            </p>

            {/* Interactive Cinematic Composition */}
            <div className="relative h-64 w-full">
              
              {/* Central Glowing Orb */}
              <div className="absolute top-1/2 left-[40%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#3559D4]/20 to-[#60A5FA]/20 blur-2xl animate-pulse" />
              
              {/* Orbital Rings */}
              <div className="absolute top-1/2 left-[40%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-900/10 dark:border-slate-800 animate-[spin_30s_linear_infinite]" />
              <div className="absolute top-1/2 left-[40%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-900/5 dark:border-slate-800/80 animate-[spin_20s_linear_infinite_reverse]" />

              {/* Orbiting Glassmorphic Icons */}
              <div className="absolute inset-0">
                
                {/* Floating Jet */}
                <div className="absolute top-8 left-[60%] flex h-14 w-14 animate-[bounce_6s_ease-in-out_infinite] items-center justify-center rounded-2xl border border-white dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-[#3559D4] dark:text-indigo-400 backdrop-blur-xl shadow-xl">
                  <Plane className="h-6 w-6 rotate-45 transform drop-shadow-md" />
                </div>
                
                {/* Floating Map Pin */}
                <div className="absolute bottom-10 left-[15%] flex h-12 w-12 animate-[bounce_8s_ease-in-out_infinite_1s] items-center justify-center rounded-[1rem] border border-white dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-[#1E3A8A] dark:text-sky-400 backdrop-blur-xl shadow-xl">
                  <MapPin className="h-5 w-5 drop-shadow-sm" />
                </div>

                {/* Secure Vault Badge */}
                <div className="absolute top-1/2 -left-4 flex animate-[pulse_4s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50/90 dark:bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-emerald-500 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Encrypted Vault</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">100% Private</p>
                  </div>
                </div>

                {/* AI Timeline Badge */}
                <div className="absolute bottom-4 right-[10%] flex animate-[bounce_7s_ease-in-out_infinite_0.5s] items-center gap-3 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/90 dark:bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A] dark:bg-indigo-600 text-white shadow-md">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-[#1E3A8A] dark:text-indigo-300">Smart Timeline</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Auto-Organized</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elegant Rotating Quotes */}
            <div className="mt-12 border-t border-slate-200/60 dark:border-slate-800 pt-8 flex items-start gap-4">
              <Quote className="h-8 w-8 text-[#3559D4]/20 dark:text-indigo-400/20 rotate-180 shrink-0" />
              <div className="transition-opacity duration-700 ease-in-out">
                <p className="text-lg font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{quotes[currentQuote].quote}"
                </p>
                <p className="mt-2 text-xs font-bold tracking-wider text-[#3559D4] dark:text-indigo-400 uppercase">
                  — {quotes[currentQuote].author}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: The Auth Card */}
        <section className="relative w-full max-w-md lg:w-[45%] mx-auto">
          
          {/* Mobile Only Logo */}
          <div className="mb-10 flex w-full items-center justify-center lg:hidden">
            <Logo to="/" size="md" />
          </div>

          <div className="relative group">
            {/* Cinematic Outer Glow for the Card */}
            <div className="absolute -inset-1.5 rounded-[2.5rem] bg-gradient-to-r from-blue-200 via-indigo-200 to-sky-200 dark:from-indigo-600/30 dark:via-blue-600/30 dark:to-sky-600/30 opacity-60 dark:opacity-80 blur-xl transition duration-500 group-hover:opacity-100" />
            
            {/* Glassmorphic Form Container */}
            <div className="relative rounded-[2rem] border border-white dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-8 sm:p-10 shadow-[0_30px_70px_-15px_rgba(30,58,138,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-colors duration-300">
              {children}
            </div>
          </div>

          <footer className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">
              <button
                type="button"
                onClick={() => openLegal("privacy")}
                className="hover:text-blue-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal("terms")}
                className="hover:text-blue-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>
            <p className="text-[11px] font-medium text-slate-400/80 dark:text-slate-600">
              Avora Global Travel Platform &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </section>

      </div>

      {/* Legal Lightbox Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </main>
  );
};

export default AuthLayout;
import {
  Plane,
  Plus,
  Camera,
  Video,
  MapPin,
  Sparkles,
  Compass,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// EMPTY DASHBOARD COMPONENT (COMPACT ELITE)
// ==========================================
/**
 * Renders a streamlined, modern empty state banner for users with no travel memories.
 * Features a balanced, compact footprint with clean glassmorphism and subtle animations.
 */
const EmptyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden w-full max-w-5xl mx-auto rounded-[28px] bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2541b2] p-6 sm:p-10 lg:p-12 shadow-[0_15px_40px_-10px_rgba(30,58,138,0.2)] border border-blue-400/20 text-white my-4">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-400/15 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-400/15 blur-[80px] pointer-events-none" />
      
      {/* Blueprint Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Content & Action (7 Cols) */}
        <div className="lg:col-span-8 text-center lg:text-left">
          
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-200 shadow-sm mb-4">
            <Sparkles size={13} className="text-blue-400 animate-pulse" />
            Welcome to Avora
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Your journey begins
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-100 to-white">
              with a single memory.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 text-xs sm:text-sm lg:text-base text-blue-100/80 max-w-lg leading-relaxed font-medium">
            Every unforgettable adventure deserves a secure place to live. Capture your global explorations with rich photos, cinematic videos, and personal stories.
          </p>

          {/* CTA Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/create-memory")}
              className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3 text-xs sm:text-sm font-extrabold text-[#1E3A8A] shadow-[0_8px_25px_-4px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 active:scale-95"
            >
              <Plus size={16} />
              Start Your First Memory
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-blue-200 backdrop-blur-md">
              <Camera size={13} className="text-blue-400" />
              <span>Photos</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-blue-200 backdrop-blur-md">
              <Video size={13} className="text-blue-400" />
              <span>Videos</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-blue-200 backdrop-blur-md">
              <MapPin size={13} className="text-blue-400" />
              <span>Locations</span>
            </div>
          </div>

        </div>

        {/* Right Column: Compact Orbit Artwork (4 Cols - Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-4 items-center justify-center relative min-h-[260px]">
          
          {/* Outer Decorative Ring */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-white/10 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-white/15 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Center Glass Sphere */}
          <div className="relative z-25 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-xl animate-[bounce_4s_ease-in-out_infinite]">
            <Plane size={40} className="text-white -rotate-45 drop-shadow-md" />
          </div>

          {/* Floating Orbit Node 1: Globe */}
          <div className="absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-md animate-[float_6s_ease-in-out_infinite]">
            <Globe2 size={18} className="text-blue-300" />
          </div>

          {/* Floating Orbit Node 2: Compass */}
          <div className="absolute bottom-4 right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-md animate-[float_7s_ease-in-out_infinite]">
            <Compass size={18} className="text-sky-300" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmptyDashboard;
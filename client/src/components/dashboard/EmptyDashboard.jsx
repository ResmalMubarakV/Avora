import {
  Plane,
  Plus,
  Camera,
  Video,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==========================================
// EMPTY DASHBOARD COMPONENT
// ==========================================
/**
 * Renders an engaging call-to-action hero banner for users who have not yet 
 * documented any travel memories. Features animated glassmorphism decorations, 
 * capability badges, and a direct button to start creating a new memory.
 */
const EmptyDashboard = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-170px)] flex items-center">
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto rounded-[36px] bg-gradient-to-br from-[#16213E] via-[#1E3A8A] to-[#2F5BEA] shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
        {/* Background Blur Glow Effects */}
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-40 w-[28rem] h-[28rem] rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center px-8 py-14 sm:px-12 lg:px-20 lg:py-24">
          {/* Left Column: Welcome Content & Call to Action */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-blue-100 shadow-sm">
              <Sparkles size={16} />
              Welcome to Avora
            </div>

            {/* Heading */}
            <h1 className="mt-8 max-w-md text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white">
              Create your
              <br />
              first memory.
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100">
              Every unforgettable journey deserves a place to live. Capture your
              adventures with photos, videos, locations and stories, then revisit
              every destination whenever you want.
            </p>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => navigate("/dashboard/create-memory")}
              className="mt-10 inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-[#1E3A8A] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-2xl active:scale-95"
            >
              <Plus size={20} />
              Start Your Journey
            </button>

            {/* Feature Pills */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-blue-100 backdrop-blur-md">
                <Camera size={17} />
                Photos
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-blue-100 backdrop-blur-md">
                <Video size={17} />
                Videos
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-blue-100 backdrop-blur-md">
                <MapPin size={17} />
                Stories
              </div>
            </div>
          </div>

          {/* Right Column: Decorative Floating Elements (Desktop Only) */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[520px]">
            {/* Decorative Orbit Rings */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute w-[220px] h-[220px] rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] rounded-full border border-white/10 pointer-events-none" />

            {/* Center Floating Icon Badge */}
            <div className="relative z-20 w-40 h-40 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl animate-[float_6s_ease-in-out_infinite]">
              <Plane
                size={88}
                strokeWidth={2}
                className="text-white -rotate-45"
              />
            </div>

            {/* Floating Globe */}
            <div className="absolute right-6 bottom-16 text-7xl animate-[float_7s_ease-in-out_infinite]">
              🌍
            </div>

            {/* Floating Location Pin */}
            <div className="absolute top-14 left-16 w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center animate-[float_5s_ease-in-out_infinite]">
              <MapPin size={24} className="text-white" />
            </div>

            {/* Floating Camera Badge */}
            <div className="absolute bottom-12 left-24 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center animate-[float_8s_ease-in-out_infinite]">
              <Camera size={20} className="text-white" />
            </div>

            {/* Floating Video Badge */}
            <div className="absolute top-24 right-24 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center animate-[float_9s_ease-in-out_infinite]">
              <Video size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmptyDashboard;
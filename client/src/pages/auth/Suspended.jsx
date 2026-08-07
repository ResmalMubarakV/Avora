import { Mail, LogOut, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import avoraLogo from "../../assets/images/avoraLogo.png";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// SUSPENDED ACCOUNT PAGE COMPONENT
// ==========================================
/**
 * Displayed when an authenticated user's account has been temporarily suspended.
 * Matches Avora's signature glassmorphism UI with ambient background glows.
 */
const Suspended = () => {
  const navigate = useNavigate();

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 overflow-hidden animate-in fade-in duration-500">
      <PageTitle title="Account Suspended" />

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-400/10 blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(30,58,138,0.06)]">
        
        {/* Icon & Logo Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-red-600 shadow-inner">
            <ShieldAlert size={28} />
          </div>
          <img
            src={avoraLogo}
            alt="Avora"
            className="h-14 w-auto select-none"
            draggable={false}
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Account Suspended
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Temporary access restriction
          </p>
        </div>

        {/* Description Section */}
        <div className="space-y-4 text-center text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 shadow-inner">
          <p>
            Your Avora account has been temporarily suspended due to a security review or policy notice.
          </p>
          <p>
            If you believe this action was taken by mistake, please contact support and we will review your case.
          </p>
        </div>

        {/* Contact Support Button */}
        <a
          href="mailto:resmalmubarak2002@gmail.com?subject=Account%20Suspension%20Review%20Request"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 py-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_25px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 hover:bg-[#3559D4] active:scale-95 cursor-pointer"
        >
          <Mail size={18} />
          Contact Support
        </a>

        {/* Logout Action */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 transition-colors duration-200 hover:text-slate-900 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out & Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suspended;
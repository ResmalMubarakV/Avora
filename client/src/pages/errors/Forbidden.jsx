import { Plane, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import avoraLogo from "../../assets/images/avoraLogo.png";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// 404 NOT FOUND PAGE COMPONENT
// ==========================================
/**
 * Displayed when a user navigates to a non-existent URL route. 
 * Features a single smart "Go Back" button that routes users and viewers to their previous history stack or fallback.
 */
const NotFound = ({ isViewer = false, profileUsername = null }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      if (isViewer) {
        if (profileUsername) {
          navigate(`/${profileUsername}`);
        } else {
          navigate("/");
        }
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-10">
      <PageTitle title="404 Page Not Found" />

      {/* Background Decorative Blurs */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-30" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-30" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        {/* Animated Flight Route Illustration */}
        <div className="mb-8 flex justify-center">
          <svg
            width="260"
            height="90"
            viewBox="0 0 260 90"
            className="overflow-visible"
          >
            <path
              d="M20 70 C70 0 180 0 235 60"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <g className="plane-animation">
              <Plane size={22} color="#1E3A8A" x="10" y="58" />
            </g>
            <foreignObject x="228" y="48" width="28" height="28">
              <MapPin size={22} className="text-[#1E3A8A]" />
            </foreignObject>
          </svg>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={avoraLogo}
            alt="Avora"
            className="h-20 w-auto"
            draggable={false}
          />
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-slate-900">
          This destination doesn't exist.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-md text-center leading-8 text-slate-600">
          The page you're looking for may have been moved, renamed, or never existed.
          <br />
          <br />
          Let's get you back on your journey.
        </p>

        {/* Single Navigation Action Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleGoBack}
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#16213E] hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-md"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
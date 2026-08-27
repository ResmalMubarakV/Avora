import { Link } from "react-router-dom";
import avoraLogo from "../../assets/images/avoraLogo.png";
import avoraLogoDark from "../../assets/images/avoraLogoDark.png";

// ==========================================
// UNIFORM LOGO COMPONENT
// ==========================================
/**
 * Renders the Avora brand logo with configurable size variants (sm, md, lg) 
 * and optional navigation link destination. Guarantees 100% identical size matching
 * between Light and Dark mode logo variants.
 */
const Logo = ({ to = "/", size = "md", className = "" }) => {
  // Size configuration map
  const sizes = {
    sm: {
      box: "h-8 w-8 sm:h-9 sm:w-9",
      text: "text-lg sm:text-xl tracking-[0.14em]",
      gap: "gap-2",
    },
    md: {
      box: "h-10 w-10 sm:h-12 sm:w-12",
      text: "text-xl sm:text-2xl lg:text-3xl tracking-[0.15em]",
      gap: "gap-2.5",
    },
    lg: {
      box: "h-11 w-11 sm:h-13 sm:w-13",
      text: "text-2xl sm:text-3xl lg:text-4xl tracking-[0.16em]",
      gap: "gap-3",
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <Link
      to={to}
      className={`inline-flex items-center ${current.gap} shrink-0 select-none ${className}`}
    >
      {/* Brand Icon Image Container - Fixed Aspect Box for Identical Light/Dark Sizing */}
      <div className={`relative flex items-center justify-center shrink-0 ${current.box}`}>
        {/* Light Mode Logo */}
        <img
          src={avoraLogo}
          alt="Avora Logo"
          className="h-full w-full object-contain select-none dark:hidden"
          draggable={false}
        />

        {/* Dark Mode Logo */}
        <img
          src={avoraLogoDark}
          alt="Avora Logo Dark"
          className="h-full w-full object-contain select-none hidden dark:block"
          draggable={false}
        />
      </div>

      {/* Brand Title Text */}
      <span
        className={`
          font-extrabold
          uppercase
          tracking-wider
          text-slate-900
          dark:text-white
          ${current.text}
          transition-colors
          duration-300
        `}
      >
        AVORA
      </span>
    </Link>
  );
};

export default Logo;
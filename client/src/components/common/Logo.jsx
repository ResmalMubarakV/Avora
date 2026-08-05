import { Link } from "react-router-dom";
import avoraLogo from "../../assets/images/avoraLogo.png";

// ==========================================
// LOGO COMPONENT
// ==========================================
/**
 * Renders the Avora brand logo with configurable size variants (sm, md, lg) 
 * and an optional navigation link destination.
 */
const Logo = ({ to = "/", size = "md" }) => {
  // Size configuration map
  const sizes = {
    sm: {
      image: "h-10",
      text: "text-2xl tracking-[0.14em]",
      gap: "gap-2",
    },
    md: {
      image: "h-14",
      text: "text-[36px] tracking-[0.15em]",
      gap: "gap-3",
    },
    lg: {
      image: "h-16",
      text: "text-[42px] tracking-[0.16em]",
      gap: "gap-3",
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <Link
      to={to}
      className={`flex items-center ${current.gap}`}
    >
      {/* Brand Mark Icon */}
      <img
        src={avoraLogo}
        alt="Avora Logo"
        className={`${current.image} w-auto select-none`}
        draggable={false}
      />

      {/* Brand Title */}
      <span
        className={`
          font-light
          uppercase
          text-slate-900
          ${current.text}
        `}
      >
        AVORA
      </span>
    </Link>
  );
};

export default Logo;
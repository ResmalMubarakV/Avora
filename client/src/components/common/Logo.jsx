import { Link } from "react-router-dom";
import avoraLogo from "../../assets/images/avoraLogo.png";
import avoraLogoDark from "../../assets/images/avoraLogoDark.png";

// ==========================================
// LOGO COMPONENT
// ==========================================
/**
 * Renders the Avora brand logo with configurable size variants (sm, md, lg) 
 * and an optional navigation link destination. Supports Dark Mode logo switching.
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
      {/* Brand Mark Icon - Light Mode */}
      <img
        src={avoraLogo}
        alt="Avora Logo"
        className={`${current.image} w-auto select-none dark:hidden`}
        draggable={false}
      />

      {/* Brand Mark Icon - Dark Mode */}
      <img
        src={avoraLogoDark}
        alt="Avora Logo Dark"
        className={`${current.image} w-auto select-none hidden dark:block`}
        draggable={false}
      />

      {/* Brand Title */}
      <span
        className={`
          font-light
          uppercase
          text-slate-900
          dark:text-white
          ${current.text}
        `}
      >
        AVORA
      </span>
    </Link>
  );
};

export default Logo;
import { useId } from "react";

// ==========================================
// AVORA AI SIGNATURE ICON (BESPOKE VECTOR SYSTEM)
// ==========================================
/**
 * Custom Avora AI brand icon replacing universal sparkles/bot icons.
 * Features:
 *  - 4-point faceted Navigational Horizon Star (North Star of Travel)
 *  - Dynamic Orbital Flight Trajectory Arc (Avora's signature flight path)
 *  - Radiant Neural Prism Core
 *  - Micro Constellation Sparks
 * 
 * Props:
 *  - size: number | string (default: 24)
 *  - className: string
 *  - variant: 'gradient' | 'current' | 'glow' | 'accent' | 'monochrome' (default: 'gradient')
 *  - animated: boolean (default: false)
 */
const AvoraAIIcon = ({
  size = 24,
  className = "",
  variant = "gradient",
  animated = false,
  ...props
}) => {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, "");

  const isCurrent = variant === "current" || variant === "monochrome";
  const isGlow = variant === "glow";
  const isAccent = variant === "accent";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${animated ? "animate-pulse" : ""} ${className}`}
      {...props}
    >
      <defs>
        {/* Core Star Gradient (Electric Sapphire -> Luminous Indigo -> Cyber Cyan) */}
        <linearGradient
          id={`starGrad-${id}`}
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          {isAccent ? (
            <>
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#3559D4" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </>
          )}
        </linearGradient>

        {/* Orbital Flight Trail Gradient (Golden Amber -> Radiant Cyan/Indigo) */}
        <linearGradient
          id={`orbitGrad-${id}`}
          x1="3"
          y1="18"
          x2="22"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="45%" stopColor="#FBBF24" />
          <stop offset="75%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Radiant Inner Glow Gradient */}
        <radialGradient
          id={`coreGlow-${id}`}
          cx="12"
          cy="12"
          r="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#60A5FA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>

        {/* Ambient Glow Filter for 'glow' variant */}
        {isGlow && (
          <filter id={`filterGlow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Optional Ambient Glow Backdrop */}
      {isGlow && (
        <circle
          cx="12"
          cy="12"
          r="9"
          fill={`url(#coreGlow-${id})`}
          opacity="0.5"
          className="dark:opacity-75"
        />
      )}

      {/* Layer 1: Orbital Flight Trajectory Arc (Avora Signature Flight Trail) */}
      <path
        d="M 3.8 16.8 C 2.6 12.5 6.2 6.8 13.2 5.2 C 18.2 4.1 21.2 6.5 21.6 9.8 C 22.0 14.2 16.8 18.8 9.5 18.8 C 6.5 18.8 4.6 17.9 3.8 16.8 Z"
        fill="none"
        stroke={isCurrent ? "currentColor" : `url(#orbitGrad-${id})`}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeDasharray="24 4"
        className="opacity-90"
      />

      {/* Supersonic Flight Spark / Delta Arrowhead at Orbit Apex */}
      <path
        d="M 21.5 6.2 L 22.8 8.8 L 19.8 9.2 Z"
        fill={isCurrent ? "currentColor" : "#F59E0B"}
        className="opacity-95"
      />

      {/* Layer 2: Faceted Guiding Horizon Star (North Star of Travel) */}
      <path
        d="M 12 2.2 C 12 7.2 16.2 11.5 21.5 12 C 16.2 12.5 12 16.8 12 21.8 C 12 16.8 7.8 12.5 2.5 12 C 7.8 11.5 12 7.2 12 2.2 Z"
        fill={isCurrent ? "currentColor" : `url(#starGrad-${id})`}
        filter={isGlow ? `url(#filterGlow-${id})` : undefined}
      />

      {/* Layer 3: Inner Secondary Facet Diamond (Dimensional Prismatic Depth) */}
      <path
        d="M 12 6.8 C 12.4 9.5 14.5 11.6 17.2 12 C 14.5 12.4 12.4 14.5 12 17.2 C 11.6 14.5 9.5 12.4 6.8 12 C 9.5 11.6 11.6 9.5 12 6.8 Z"
        fill={isCurrent ? "currentColor" : "#FFFFFF"}
        fillOpacity={isCurrent ? 0.3 : 0.45}
      />

      {/* Layer 4: Radiant Neural Prism Nucleus */}
      <circle
        cx="12"
        cy="12"
        r="1.8"
        fill={isCurrent ? "currentColor" : "#FFFFFF"}
        className="drop-shadow-xs"
      />

      {/* Layer 5: Micro Constellation Sparks (Memories in the Sky) */}
      {/* Top-Left Constellation Node */}
      <path
        d="M 4.5 4.2 C 4.5 5.2 5.2 5.8 6.2 5.8 C 5.2 5.8 4.5 6.5 4.5 7.5 C 4.5 6.5 3.8 5.8 2.8 5.8 C 3.8 5.8 4.5 5.2 4.5 4.2 Z"
        fill={isCurrent ? "currentColor" : "#38BDF8"}
        className="opacity-80"
      />

      {/* Bottom-Right Constellation Node */}
      <path
        d="M 19.5 16.2 C 19.5 17.0 20.0 17.5 20.8 17.5 C 20.0 17.5 19.5 18.0 19.5 18.8 C 19.5 18.0 19.0 17.5 18.2 17.5 C 19.0 17.5 19.5 17.0 19.5 16.2 Z"
        fill={isCurrent ? "currentColor" : "#F59E0B"}
        className="opacity-80"
      />
    </svg>
  );
};

export default AvoraAIIcon;

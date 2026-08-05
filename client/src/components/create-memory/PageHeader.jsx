// ==========================================
// PAGE HEADER COMPONENT
// ==========================================
/**
 * Renders a standardized page header with a bold title and descriptive subtitle 
 * optimized with responsive text scaling for mobile, tablet, and desktop.
 */
const PageHeader = ({
  title = "Create Memory",
  subtitle = "Capture your journey with photos, videos and stories.",
}) => {
  return (
    <div className="mb-2 sm:mb-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-1 text-xs sm:text-sm lg:text-base text-slate-500">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
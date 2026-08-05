// ==========================================
// PRIMARY BUTTON COMPONENT
// ==========================================
/**
 * Renders a customizable primary action button supporting loading state text substitution, 
 * focus rings, active scaling animation, disabled opacity states, and custom class overrides.
 */
const PrimaryButton = ({
    children,
    type = "submit",
    onClick,
    disabled = false,
    loading = false,
    className = "",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-slate-700
                px-4
                py-3.5
                text-base
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-slate-900
                hover:shadow-lg
                cursor-pointer
                focus:outline-none
                focus:ring-4
                focus:ring-blue-200
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${className}
            `}
        >
            {loading ? "Please wait..." : children}
        </button>
    );
};

export default PrimaryButton;
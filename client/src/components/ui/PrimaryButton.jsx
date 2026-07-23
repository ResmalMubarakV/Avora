const PrimaryButton = ({
    children,
    type = "button",
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
                flex w-full items-center justify-center
                rounded-xl
                bg-blue-600
                px-4 py-3.5
                text-base font-semibold
                text-white
                transition-all duration-300
                hover:bg-blue-700
                hover:shadow-lg
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
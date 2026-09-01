import { X } from "lucide-react";

// ==========================================
// INPUT FIELD COMPONENT
// ==========================================
/**
 * Renders a reusable form input field wrapper featuring an optional icon label, 
 * focus rings, validation error messaging, and an interactive clear (cross) button 
 * when text is present.
 */
const InputField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    required = false,
    disabled = false,
    error = "",
    name,
}) => {
    // --- Handle Clearing Input Value ---
    const handleClear = () => {
        const syntheticEvent = {
            target: {
                name: name || "",
                value: "",
            },
        };
        onChange(syntheticEvent);
    };

    return (
        <div className="space-y-1.5">
            {/* Field Label */}
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                </label>
            )}

            {/* Input Box Container */}
            <div
                className={`
                    flex
                    items-center
                    rounded-2xl
                    border
                    bg-white
                    dark:bg-slate-800/50
                    px-4
                    py-2.5
                    transition-all
                    duration-300
                    ${
                        error
                            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 dark:focus-within:ring-red-950/50"
                            : "border-slate-300 dark:border-slate-700 focus-within:border-blue-500 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-indigo-950/50"
                    }
                    ${disabled ? "bg-slate-50 dark:bg-slate-800 opacity-60 cursor-not-allowed" : ""}
                `}
            >
                {/* Leading Icon */}
                {icon && (
                    <span className="mr-3 text-slate-400 dark:text-slate-400 shrink-0">
                        {icon}
                    </span>
                )}

                {/* Core HTML Input */}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    name={name}
                    className="
                        w-full
                        bg-transparent
                        text-[15px]
                        leading-6
                        text-slate-700
                        dark:text-slate-100
                        placeholder:text-slate-400
                        dark:placeholder:text-slate-500
                        outline-none
                        disabled:cursor-not-allowed
                    "
                />

                {/* Clear (Cross) Action Button */}
                {!disabled && value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear input"
                        className="
                            ml-2
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            dark:text-slate-400
                            transition
                            cursor-pointer
                            hover:bg-slate-100
                            dark:hover:bg-slate-700
                            hover:text-slate-700
                            dark:hover:text-slate-200
                        "
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Validation Error Text */}
            {error && (
                <p className="text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
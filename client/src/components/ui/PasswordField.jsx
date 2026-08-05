import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { X } from "lucide-react";

// ==========================================
// PASSWORD FIELD COMPONENT
// ==========================================
/**
 * Renders a secure password form input field featuring lock icons, 
 * show/hide password visibility toggles, clear query buttons, 
 * validation error messaging, and focus ring animations.
 */
const PasswordField = ({
    label = "Password",
    placeholder = "Enter your password",
    value,
    onChange,
    required = false,
    disabled = false,
    error = "",
    name = "password",
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // --- Handle Clearing Password Value ---
    const handleClear = () => {
        const syntheticEvent = {
            target: {
                name: name,
                value: "",
            },
        };
        onChange(syntheticEvent);
    };

    return (
        <div className="space-y-1.5">
            {/* Field Label */}
            {label && (
                <label className="block text-sm font-semibold text-slate-700">
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
                    px-4
                    py-2.5
                    transition-all
                    duration-300
                    ${
                        error
                            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100"
                            : "border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
                    }
                    ${disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : ""}
                `}
            >
                {/* Leading Lock Icon */}
                <FiLock
                    className="mr-3 shrink-0 text-slate-400"
                    size={20}
                />

                {/* Core Password HTML Input */}
                <input
                    type={showPassword ? "text" : "password"}
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
                        placeholder:text-slate-400
                        outline-none
                        disabled:cursor-not-allowed
                    "
                />

                {/* Clear (Cross) Action Button */}
                {!disabled && value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear password"
                        className="
                            mx-2
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition
                            cursor-pointer
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X size={14} />
                    </button>
                )}

                {/* Password Visibility Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="
                        ml-1
                        text-slate-400
                        transition-colors
                        duration-200
                        cursor-pointer
                        hover:text-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {showPassword ? (
                        <FiEyeOff size={20} />
                    ) : (
                        <FiEye size={20} />
                    )}
                </button>
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

export default PasswordField;
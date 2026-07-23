import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

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

    return (
        <div className="space-y-1.5">

            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <div
                className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2.5
                    transition-all
                    duration-300
                    focus-within:border-blue-500
                    focus-within:ring-4
                    focus-within:ring-blue-100
                "
            >
                <FiLock
                    className="mr-3 flex-shrink-0 text-slate-400"
                    size={20}
                />

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
                        disabled:opacity-60
                    "
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    className="
                        ml-3
                        text-slate-400
                        transition-colors
                        duration-200
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

            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};

export default PasswordField;
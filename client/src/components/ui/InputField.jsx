import React from "react";

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
                {icon && (
                    <span className="mr-3 text-slate-400 flex-shrink-0">
                        {icon}
                    </span>
                )}

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
                        placeholder:text-slate-400
                        outline-none
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                />
            </div>

            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};

export default InputField;
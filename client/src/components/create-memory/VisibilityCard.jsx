import {
    Globe,
    Lock,
} from "lucide-react";

const VisibilityCard = ({
    formData,
    setFormData,
}) => {

    const toggleVisibility = () => {

        setFormData((prev) => ({
            ...prev,
            isPublic: !prev.isPublic,
        }));

    };

    return (

        <div
            className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >

            <div className="flex items-start justify-between gap-6">

                <div className="flex gap-4">

                    <div
                        className={`
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            transition

                            ${
                                formData.isPublic
                                    ? "bg-blue-100"
                                    : "bg-slate-100"
                            }
                        `}
                    >

                        {formData.isPublic ? (

                            <Globe
                                size={22}
                                className="text-[#3559D4]"
                            />

                        ) : (

                            <Lock
                                size={22}
                                className="text-slate-500"
                            />

                        )}

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Visibility
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            {formData.isPublic
                                ? "Anyone can view this memory."
                                : "Only you can view this memory."
                            }

                        </p>

                    </div>

                </div>

                {/* Toggle */}

                <button
                    type="button"
                    onClick={toggleVisibility}
                    className={`
                        relative
                        h-8
                        w-14
                        rounded-full
                        transition-all
                        duration-300

                        ${
                            formData.isPublic
                                ? "bg-[#3559D4]"
                                : "bg-slate-300"
                        }
                    `}
                >

                    <span
                        className={`
                            absolute
                            top-1
                            h-6
                            w-6
                            rounded-full
                            bg-white
                            shadow-md
                            transition-all
                            duration-300

                            ${
                                formData.isPublic
                                    ? "left-7"
                                    : "left-1"
                            }
                        `}
                    />

                </button>

            </div>

            <div
                className="
                    mt-8
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                "
            >

                <div className="flex items-center gap-3">

                    {formData.isPublic ? (

                        <Globe
                            size={18}
                            className="text-[#3559D4]"
                        />

                    ) : (

                        <Lock
                            size={18}
                            className="text-slate-500"
                        />

                    )}

                    <span
                        className="
                            text-sm
                            font-medium
                            text-slate-700
                        "
                    >

                        {formData.isPublic
                            ? "Public Memory"
                            : "Private Memory"
                        }

                    </span>

                </div>

                <p
                    className="
                        mt-3
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >

                    {formData.isPublic
                        ? "Your memory will be visible on your public profile and can be shared with anyone."
                        : "Your memory will remain completely private and visible only inside your dashboard."
                    }

                </p>

            </div>

        </div>

    );

};

export default VisibilityCard;
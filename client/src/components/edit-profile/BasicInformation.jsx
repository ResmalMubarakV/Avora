import {
    CheckCircle2,
    Loader2,
    XCircle,
} from "lucide-react";

const BasicInformation = ({
    formData,
    handleChange,
    usernameStatus,
}) => {

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

            {/* Header */}

            <div className="mb-8">

                <h2 className="text-xl font-semibold text-slate-900">
                    Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Update your personal details displayed on your public profile.
                </p>

            </div>

            <div className="grid gap-6">

                {/* Name */}

                <div>

                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#3559D4]
                            focus:ring-4
                            focus:ring-blue-100
                        "
                    />

                </div>

                {/* Username */}

                <div>

                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Username
                    </label>

                    <div className="relative">

                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Choose a unique username"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                pr-12
                                lowercase
                                outline-none
                                transition
                                focus:border-[#3559D4]
                                focus:ring-4
                                focus:ring-blue-100
                            "
                        />

                        <div
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                            "
                        >

                            {usernameStatus === "checking" && (

                                <Loader2
                                    size={18}
                                    className="animate-spin text-slate-400"
                                />

                            )}

                            {usernameStatus === "available" && (

                                <CheckCircle2
                                    size={18}
                                    className="text-emerald-500"
                                />

                            )}

                            {usernameStatus === "taken" && (

                                <XCircle
                                    size={18}
                                    className="text-red-500"
                                />

                            )}

                        </div>

                    </div>

                    {usernameStatus === "checking" && (

                        <p className="mt-2 text-sm text-slate-500">
                            Checking username...
                        </p>

                    )}

                    {usernameStatus === "available" && (

                        <p className="mt-2 text-sm text-emerald-600">
                            Username is available.
                        </p>

                    )}

                    {usernameStatus === "taken" && (

                        <p className="mt-2 text-sm text-red-600">
                            Username is already taken.
                        </p>

                    )}

                </div>

                {/* Location */}

                <div>

                    <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Location
                    </label>

                    <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State or Country"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#3559D4]
                            focus:ring-4
                            focus:ring-blue-100
                        "
                    />

                </div>

            </div>

        </div>

    );

};

export default BasicInformation;
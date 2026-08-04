import { Globe } from "lucide-react";

import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
} from "react-icons/fa";

const SocialLinksCard = ({
    formData,
    handleChange,
}) => {

    const fields = [

        {
            name: "website",
            label: "Website",
            placeholder: "https://yourwebsite.com",
            icon: Globe,
        },

        {
            name: "instagram",
            label: "Instagram",
            placeholder: "https://instagram.com/username",
            icon: FaInstagram,
        },

        {
            name: "youtube",
            label: "YouTube",
            placeholder: "https://youtube.com/@username",
            icon: FaYoutube,
        },

        {
            name: "linkedin",
            label: "LinkedIn",
            placeholder: "https://linkedin.com/in/username",
            icon: FaLinkedin,
        },

    ];

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

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-slate-900
                    "
                >

                    Social Links

                </h2>

                <p
                    className="
                        mt-1

                        text-sm
                        text-slate-500
                    "
                >

                    Share your online presence with fellow travelers.

                </p>

            </div>

            <div className="space-y-6">

                {fields.map((field) => {

                    const Icon = field.icon;

                    return (

                        <div key={field.name}>

                            <label
                                htmlFor={field.name}
                                className="
                                    mb-2
                                    block

                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >

                                {field.label}

                            </label>

                            <div className="relative">

                                <Icon
                                    size={18}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2

                                        text-slate-400
                                    "
                                />

                                <input
                                    id={field.name}
                                    type="url"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="
                                        w-full

                                        rounded-xl
                                        border
                                        border-slate-200

                                        py-3
                                        pl-12
                                        pr-4

                                        outline-none

                                        transition

                                        focus:border-[#3559D4]
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                />

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};

export default SocialLinksCard;
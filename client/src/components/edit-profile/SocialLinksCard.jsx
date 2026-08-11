import { Globe } from "lucide-react";
import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
} from "react-icons/fa";

// ==========================================
// SOCIAL LINKS CARD COMPONENT (COMPACT)
// ==========================================
/**
 * Renders compact social media link inputs with integrated branding icons.
 */
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
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs">
            {/* Header */}
            <div className="mb-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Social Links
                </h2>
                <p className="text-[11px] text-slate-500">
                    Share your online presence.
                </p>
            </div>

            {/* Social Input Fields List */}
            <div className="space-y-3">
                {fields.map((field) => {
                    const Icon = field.icon;

                    return (
                        <div key={field.name}>
                            <label
                                htmlFor={field.name}
                                className="mb-1 block text-[11px] font-semibold text-slate-700"
                            >
                                {field.label}
                            </label>

                            <div className="relative">
                                <Icon
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id={field.name}
                                    type="url"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs sm:text-sm outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

SocialLinksCard.displayName = "SocialLinksCard";
export default SocialLinksCard;
import { Search } from "lucide-react";

// ==========================================
// COVER IMAGE COMPONENT
// ==========================================
/**
 * Renders a clickable profile or memory cover image banner with hover zoom, 
 * dark overlay gradients, and a centered "View Gallery" action preview button.
 * Fully responsive with rectangular proportions across all screen sizes.
 */
const CoverImage = ({ image, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                relative
                w-full
                h-56
                sm:h-72
                lg:h-[380px]
                overflow-hidden
                rounded-3xl
                focus:outline-none
                cursor-pointer
            "
        >
            {/* Cover Image */}
            <img
                src={image}
                alt="Cover"
                className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                "
            />

            {/* Dark Overlay Gradient on Hover */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/0
                    group-hover:bg-black/40
                    transition-all
                    duration-500
                "
            />

            {/* Centered Gallery Action Pill */}
            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-500
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        bg-white/90
                        backdrop-blur-md
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-gray-900
                        shadow-xl
                    "
                >
                    <Search size={18} />
                    View Gallery
                </div>
            </div>
        </button>
    );
};

export default CoverImage;
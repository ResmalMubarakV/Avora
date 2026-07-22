import { Search } from "lucide-react";

const CoverImage = ({ image, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
                group
                relative
                w-full
                h-[380px]
                overflow-hidden
                rounded-3xl
                focus:outline-none
            "
        >
            {/* Image */}

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

            {/* Dark Overlay */}

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

            {/* Center Content */}

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
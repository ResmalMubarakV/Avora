import { Images } from "lucide-react";

const ViewGalleryCard = ({ cover, remaining, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
                group
                relative
                aspect-square
                overflow-hidden
                rounded-2xl
                focus:outline-none
            "
        >
            {/* Background */}

            {cover && (
                <img
                    src={cover.url}
                    alt=""
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                    "
                />
            )}

            {/* Overlay */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/55
                    transition-all
                    duration-300
                    group-hover:bg-black/45
                "
            />

            {/* Content */}

            <div
                className="
                    relative
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    text-white
                "
            >
                <Images size={30} />

                <p className="mt-3 text-2xl font-bold">
                    +{remaining}
                </p>

                <p className="text-sm opacity-90">
                    View Gallery
                </p>
            </div>
        </button>
    );
};

export default ViewGalleryCard;
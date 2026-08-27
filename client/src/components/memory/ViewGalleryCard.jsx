import { Images, Video as VideoIcon } from "lucide-react";

// ==========================================
// VIDEO ITEM UTILITY CHECK
// ==========================================
const isVideoItem = (item) =>
    item?.type === "video" ||
    /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(item?.url || "");

// ==========================================
// VIEW GALLERY CARD COMPONENT
// ==========================================
/**
 * Renders a gallery overflow action card displaying the remaining media count.
 * Gracefully handles both image and video cover types without broken image links.
 */
const ViewGalleryCard = ({ cover, remaining, onClick }) => {
    const isVideo = isVideoItem(cover);
    // Only use cover.url if it is an image; otherwise, leave empty to show a clean solid fallback
    const coverUrl = cover && !isVideo ? cover.url : "";

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                relative
                h-full
                w-full
                overflow-hidden
                rounded-xl
                sm:rounded-2xl
                focus:outline-none
                cursor-pointer
                bg-slate-900
                border
                border-slate-200/80
                dark:border-slate-800
                ring-1
                ring-slate-900/5
                dark:ring-white/10
                shadow-2xs
            "
        >
            {/* Background Image (Only rendered if it's a valid photo cover) */}
            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt="Gallery Overflow Cover"
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
            ) : (
                /* Fallback background if cover is a video or missing */
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <VideoIcon size={32} className="text-white/20" />
                </div>
            )}

            {/* Dark Backdrop Overlay */}
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

            {/* Centered Content Counter & Text */}
            <div
                className="
                    relative
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    text-white
                    p-1
                "
            >
                <Images size={24} className="sm:w-7 sm:h-7" />

                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold tracking-tight">
                    +{remaining}
                </p>

                <p className="text-[10px] sm:text-xs font-medium opacity-90 truncate max-w-full">
                    View Gallery
                </p>
            </div>
        </button>
    );
};

export default ViewGalleryCard;
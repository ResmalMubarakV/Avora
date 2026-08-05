import { Play } from "lucide-react";

// ==========================================
// VIDEO ITEM UTILITY CHECK
// ==========================================
const isVideoItem = (item) =>
    item?.type === "video" ||
    /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(item?.url || "");

// ==========================================
// CLOUDINARY VIDEO THUMBNAIL TRANSFORMER
// ==========================================
/**
 * Safely converts a Cloudinary video URL into an image snapshot URL 
 * by swapping /video/upload/ to /image/upload/ and changing extension to .jpg
 */
const getCloudinaryVideoThumbnail = (url) => {
    if (!url) return "";
    if (url.includes("/video/upload/")) {
        return url
            .replace("/video/upload/", "/image/upload/so_0/")
            .replace(/\.[^/.]+$/, ".jpg");
    }
    return url;
};

// ==========================================
// THUMBNAIL COMPONENT
// ==========================================
const Thumbnail = ({ item, onClick }) => {
    const isVideo = isVideoItem(item);
    const posterUrl = item?.posterUrl || getCloudinaryVideoThumbnail(item?.url);

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                relative
                aspect-square
                overflow-hidden
                rounded-2xl
                focus:outline-none
                cursor-pointer
                bg-slate-900
            "
        >
            {isVideo ? (
                <img
                    src={posterUrl}
                    alt="Memory Video Thumbnail"
                    decoding="async"
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-all
                        duration-700
                        group-hover:scale-110
                    "
                />
            ) : (
                <img
                    src={item.url}
                    alt="Memory Photo Thumbnail"
                    decoding="async"
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-all
                        duration-700
                        group-hover:scale-110
                    "
                />
            )}

            {/* Dark Overlay on Hover */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/0
                    transition
                    duration-300
                    group-hover:bg-black/20
                "
            />

            {/* Video Play Icon Badge Overlay */}
            {isVideo && (
                <div
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                    "
                >
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-black/60
                            text-white
                            backdrop-blur-md
                            transition
                            group-hover:scale-110
                            shadow-lg
                        "
                    >
                        <Play
                            size={22}
                            className="ml-0.5"
                            fill="currentColor"
                        />
                    </div>
                </div>
            )}
        </button>
    );
};

export default Thumbnail;
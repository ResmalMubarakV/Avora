import { useRef, useState } from "react";
import { Play, Video as VideoIcon } from "lucide-react";

const isVideoItem = (item) =>
    item?.type === "video" ||
    /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(item?.url || "");

const Thumbnail = ({ item, onClick }) => {

    const isVideo = isVideoItem(item);
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);

    // Some browsers don't paint a frame for a <video> just from
    // preload="metadata" — explicitly seeking forces one to render.
    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video && video.currentTime === 0) {
            try {
                video.currentTime = 0.1;
            } catch (error) {
                // ignore — some browsers disallow seeking before enough data
            }
        }
    };

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

            {isVideo ? (

                item.thumbnailUrl || item.poster ? (

                    // Prefer a real poster image — fastest, most reliable thumbnail
                    <img
                        src={item.thumbnailUrl || item.poster}
                        alt="Memory"
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

                    <>

                        {/* Placeholder shown until the video paints a frame,
                            and permanently as a fallback if it never does */}

                        {!videoReady && (
                            <div
                                className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    bg-slate-800
                                "
                            >
                                <VideoIcon
                                    size={28}
                                    className="text-white/40"
                                />
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            src={item.url}
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={handleLoadedMetadata}
                            onSeeked={() => setVideoReady(true)}
                            onLoadedData={() => setVideoReady(true)}
                            className={`
                                h-full
                                w-full
                                object-cover
                                transition-all
                                duration-700
                                group-hover:scale-110
                                ${videoReady ? "opacity-100" : "opacity-0"}
                            `}
                        />

                    </>

                )

            ) : (

                <img
                    src={item.url}
                    alt="Memory"
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

            {/* Dark Overlay */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/0
                    transition
                    duration-300
                    group-hover:bg-black/10
                "
            />

            {/* Video Play Icon */}

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
                            bg-black/55
                            text-white
                            backdrop-blur-sm
                            transition
                            group-hover:scale-110
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
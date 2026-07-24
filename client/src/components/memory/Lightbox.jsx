import {
    X,
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize2,
    Minimize2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

const Lightbox = ({
    media,
    selectedIndex,
    onClose,
    nextImage,
    previousImage,
    goToImage,
    canDownload,
    memoryTitle,
}) => {
    const selectedMedia = media[selectedIndex];
    const thumbnailRefs = useRef([]);
    const [imageLoading, setImageLoading] = useState(true);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const videoRef = useRef(null);
    const lightboxRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

        if (event.key === "Escape") {
            onClose();
        }
    };
    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
        touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        touchEndX.current = event.touches[0].clientX;
        touchEndY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const deltaX = touchStartX.current - touchEndX.current;
        const deltaY = touchStartY.current - touchEndY.current;

        const MIN_SWIPE_DISTANCE = 50;

        // Ignore mostly vertical gestures
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }

        if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE) {
            return;
        }

        if (deltaX > 0) {
            nextImage();
        } else {
            previousImage();
        }
    };

    const downloadMedia = async () => {
        try {

            const response = await fetch(selectedMedia.url);

            const blob = await response.blob();

            const objectUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            const extension =
                selectedMedia.url
                    .split(".")
                    .pop()
                    .split("?")[0];

            const safeTitle = memoryTitle
                .replace(/[<>:"/\\|?*]/g, "")
                .trim()
                .replace(/\s+/g, "-");

            link.href = objectUrl;

            link.download = `${safeTitle}-${selectedIndex + 1}.${extension}`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(objectUrl);

        } catch (error) {

            console.error("Download failed", error);

        }
    };

    const toggleFullscreen = async () => {

        try {

            if (!document.fullscreenElement) {

                await lightboxRef.current.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.error(error);

        }

    };

    const handleClose = async () => {

    if (document.fullscreenElement) {

        await document.exitFullscreen();

        return;

    }

    onClose();

};

    useEffect(() => {

        const handleFullscreenChange = () => {

            setIsFullscreen(!!document.fullscreenElement);

        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );

        };

    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);


    useEffect(() => {
        const img = new Image();

        img.src = selectedMedia.url;

        if (img.complete) {
            setImageLoading(false);
        }
    }, [selectedMedia]);

useEffect(() => {

    const handleKeyDown = (event) => {

        switch (event.key) {

            case "ArrowRight":
                if (!isFullscreen) nextImage();
                break;

            case "ArrowLeft":
                if (!isFullscreen) previousImage();
                break;

            case "Escape":

                if (document.fullscreenElement) {

                    document.exitFullscreen();

                } else {

                    onClose();

                }

                break;

            case "f":
            case "F":

                toggleFullscreen();

                break;

            default:
                break;

        }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

    };

}, [
    nextImage,
    previousImage,
    onClose,
    isFullscreen,
]);

        useEffect(() => {

        thumbnailRefs.current[selectedIndex]?.scrollIntoView({

            behavior: "smooth",

            block: "center",

            inline: "center",

        });

    }, [selectedIndex]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [selectedIndex]);

    useEffect(() => {
        const previousIndex =
            (selectedIndex - 1 + media.length) % media.length;

        const nextIndex =
            (selectedIndex + 1) % media.length;

        const previous = media[previousIndex];

    if (previous.type === "image") {
        const img = new Image();
        img.src = previous.url;
    }

    const next = media[nextIndex];

    if (next.type === "image") {
        const img = new Image();
        img.src = next.url;
    }

    }, [selectedIndex, media]);

    return (
        <div ref={lightboxRef}
            className="
                    fixed
                    inset-0
                    z-50
                    bg-black/96
                    flex
                    flex-col
            "
        >

            <div className="flex justify-end items-center gap-4 p-6">

                {canDownload && (
                    <button
                        onClick={downloadMedia}
                        className="
                            text-white
                            hover:opacity-80
                            transition
                        "
                        title="Download"
                    >
                        <Download size={28} />
                    </button>
                )}

                <button
                    onClick={toggleFullscreen}
                    className="text-white hover:opacity-80 transition"
                    title={
                        isFullscreen
                            ? "Exit Fullscreen"
                            : "Fullscreen"
                    }
                >
                    {isFullscreen ? (
                        <Minimize2 size={28} />
                    ) : (
                        <Maximize2 size={28} />
                    )}
                </button>

                <button
                    onClick={handleClose}
                    className="
                        text-white
                        hover:opacity-80
                    "
                >
                    <X size={32} />
                </button>

            </div>



            <div
                className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    px-4
                    pb-6
                "
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >

                <div
                    className="
                        flex
                        w-full
                        h-full
                        items-center
                        justify-center
                        gap-10
                    "
                >

                    {/* Desktop Thumbnail Rail */}

                {!isFullscreen && (
                    <div
                        className="
                            hidden
                            lg:flex
                            flex-col
                            items-center
                            pl-8
                            pr-6
                            py-2
                            h-[88vh]
                        "
                    >

                        {/* Scrollable Thumbnails */}

                        <div
                            className="
                                flex-1
                                flex
                                flex-col
                                gap-6
                                overflow-y-auto
                                scrollbar-hide
                            "
                        >
                            {media.map((item, index) => (
                                <img
                                    key={index}
                                    ref={(el) =>
                                        (thumbnailRefs.current[index] = el)
                                    }
                                    src={item.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => goToImage(index)}
                                    className={`
                                        w-24
                                        h-24
                                        rounded-xl
                                        object-cover
                                        cursor-pointer
                                        border-2
                                        transition-all
                                        duration-300

                                        ${
                                            selectedIndex === index
                                                ? `
                                                    border-white
                                                    opacity-100
                                                    scale-105
                                                    shadow-[0_0_18px_rgba(255,255,255,0.25)]
                                                `
                                                : `
                                                    border-transparent
                                                    opacity-45
                                                    hover:opacity-100
                                                    hover:border-white/40
                                                    hover:scale-105
                                                `
                                        }
                                    `}
                                />
                            ))}
                        </div>

                        {/* Sticky Footer */}

                        <div
                            className="
                                pt-5
                                text-xs
                                text-center
                                text-white/40
                                select-none
                            "
                        >
                            Scroll • Click • ← →
                        </div>

                    </div>
                )}

                    {/* Main Media */}

                    <div
                        className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            relative
                        "
                    >

                        {imageLoading && (
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
                                        h-10
                                        w-10
                                        animate-spin
                                        rounded-full
                                        border-4
                                        border-white/30
                                        border-t-white
                                    "
                                />
                            </div>
                        )}

                        {selectedMedia.type === "image" ? (
                            <img
                                key={selectedMedia.url}
                                src={selectedMedia.url}
                                alt="Memory"
                                onDoubleClick={toggleFullscreen}
                                onLoad={() => setImageLoading(false)}
                                onError={() => setImageLoading(false)}
                                className={`
                                    max-h-[94vh]
                                    max-w-full
                                    object-contain
                                    transition-opacity
                                    duration-300
                                    ${
                                        imageLoading
                                            ? "opacity-0"
                                            : "opacity-100"
                                    }
                                `}
                            />
                        ) : (
                            <video
                                ref={videoRef}
                                key={selectedMedia.url}
                                src={selectedMedia.url}
                                controls
                                autoPlay
                                playsInline
                                preload="metadata"
                                onDoubleClick={toggleFullscreen}
                                onLoadedData={() => setImageLoading(false)}
                                onWaiting={() => setImageLoading(true)}
                                onPlaying={() => setImageLoading(false)}
                                className="
                                    max-h-[94vh]
                                    max-w-full
                                    object-contain
                                    rounded-lg
                                "
                            />
                        )}

                        {/* Previous Button - Mobile & Tablet Only */}

                        {!isFullscreen && (
                            <button
                                onClick={previousImage}
                                className="
                                    lg:hidden
                                    absolute
                                    left-2
                                    sm:left-6
                                    top-1/2
                                    -translate-y-1/2
                                    rounded-full
                                    bg-white/15
                                    backdrop-blur-md
                                    p-3
                                    sm:p-4
                                    text-white
                                    hover:bg-white/25
                                    transition
                                "
                            >
                                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                        )}

                                {/* Next Button - Mobile & Tablet Only */}

                            {!isFullscreen && (
                                <button
                                    onClick={nextImage}
                                    className="
                                        lg:hidden
                                        absolute
                                        right-2
                                        sm:right-6
                                        top-1/2
                                        -translate-y-1/2
                                        rounded-full
                                        bg-white/15
                                        backdrop-blur-md
                                        p-3
                                        sm:p-4
                                        text-white
                                        hover:bg-white/25
                                        transition
                                    "
                                >
                                    <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                                </button>
                            )}

                    </div>

                </div>

            </div>

            {!isFullscreen && (
                <div
                    className="
                        hidden
                        lg:flex
                        flex-col
                        items-center
                        gap-4
                        pl-8
                        pr-6
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            overflow-y-auto
                            max-h-[82vh]
                            scrollbar-hide
                        "
                    >
                        {media.map((item, index) => (
                            <img
                                key={index}
                                ref={(el) =>
                                    (thumbnailRefs.current[index] = el)
                                }
                                src={item.url}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => goToImage(index)}
                                className={`
                                    w-24
                                    h-24
                                    rounded-xl
                                    object-cover
                                    cursor-pointer
                                    border-2
                                    transition-all
                                    duration-300

                                    ${
                                        selectedIndex === index
                                            ? `
                                                border-white
                                                opacity-100
                                                scale-105
                                                shadow-[0_0_18px_rgba(255,255,255,0.25)]
                                            `
                                            : `
                                                border-transparent
                                                opacity-45
                                                hover:opacity-100
                                                hover:border-white/40
                                                hover:scale-105
                                            `
                                    }
                                `}
                            />
                        ))}
                    </div>

                </div>
            )}

            {/* Counter */}

            {!isFullscreen && (
                <div className="pb-6 flex justify-center">
                    <div
                        className="
                            rounded-full
                            bg-black/60
                            px-4
                            py-1
                            text-xs
                            text-white
                        "
                    >
                        {selectedIndex + 1} / {media.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lightbox;
import {
    X,
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize2,
    Minimize2,
    Play,
    Video,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

// ==========================================
// LIGHTBOX COMPONENT
// ==========================================
/**
 * Renders an immersive full-screen media lightbox viewer supporting images and videos, 
 * pinch-to-zoom / double-tap zoom gestures, touch swipe navigation, keyboard shortcuts, 
 * thumbnail side rail navigation, and file downloading.
 */
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

    const isVideoItem = (item) =>
        item?.type === "video" ||
        /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(item?.url || "");

    const thumbnailRefs = useRef([]);
    const [imageLoading, setImageLoading] = useState(true);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const videoRef = useRef(null);
    const lightboxRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragEndX = useRef(0);

    // Pinch-to-zoom / pan state
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isInteractingZoom, setIsInteractingZoom] = useState(false);
    const pinchStartDistance = useRef(null);
    const pinchStartScale = useRef(1);
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });
    const translateStart = useRef({ x: 0, y: 0 });

    // Double-tap-to-zoom state
    const hadMultiTouch = useRef(false);
    const tapStartPos = useRef({ x: 0, y: 0 });
    const lastTapTime = useRef(0);

    // One-time swipe hint for first-time mobile users
    const [showSwipeHint, setShowSwipeHint] = useState(false);

    const MIN_SCALE = 1;
    const MAX_SCALE = 4;
    const DOUBLE_TAP_ZOOM = 2.5;

    const getTouchDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    };

    const handleTouchStart = (event) => {
        // Two fingers -> start pinch-to-zoom
        if (event.touches.length === 2) {
            hadMultiTouch.current = true;
            pinchStartDistance.current = getTouchDistance(event.touches);
            pinchStartScale.current = scale;
            setIsInteractingZoom(true);
            return;
        }

        if (event.touches.length === 1) {
            // Fresh single-finger gesture — reset tap tracking
            hadMultiTouch.current = false;
            tapStartPos.current = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };

            // One finger while zoomed in -> pan instead of swipe/navigate
            if (scale > 1) {
                isPanning.current = true;
                setIsInteractingZoom(true);
                panStart.current = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                };
                translateStart.current = { ...translate };
                return;
            }

            if (isVideoItem(selectedMedia)) return;

            touchStartX.current = event.touches[0].clientX;
            touchStartY.current = event.touches[0].clientY;
        }
    };

    const handleTouchMove = (event) => {
        // Pinch zooming
        if (event.touches.length === 2 && pinchStartDistance.current) {
            const newDistance = getTouchDistance(event.touches);
            const ratio = newDistance / pinchStartDistance.current;

            const newScale = Math.min(
                Math.max(pinchStartScale.current * ratio, MIN_SCALE),
                MAX_SCALE
            );

            setScale(newScale);
            return;
        }

        // Panning while zoomed in
        if (event.touches.length === 1 && isPanning.current) {
            const dx = event.touches[0].clientX - panStart.current.x;
            const dy = event.touches[0].clientY - panStart.current.y;

            setTranslate({
                x: translateStart.current.x + dx,
                y: translateStart.current.y + dy,
            });
            return;
        }

        touchEndX.current = event.touches[0].clientX;
        touchEndY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        // Still has a finger down (e.g. pinch releasing to a single finger)
        if (event.touches.length > 0) {
            return;
        }

        const wasPinching = pinchStartDistance.current !== null;
        const wasPanning = isPanning.current;

        pinchStartDistance.current = null;
        isPanning.current = false;
        setIsInteractingZoom(false);

        // Double-tap-to-zoom: only for a clean single-finger tap (no pinch involved)
        if (!hadMultiTouch.current && !wasPinching) {
            const endTouch = event.changedTouches && event.changedTouches[0];

            if (endTouch) {
                const movedX = Math.abs(endTouch.clientX - tapStartPos.current.x);
                const movedY = Math.abs(endTouch.clientY - tapStartPos.current.y);
                const TAP_MOVE_THRESHOLD = 10;

                if (movedX < TAP_MOVE_THRESHOLD && movedY < TAP_MOVE_THRESHOLD) {
                    const now = Date.now();
                    const DOUBLE_TAP_WINDOW = 350;

                    if (now - lastTapTime.current < DOUBLE_TAP_WINDOW) {
                        lastTapTime.current = 0;

                        if (scale > 1) {
                            setScale(1);
                            setTranslate({ x: 0, y: 0 });
                        } else if (!isVideoItem(selectedMedia)) {
                            setScale(DOUBLE_TAP_ZOOM);
                        }

                        return;
                    }

                    lastTapTime.current = now;
                }
            }
        }

        // Snap back if zoomed out past 1x
        if (scale <= 1) {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
            return;
        }

        // Don't trigger swipe navigation while zoomed in or just finished panning
        if (scale > 1 || wasPanning) {
            return;
        }

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

            const safeTitle = (memoryTitle || "memory")
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

    const handleMouseDown = (e) => {
        if (isVideoItem(selectedMedia)) return;
        if (scale > 1) return;

        isDragging.current = true;
        dragStartX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        dragEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;

        isDragging.current = false;
        const delta = dragStartX.current - dragEndX.current;
        const DRAG_DISTANCE = 80;

        if (Math.abs(delta) < DRAG_DISTANCE) return;

        if (delta > 0) {
            nextImage();
        } else {
            previousImage();
        }
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

    // Focus the dialog on open so keyboard users start inside it
    useEffect(() => {
        if (lightboxRef.current) {
            lightboxRef.current.focus();
        }
    }, []);

    // Show a brief one-time nudge on touch devices so people discover swipe
    useEffect(() => {
        if (typeof window === "undefined") return;

        const isTouchDevice =
            window.matchMedia &&
            window.matchMedia("(pointer: coarse)").matches;

        if (!isTouchDevice || media.length <= 1) return;

        setShowSwipeHint(true);

        const timer = setTimeout(() => {
            setShowSwipeHint(false);
        }, 1400);

        return () => clearTimeout(timer);
    }, [media.length]);

    useEffect(() => {
        setImageLoading(true);

        if (isVideoItem(selectedMedia)) {
            setImageLoading(false);
            return;
        }

        const img = new Image();
        img.onload = () => setImageLoading(false);
        img.onerror = () => setImageLoading(false);
        img.src = selectedMedia.url;
    }, [selectedMedia]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "ArrowRight":
                    nextImage();
                    break;

                case "ArrowLeft":
                    previousImage();
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

                case "Tab": {
                    const focusableSelector =
                        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

                    const focusable = lightboxRef.current
                        ? lightboxRef.current.querySelectorAll(focusableSelector)
                        : [];

                    if (!focusable || focusable.length === 0) break;

                    const list = Array.from(focusable);
                    const first = list[0];
                    const last = list[list.length - 1];

                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }

                    break;
                }

                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [nextImage, previousImage, onClose]);

    useEffect(() => {
        const selected = thumbnailRefs.current[selectedIndex];
        if (!selected) return;

        const container = selected.parentElement;
        if (!container) return;

        container.scrollTo({
            top:
                selected.offsetTop -
                container.clientHeight / 2 +
                selected.clientHeight / 2,
            behavior: "smooth",
        });
    }, [selectedIndex]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, [selectedIndex]);

    useEffect(() => {
        if (selectedIndex > 0) {
            const previous = media[selectedIndex - 1];
            if (previous.type === "image") {
                const img = new Image();
                img.src = previous.url;
            }
        }

        if (selectedIndex < media.length - 1) {
            const next = media[selectedIndex + 1];
            if (next.type === "image") {
                const img = new Image();
                img.src = next.url;
            }
        }
    }, [selectedIndex, media]);

    return (
        <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={memoryTitle ? `${memoryTitle} — media viewer` : "Media viewer"}
            tabIndex={-1}
            className="
                fixed
                inset-0
                z-50
                bg-black/96
                flex
                flex-col
                outline-none
            "
        >
            {/* Top Control Bar */}
            <div className="flex justify-end items-center gap-4 p-6">
                {canDownload && (
                    <button
                        type="button"
                        onClick={downloadMedia}
                        aria-label="Download media"
                        className="
                            text-white
                            p-2
                            rounded-full
                            cursor-pointer
                            hover:bg-white/10
                            hover:opacity-80
                            transition
                        "
                        title="Download"
                    >
                        <Download size={28} />
                    </button>
                )}

                <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={
                        isFullscreen
                            ? "Exit fullscreen"
                            : "Enter fullscreen"
                    }
                    className="
                        text-white
                        p-2
                        rounded-full
                        cursor-pointer
                        hover:bg-white/10
                        hover:opacity-80
                        transition
                    "
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
                    type="button"
                    onClick={handleClose}
                    aria-label="Close media viewer"
                    className="
                        text-white
                        p-2
                        rounded-full
                        cursor-pointer
                        hover:bg-white/10
                        hover:opacity-80
                        transition
                    "
                >
                    <X size={32} />
                </button>
            </div>

            {/* Main Content Body */}
            <div
                className="
                    flex-1
                    min-h-0
                    flex
                    items-center
                    justify-center
                    px-4
                "
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
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
                                xl:flex
                                flex-col
                                items-center
                                pl-8
                                pr-6
                                py-2
                                h-[calc(100vh-120px)]
                            "
                        >
                            {/* Scrollable Thumbnails List */}
                            <div
                                className="
                                    flex-1
                                    flex
                                    flex-col
                                    gap-5
                                    overflow-y-auto
                                    overflow-x-visible
                                    py-3
                                    px-3
                                    scroll-smooth
                                    scrollbar-hide
                                "
                            >
                                {media.map((item, index) => (
                                    <button
                                        key={index}
                                        ref={(el) =>
                                            (thumbnailRefs.current[index] = el)
                                        }
                                        type="button"
                                        onClick={() => goToImage(index)}
                                        aria-label={`Go to media ${index + 1} of ${media.length}`}
                                        className={`
                                            relative
                                            shrink-0
                                            w-24
                                            h-24
                                            rounded-xl
                                            overflow-hidden
                                            cursor-pointer
                                            border-2
                                            transition-all
                                            duration-300
                                            ${
                                                selectedIndex === index
                                                    ? "border-white opacity-100 scale-105"
                                                    : "border-transparent opacity-45 hover:opacity-100 hover:border-white/40 hover:scale-105"
                                            }
                                        `}
                                    >
                                        {isVideoItem(item) ? (
                                            <>
                                                {item.thumbnailUrl || item.poster ? (
                                                    <img
                                                        src={item.thumbnailUrl || item.poster}
                                                        alt={`Thumbnail ${index + 1} of ${media.length}`}
                                                        decoding="async"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="
                                                            w-full
                                                            h-full
                                                            bg-slate-800
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >
                                                        <Video
                                                            size={24}
                                                            className="text-white/50"
                                                        />
                                                    </div>
                                                )}

                                                <div
                                                    className="
                                                        absolute
                                                        inset-0
                                                        flex
                                                        items-center
                                                        justify-center
                                                        bg-black/25
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            h-7
                                                            w-7
                                                            rounded-full
                                                            bg-white/90
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >
                                                        <Play
                                                            size={14}
                                                            className="text-black fill-black ml-0.5"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={`Thumbnail ${index + 1} of ${media.length}`}
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Sticky Footer Help Tip */}
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

                    {/* Main Media Container */}
                    <div
                        className="
                            relative
                            flex-1
                            flex
                            flex-col
                            items-center
                            justify-center
                            h-full
                        "
                    >
                        {/* Media Viewport */}
                        <div
                            className={`
                                relative
                                flex
                                items-center
                                justify-center
                                w-full
                                overflow-hidden
                                ${
                                    showSwipeHint
                                        ? "animate-[lightboxSwipeHint_1.3s_ease-in-out_1]"
                                        : ""
                                }
                            `}
                            style={{ touchAction: "none" }}
                        >
                            {showSwipeHint && (
                                <style>{`
                                    @keyframes lightboxSwipeHint {
                                        0% { transform: translateX(0); }
                                        25% { transform: translateX(-14px); }
                                        50% { transform: translateX(0); }
                                        75% { transform: translateX(14px); }
                                        100% { transform: translateX(0); }
                                    }
                                `}</style>
                            )}

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

                            <div
                                style={{
                                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                                    transition: isInteractingZoom
                                        ? "none"
                                        : "transform 0.2s ease-out",
                                    touchAction: "none",
                                }}
                            >
                                {!isVideoItem(selectedMedia) ? (
                                    <img
                                        key={selectedMedia.url}
                                        src={selectedMedia.url}
                                        alt={
                                            memoryTitle
                                                ? `${memoryTitle} — photo ${selectedIndex + 1} of ${media.length}`
                                                : `Photo ${selectedIndex + 1} of ${media.length}`
                                        }
                                        decoding="async"
                                        onDoubleClick={toggleFullscreen}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => setImageLoading(false)}
                                        draggable={false}
                                        className={`
                                            max-h-[calc(100vh-170px)]
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
                                        controlsList="nodownload"
                                        autoPlay
                                        muted
                                        playsInline
                                        preload="metadata"
                                        onLoadedData={() => setImageLoading(false)}
                                        onWaiting={() => setImageLoading(true)}
                                        onPlaying={() => setImageLoading(false)}
                                        onError={() => setImageLoading(false)}
                                        className="
                                            max-h-[calc(100vh-170px)]
                                            max-w-full
                                            object-contain
                                            rounded-lg
                                        "
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bottom Navigation & Counter */}
                        {!isFullscreen && (
                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    right-0
                                    z-10
                                    flex
                                    flex-col
                                    items-center
                                    gap-3
                                    pb-4
                                    sm:pb-0
                                    pointer-events-none
                                "
                            >
                                {!isVideoItem(selectedMedia) && (
                                    <div className="flex items-center justify-center gap-12 sm:gap-16 md:gap-20 pointer-events-auto">
                                        <button
                                            type="button"
                                            onClick={previousImage}
                                            disabled={selectedIndex === 0}
                                            aria-label="Previous media"
                                            className={`
                                                transition
                                                duration-200
                                                cursor-pointer
                                                ${
                                                    selectedIndex === 0
                                                        ? "opacity-30 cursor-not-allowed"
                                                        : "text-white hover:text-white/70"
                                                }
                                            `}
                                        >
                                            <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            disabled={selectedIndex === media.length - 1}
                                            aria-label="Next media"
                                            className={`
                                                transition
                                                duration-200
                                                cursor-pointer
                                                ${
                                                    selectedIndex === media.length - 1
                                                        ? "opacity-30 cursor-not-allowed"
                                                        : "text-white hover:text-white/70"
                                                }
                                            `}
                                        >
                                            <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                                        </button>
                                    </div>
                                )}

                                <div
                                    className="
                                        rounded-full
                                        border
                                        border-white/20
                                        bg-white/10
                                        px-5
                                        py-1.5
                                        text-sm
                                        font-medium
                                        text-white
                                        backdrop-blur-sm
                                        pointer-events-auto
                                    "
                                >
                                    {selectedIndex + 1} / {media.length}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;
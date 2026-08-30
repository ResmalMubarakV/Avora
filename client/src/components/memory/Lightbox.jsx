import {
    X,
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize2,
    Minimize2,
    Play,
    Pause,
    Volume2,
    VolumeX,
} from "lucide-react";

import { useEffect, useRef, useState, useCallback } from "react";

// ==========================================
// LIGHTBOX COMPONENT
// ==========================================
/**
 * Renders an immersive full-screen media lightbox viewer supporting images and videos,
 * pinch-to-zoom / double-tap zoom gestures, touch swipe navigation, keyboard shortcuts,
 * thumbnail side rail navigation, and file downloading with dynamic media slugs.
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
    const selectedMedia =
        media && media.length > 0 ? media[selectedIndex] : null;

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
    
    // Drag & Swipe tracking state
    const isDragging = useRef(false);
    const isSwipeTracking = useRef(false);
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [isSwipeTrackingState, setIsSwipeTrackingState] = useState(false);
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

    // Toggle-able UI overlays controls state
    const [showControls, setShowControls] = useState(true);
    const tapTimer = useRef(null);

    // Custom video playback states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // Auto-hide controls timer (3s) when video is playing
    const controlsTimeoutRef = useRef(null);

    const resetControlsTimeout = useCallback(() => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isVideoItem(selectedMedia) && isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [selectedMedia, isPlaying]);

    useEffect(() => {
        resetControlsTimeout();
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isPlaying, selectedIndex, resetControlsTimeout]);

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch((err) => console.log(err));
        }
    };

    const MIN_SCALE = 1;
    const MAX_SCALE = 4;
    const DOUBLE_TAP_ZOOM = 2.5;

    const getTouchDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    };

    const handleTouchStart = (event) => {
        if (event.touches.length === 2) {
            hadMultiTouch.current = true;
            pinchStartDistance.current = getTouchDistance(event.touches);
            pinchStartScale.current = scale;
            setIsInteractingZoom(true);
            return;
        }

        if (event.touches.length === 1) {
            hadMultiTouch.current = false;
            tapStartPos.current = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };

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

            isSwipeTracking.current = false;
            setIsSwipeTrackingState(false);
            touchStartX.current = event.touches[0].clientX;
            touchStartY.current = event.touches[0].clientY;
            touchEndX.current = event.touches[0].clientX;
            touchEndY.current = event.touches[0].clientY;
        }
    };

    const handleTouchMove = (event) => {
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

        if (event.touches.length === 1 && isPanning.current) {
            const dx = event.touches[0].clientX - panStart.current.x;
            const dy = event.touches[0].clientY - panStart.current.y;

            setTranslate({
                x: translateStart.current.x + dx,
                y: translateStart.current.y + dy,
            });
            return;
        }

        if (event.touches.length === 1 && scale === 1) {
            const currentX = event.touches[0].clientX;
            const currentY = event.touches[0].clientY;
            const dx = currentX - touchStartX.current;
            const dy = currentY - touchStartY.current;

            if (!isSwipeTracking.current && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
                isSwipeTracking.current = true;
                setIsSwipeTrackingState(true);
            }

            if (isSwipeTracking.current) {
                let visualX = dx;
                if ((selectedIndex === 0 && dx > 0) || (selectedIndex === media.length - 1 && dx < 0)) {
                    visualX = dx * 0.3;
                }
                setTranslate({ x: visualX, y: 0 });
            }

            touchEndX.current = currentX;
            touchEndY.current = currentY;
        }
    };

    const handleTouchEnd = (event) => {
        if (event.touches.length > 0) {
            const remaining = event.touches[0];
            pinchStartDistance.current = null;
            hadMultiTouch.current = true; 

            if (scale > 1) {
                isPanning.current = true;
                setIsInteractingZoom(true);
                panStart.current = { x: remaining.clientX, y: remaining.clientY };
                translateStart.current = { ...translate };
            } else {
                isPanning.current = false;
                touchStartX.current = remaining.clientX;
                touchStartY.current = remaining.clientY;
                touchEndX.current = remaining.clientX;
                touchEndY.current = remaining.clientY;
            }
            return;
        }

        const wasPinching = pinchStartDistance.current !== null;
        const wasPanning = isPanning.current;

        pinchStartDistance.current = null;
        isPanning.current = false;
        setIsInteractingZoom(false);

        // Tap handling (single tap to toggle controls, double tap to zoom)
        if (!hadMultiTouch.current && !wasPinching) {
            const endTouch = event.changedTouches && event.changedTouches[0];

            if (endTouch) {
                const movedX = Math.abs(endTouch.clientX - tapStartPos.current.x);
                const movedY = Math.abs(endTouch.clientY - tapStartPos.current.y);
                const TAP_MOVE_THRESHOLD = 10;

                if (movedX < TAP_MOVE_THRESHOLD && movedY < TAP_MOVE_THRESHOLD) {
                    const now = Date.now();
                    const DOUBLE_TAP_WINDOW = 300;

                    if (now - lastTapTime.current < DOUBLE_TAP_WINDOW) {
                        // Double tap: clear single-tap timer and zoom
                        if (tapTimer.current) clearTimeout(tapTimer.current);
                        lastTapTime.current = 0;

                        if (scale > 1) {
                            setScale(1);
                            setTranslate({ x: 0, y: 0 });
                        } else if (!isVideoItem(selectedMedia)) {
                            setScale(DOUBLE_TAP_ZOOM);
                        }
                        return;
                    } else {
                        // Potential single tap: schedule toggle with delay
                        lastTapTime.current = now;
                        if (tapTimer.current) clearTimeout(tapTimer.current);
                        tapTimer.current = setTimeout(() => {
                            setShowControls(prev => !prev);
                            resetControlsTimeout();
                        }, DOUBLE_TAP_WINDOW);
                    }
                }
            }
        }

        if (scale < 1) {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
            return;
        }

        if (scale > 1 || wasPanning) {
            return; 
        }

        if (isSwipeTracking.current) {
            const deltaX = touchStartX.current - touchEndX.current;
            const SWIPE_THRESHOLD = 50;

            if (deltaX > SWIPE_THRESHOLD && selectedIndex < media.length - 1) {
                nextImage();
            } else if (deltaX < -SWIPE_THRESHOLD && selectedIndex > 0) {
                previousImage();
            }
            
            setTranslate({ x: 0, y: 0 });
            isSwipeTracking.current = false;
            setIsSwipeTrackingState(false);
            return;
        }

        const deltaX = touchStartX.current - touchEndX.current;
        const deltaY = touchStartY.current - touchEndY.current;
        const MIN_SWIPE_DISTANCE = 50;

        if (Math.abs(deltaY) < Math.abs(deltaX) && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
            if (deltaX > 0 && selectedIndex < media.length - 1) {
                nextImage();
            } else if (deltaX < 0 && selectedIndex > 0) {
                previousImage();
            }
        }
    };

    const downloadMedia = async () => {
        if (!selectedMedia) return;

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

            const mediaType = isVideoItem(selectedMedia) ? "video" : "image";

            link.href = objectUrl;
            link.download = `${safeTitle}-${mediaType}-${selectedIndex + 1}.${extension}`;
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
        if (scale > 1) return;

        isDragging.current = true;
        setIsDraggingState(true);
        isSwipeTracking.current = false;
        setIsSwipeTrackingState(false);
        dragStartX.current = e.clientX;
        dragEndX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        
        dragEndX.current = e.clientX;
        const dx = e.clientX - dragStartX.current;
        
        if (!isSwipeTracking.current && Math.abs(dx) > 5) {
            isSwipeTracking.current = true;
            setIsSwipeTrackingState(true);
        }

        if (isSwipeTracking.current) {
            let visualX = dx;
            if ((selectedIndex === 0 && dx > 0) || (selectedIndex === media.length - 1 && dx < 0)) {
                visualX = dx * 0.3;
            }
            setTranslate({ x: visualX, y: 0 });
        }
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        setIsDraggingState(false);

        if (isSwipeTracking.current) {
            const deltaX = dragStartX.current - dragEndX.current;
            const DRAG_DISTANCE = 70;

            if (deltaX > DRAG_DISTANCE && selectedIndex < media.length - 1) {
                nextImage();
            } else if (deltaX < -DRAG_DISTANCE && selectedIndex > 0) {
                previousImage();
            }
            
            setTranslate({ x: 0, y: 0 });
            isSwipeTracking.current = false;
            setIsSwipeTrackingState(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (lightboxRef.current) {
            lightboxRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isTouchDevice =
            window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

        if (!isTouchDevice || media.length <= 1) return;

        const hintTimer = setTimeout(() => {
            setShowSwipeHint(true);
        }, 50);
        const timer = setTimeout(() => setShowSwipeHint(false), 1450);

        return () => {
            clearTimeout(hintTimer);
            clearTimeout(timer);
        };
    }, [media.length]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!selectedMedia || isVideoItem(selectedMedia)) {
                setImageLoading(false);
            } else {
                setImageLoading(true);
            }
        }, 0);

        if (selectedMedia && !isVideoItem(selectedMedia)) {
            const img = new Image();
            img.onload = () => setImageLoading(false);
            img.onerror = () => setImageLoading(false);
            img.src = selectedMedia.url;
        }

        return () => clearTimeout(timer);
    }, [selectedMedia]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "ArrowRight":
                    if (selectedIndex < media.length - 1) nextImage();
                    break;

                case "ArrowLeft":
                    if (selectedIndex > 0) previousImage();
                    break;

                case "Escape":
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else if (scale > 1) {
                        setScale(1);
                        setTranslate({ x: 0, y: 0 });
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
    }, [nextImage, previousImage, onClose, selectedIndex, media.length, scale]);

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

    // Reset scale/translate when changing index, and auto-play unmuted if it's a video
    useEffect(() => {
        const timer = setTimeout(() => {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
            setShowControls(true); // Always reveal controls when page changes
        }, 0);

        const video = videoRef.current;
        if (video && isVideoItem(selectedMedia)) {
            video.currentTime = 0;
            video.muted = false; // Play unmuted
            video.play().catch((err) => {
                console.log("Autoplay prevented by browser:", err);
            });

            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleTimeUpdate = () => setCurrentTime(video.currentTime);
            const handleDurationChange = () => setDuration(video.duration);
            const handleVolumeChange = () => setIsMuted(video.muted);

            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);
            video.addEventListener("timeupdate", handleTimeUpdate);
            video.addEventListener("durationchange", handleDurationChange);
            video.addEventListener("volumechange", handleVolumeChange);

            // Set initial state
            setIsPlaying(!video.paused);
            setCurrentTime(video.currentTime);
            setDuration(video.duration || 0);
            setIsMuted(video.muted);

            return () => {
                clearTimeout(timer);
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("pause", handlePause);
                video.removeEventListener("timeupdate", handleTimeUpdate);
                video.removeEventListener("durationchange", handleDurationChange);
                video.removeEventListener("volumechange", handleVolumeChange);
            };
        }

        return () => clearTimeout(timer);
    }, [selectedIndex, selectedMedia]);

    useEffect(() => {
        if (selectedIndex > 0) {
            const previous = media[selectedIndex - 1];
            if (previous && !isVideoItem(previous)) {
                const img = new Image();
                img.src = previous.url;
            }
        }

        if (selectedIndex < media.length - 1) {
            const next = media[selectedIndex + 1];
            if (next && !isVideoItem(next)) {
                const img = new Image();
                img.src = next.url;
            }
        }
    }, [selectedIndex, media]);

    if (!media || media.length === 0 || !selectedMedia) {
        return null;
    }

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
            <div 
                className={`
                    flex justify-end items-center gap-4 px-4 sm:px-6 py-3 pointer-events-auto relative z-50 shrink-0
                    transition-all duration-300 ease-in-out
                    ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}
                `}
            >
                {canDownload && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadMedia();
                        }}
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
                        <Download size={26} />
                    </button>
                )}

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                    }}
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
                        <Minimize2 size={26} />
                    ) : (
                        <Maximize2 size={26} />
                    )}
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
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
                    <X size={28} />
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
                    touch-none 
                "
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd} 
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
                            className={`
                                hidden
                                xl:flex
                                flex-col
                                items-center
                                pl-8
                                pr-6
                                py-2
                                h-[calc(100vh-120px)]
                                relative z-50
                                transition-all duration-300 ease-in-out
                                ${showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none"}
                            `}
                            onClick={(e) => e.stopPropagation()}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToImage(index);
                                        }}
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
                                            bg-slate-900
                                            ${
                                                selectedIndex === index
                                                    ? "border-white opacity-100 scale-105"
                                                    : "border-transparent opacity-45 hover:opacity-100 hover:border-white/40 hover:scale-105"
                                            }
                                        `}
                                    >
                                        {isVideoItem(item) ? (
                                            <>
                                                <video
                                                    src={item.url}
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    className="w-full h-full object-cover pointer-events-none"
                                                />

                                                <div
                                                    className="
                                                        absolute
                                                        inset-0
                                                        flex
                                                        items-center
                                                        justify-center
                                                        bg-black/30
                                                        pointer-events-none
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
                                                            shadow-md
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
                                                className="w-full h-full object-cover pointer-events-none"
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
                            pb-16
                            sm:pb-12
                        "
                    >
                        {/* Media Viewport (Carousel Track) */}
                        <div
                            className={`
                                relative
                                w-full
                                h-full
                                overflow-hidden
                                flex
                                items-center
                                justify-center
                                ${
                                    showSwipeHint
                                        ? "animate-[lightboxSwipeHint_1.3s_ease-in-out_1]"
                                        : ""
                                }
                            `}
                            style={{ touchAction: "none" }}
                            onClick={() => {
                                // Tapping background toggles controls
                                setShowControls(prev => !prev);
                                resetControlsTimeout();
                            }}
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

                            <div
                                className="w-full h-full flex flex-row"
                                style={{
                                    transform: `translateX(calc(-${selectedIndex * 100}% + ${translate.x}px))`,
                                    transition: (isDraggingState || isSwipeTrackingState || isInteractingZoom)
                                        ? "none"
                                        : "transform 0.33s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                    touchAction: "none",
                                }}
                            >
                                {media.map((item, index) => {
                                    // Lazy-render adjacent media items to avoid loading all images/videos at once
                                    const isRendered = Math.abs(index - selectedIndex) <= 1;
                                    const isVideo = isVideoItem(item);

                                    return (
                                        <div
                                            key={index}
                                            className="w-full h-full shrink-0 flex items-center justify-center relative select-none"
                                        >
                                            {isRendered ? (
                                                <div
                                                    style={index === selectedIndex ? {
                                                        transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                                                        transition: isInteractingZoom ? "none" : "transform 0.25s ease",
                                                        touchAction: "none",
                                                    } : {}}
                                                    onClick={(e) => {
                                                        // Prevent clicks on the media itself from bubbling and toggling UI
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    {imageLoading && index === selectedIndex && (
                                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                                                        </div>
                                                    )}

                                                    {!isVideo ? (
                                                        <img
                                                            src={item.url}
                                                            alt={memoryTitle ? `${memoryTitle} — photo ${index + 1}` : ""}
                                                            decoding="async"
                                                            onDoubleClick={toggleFullscreen}
                                                            onLoad={() => {
                                                                if (index === selectedIndex) setImageLoading(false);
                                                            }}
                                                            onError={() => {
                                                                if (index === selectedIndex) setImageLoading(false);
                                                            }}
                                                            draggable={false}
                                                            className={`
                                                                max-w-full
                                                                object-contain
                                                                transition-opacity
                                                                duration-300
                                                                select-none
                                                                ${isFullscreen 
                                                                    ? "max-h-screen max-w-screen w-screen h-screen" 
                                                                    : "max-h-[calc(100vh-140px)]"
                                                                }
                                                                ${imageLoading && index === selectedIndex ? "opacity-0" : "opacity-100"}
                                                            `}
                                                        />
                                                    ) : (
                                                        <div className="relative flex items-center justify-center max-w-full">
                                                            <video
                                                                ref={index === selectedIndex ? videoRef : null}
                                                                src={item.url}
                                                                playsInline
                                                                preload="metadata"
                                                                onLoadedData={() => {
                                                                    if (index === selectedIndex) setImageLoading(false);
                                                                }}
                                                                onWaiting={() => {
                                                                    if (index === selectedIndex) setImageLoading(true);
                                                                }}
                                                                onPlaying={() => {
                                                                    if (index === selectedIndex) setImageLoading(false);
                                                                }}
                                                                onError={() => {
                                                                    if (index === selectedIndex) setImageLoading(false);
                                                                }}
                                                                className={`
                                                                    object-contain
                                                                    rounded-lg
                                                                    max-w-full
                                                                    ${isFullscreen 
                                                                        ? "max-h-screen max-w-screen w-screen h-screen" 
                                                                        : "max-h-[calc(100vh-140px)]"
                                                                    }
                                                                `}
                                                            />

                                                            {/* Custom Video Controls Overlay (Selected Item Only) */}
                                                            {index === selectedIndex && (
                                                                <>
                                                                    {/* Center Play/Pause Indicator Button */}
                                                                    <div 
                                                                        className={`
                                                                            absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none transition-opacity duration-300
                                                                            ${showControls ? "opacity-100" : "opacity-0"}
                                                                        `}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                togglePlay();
                                                                                resetControlsTimeout();
                                                                            }}
                                                                            className="pointer-events-auto p-4 rounded-full bg-black/50 text-white backdrop-blur-md hover:scale-110 active:scale-95 transition"
                                                                        >
                                                                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                                                        </button>
                                                                    </div>

                                                                    {/* Bottom Custom Playback Bar */}
                                                                    <div 
                                                                        className={`
                                                                            absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 pointer-events-auto border border-white/10 transition-all duration-300
                                                                            ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
                                                                        `}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <div className="flex items-center gap-3 w-full">
                                                                            <input
                                                                                type="range"
                                                                                min={0}
                                                                                max={duration || 100}
                                                                                value={currentTime}
                                                                                onChange={(e) => {
                                                                                    const time = parseFloat(e.target.value);
                                                                                    if (videoRef.current) {
                                                                                        videoRef.current.currentTime = time;
                                                                                    }
                                                                                    setCurrentTime(time);
                                                                                    resetControlsTimeout();
                                                                                }}
                                                                                className="flex-1 accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                                                            />
                                                                        </div>
                                                                        <div className="flex justify-between items-center text-white text-xs">
                                                                            <div className="flex items-center gap-4">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        togglePlay();
                                                                                        resetControlsTimeout();
                                                                                    }}
                                                                                    className="hover:opacity-80 transition"
                                                                                >
                                                                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (videoRef.current) {
                                                                                            videoRef.current.muted = !videoRef.current.muted;
                                                                                        }
                                                                                        resetControlsTimeout();
                                                                                    }}
                                                                                    className="hover:opacity-80 transition"
                                                                                >
                                                                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                                                </button>
                                                                                <span>
                                                                                    {formatTime(currentTime)} / {formatTime(duration)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Navigation & Counter */}
                        {!isFullscreen && (
                            <div
                                className={`
                                    absolute
                                    bottom-2
                                    left-0
                                    right-0
                                    z-10
                                    flex
                                    flex-col
                                    items-center
                                    gap-2
                                    pointer-events-none
                                    transition-all duration-300 ease-in-out
                                    ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
                                `}
                            >
                                {!isVideoItem(selectedMedia) && (
                                    <div className="flex items-center justify-center gap-10 sm:gap-16 md:gap-20 pointer-events-auto relative z-50">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (selectedIndex > 0) previousImage();
                                            }}
                                            disabled={selectedIndex === 0}
                                            aria-label="Previous media"
                                            className={`
                                                transition
                                                duration-200
                                                cursor-pointer
                                                bg-black/40
                                                p-2
                                                rounded-full
                                                backdrop-blur-sm
                                                ${
                                                    selectedIndex === 0
                                                        ? "opacity-20 cursor-not-allowed"
                                                        : "text-white hover:text-white/70 hover:bg-black/60"
                                                }
                                            `}
                                        >
                                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (selectedIndex < media.length - 1) nextImage();
                                            }}
                                            disabled={selectedIndex === media.length - 1}
                                            aria-label="Next media"
                                            className={`
                                                transition
                                                duration-200
                                                cursor-pointer
                                                bg-black/40
                                                p-2
                                                rounded-full
                                                backdrop-blur-sm
                                                ${
                                                    selectedIndex === media.length - 1
                                                        ? "opacity-20 cursor-not-allowed"
                                                        : "text-white hover:text-white/70 hover:bg-black/60"
                                                }
                                            `}
                                        >
                                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </button>
                                    </div>
                                )}

                                <div
                                    className="
                                        rounded-full
                                        border
                                        border-white/20
                                        bg-black/60
                                        px-4
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-white
                                        backdrop-blur-md
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
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
    RotateCcw,
} from "lucide-react";

import { useEffect, useRef, useState, useCallback } from "react";

// ==========================================
// LIGHTBOX COMPONENT (IMMERSIVE FULLSCREEN & FOCAL POINT ZOOM)
// ==========================================
/**
 * Renders an immersive full-screen media lightbox viewer supporting images and videos:
 * - True 100% full-bleed media display in fullscreen mode without layout displacement.
 * - Controls hidden by default in fullscreen; tapping reveals small floating glassmorphic buttons.
 * - Instagram Stories-style focal point pinch-to-zoom and mouse wheel zoom to cursor.
 * - Double-tap / double-click coordinate zoom for both photos and videos.
 * - 60fps fluid panning, swipe carousel navigation, keyboard shortcuts, and video playback.
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
    const videoRef = useRef(null);
    const lightboxRef = useRef(null);
    const activeMediaContainerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ==========================================
    // ZOOM & PAN STATE (Focal Point Math)
    // ==========================================
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isInteractingZoom, setIsInteractingZoom] = useState(false);
    
    // Carousel swipe offset (only active when scale === 1)
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwipingState, setIsSwipingState] = useState(false);

    // Touch gesture tracking refs
    const pinchRef = useRef(null);
    const panStartRef = useRef({ x: 0, y: 0, initialTranslate: { x: 0, y: 0 } });
    const isPanningRef = useRef(false);
    const hadMultiTouchRef = useRef(false);
    const touchStartPosRef = useRef({ x: 0, y: 0, time: 0 });
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
    const isSwipeTrackingRef = useRef(false);
    const swipeStartXRef = useRef(0);
    const swipeEndXRef = useRef(0);

    // Mouse drag & pan tracking refs
    const isMouseDraggingRef = useRef(false);
    const mousePanStartRef = useRef({ x: 0, y: 0, initialTranslate: { x: 0, y: 0 } });
    const mouseDragStartXRef = useRef(0);
    const [isMouseDownState, setIsMouseDownState] = useState(false);

    // One-time swipe hint for first-time mobile users
    const [showSwipeHint, setShowSwipeHint] = useState(false);

    // Toggle-able UI overlays controls state (Hidden by default in fullscreen)
    const [showControls, setShowControls] = useState(true);
    const tapTimer = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Custom video playback states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // Auto-hide controls timer (3s) when controls are shown or video is playing
    const resetControlsTimeout = useCallback(() => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isFullscreen || (isVideoItem(selectedMedia) && isPlaying)) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isFullscreen, selectedMedia, isPlaying]);

    const showControlsTemporarily = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

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

    // ==========================================
    // HELPER: Focal Point & Boundary Calculations
    // ==========================================
    const MIN_SCALE = 1;
    const MAX_SCALE = 5;
    const DOUBLE_TAP_ZOOM = 2.5;

    const getTouchDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    };

    const getTouchMidpoint = (touches) => ({
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const getContainerRect = () => {
        if (activeMediaContainerRef.current) {
            return activeMediaContainerRef.current.getBoundingClientRect();
        }
        return {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    };

    const getMaxTranslate = (targetScale) => {
        if (targetScale <= 1) return { maxX: 0, maxY: 0 };
        const rect = getContainerRect();
        const maxX = Math.max(0, (rect.width * (targetScale - 1)) / 2);
        const maxY = Math.max(0, (rect.height * (targetScale - 1)) / 2);
        return { maxX, maxY };
    };

    const clampTranslate = (tx, ty, targetScale) => {
        const { maxX, maxY } = getMaxTranslate(targetScale);
        return {
            x: Math.min(Math.max(tx, -maxX), maxX),
            y: Math.min(Math.max(ty, -maxY), maxY),
        };
    };

    const resetZoom = useCallback(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        setIsInteractingZoom(false);
    }, []);

    // Zoom into a specific screen coordinate (focalX, focalY)
    const zoomToCoordinate = (targetScale, screenX, screenY) => {
        const rect = getContainerRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        if (targetScale <= 1) {
            resetZoom();
            return;
        }

        const clampedScale = Math.min(Math.max(targetScale, MIN_SCALE), MAX_SCALE);
        const focalX = screenX - centerX;
        const focalY = screenY - centerY;

        // Formula: T_new = T_current - focal * (scale_new - scale_current)
        const newTx = translate.x - focalX * (clampedScale - scale);
        const newTy = translate.y - focalY * (clampedScale - scale);

        const clamped = clampTranslate(newTx, newTy, clampedScale);
        setScale(clampedScale);
        setTranslate(clamped);
        setIsInteractingZoom(false);
    };

    // ==========================================
    // TOUCH EVENT HANDLERS (Pinch-to-zoom at focal point)
    // ==========================================
    const handleTouchStart = (event) => {
        // --- TWO FINGER PINCH START ---
        if (event.touches.length === 2) {
            hadMultiTouchRef.current = true;
            const distance = getTouchDistance(event.touches);
            const midpoint = getTouchMidpoint(event.touches);
            const rect = getContainerRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            pinchRef.current = {
                startDistance: distance,
                startScale: scale,
                startTranslate: { ...translate },
                startMidpoint: midpoint,
                focalPoint: {
                    x: midpoint.x - centerX,
                    y: midpoint.y - centerY,
                },
            };

            isPanningRef.current = false;
            setIsInteractingZoom(true);
            return;
        }

        // --- SINGLE FINGER TOUCH START ---
        if (event.touches.length === 1) {
            hadMultiTouchRef.current = false;
            const t = event.touches[0];
            touchStartPosRef.current = {
                x: t.clientX,
                y: t.clientY,
                time: Date.now(),
            };

            if (scale > 1.05) {
                // When zoomed in, 1 finger pans the image
                isPanningRef.current = true;
                setIsInteractingZoom(true);
                panStartRef.current = {
                    x: t.clientX,
                    y: t.clientY,
                    initialTranslate: { ...translate },
                };
                return;
            }

            // When at 1x scale, prepare for carousel swipe
            isSwipeTrackingRef.current = false;
            setIsSwipingState(false);
            swipeStartXRef.current = t.clientX;
            swipeEndXRef.current = t.clientX;
        }
    };

    const handleTouchMove = (event) => {
        // --- TWO FINGER PINCH MOVE (Focal Point Zoom + 2-Finger Drag) ---
        if (event.touches.length === 2 && pinchRef.current) {
            const currentDistance = getTouchDistance(event.touches);
            const currentMidpoint = getTouchMidpoint(event.touches);

            const ratio = currentDistance / pinchRef.current.startDistance;
            const newScale = Math.min(
                Math.max(pinchRef.current.startScale * ratio, 0.75),
                MAX_SCALE * 1.3
            );

            const focalX = pinchRef.current.focalPoint.x;
            const focalY = pinchRef.current.focalPoint.y;
            const scaleDiff = newScale - pinchRef.current.startScale;
            const panDeltaX = currentMidpoint.x - pinchRef.current.startMidpoint.x;
            const panDeltaY = currentMidpoint.y - pinchRef.current.startMidpoint.y;

            const newTx = pinchRef.current.startTranslate.x - focalX * scaleDiff + panDeltaX;
            const newTy = pinchRef.current.startTranslate.y - focalY * scaleDiff + panDeltaY;

            setScale(newScale);
            setTranslate({ x: newTx, y: newTy });
            return;
        }

        // --- SINGLE FINGER PAN (When Zoomed In) ---
        if (event.touches.length === 1 && scale > 1.05 && isPanningRef.current) {
            const t = event.touches[0];
            const dx = t.clientX - panStartRef.current.x;
            const dy = t.clientY - panStartRef.current.y;

            const targetTx = panStartRef.current.initialTranslate.x + dx;
            const targetTy = panStartRef.current.initialTranslate.y + dy;

            const { maxX, maxY } = getMaxTranslate(scale);
            let finalTx = targetTx;
            let finalTy = targetTy;

            if (targetTx > maxX) finalTx = maxX + (targetTx - maxX) * 0.35;
            else if (targetTx < -maxX) finalTx = -maxX + (targetTx + maxX) * 0.35;

            if (targetTy > maxY) finalTy = maxY + (targetTy - maxY) * 0.35;
            else if (targetTy < -maxY) finalTy = -maxY + (targetTy + maxY) * 0.35;

            setTranslate({ x: finalTx, y: finalTy });
            return;
        }

        // --- SINGLE FINGER CAROUSEL SWIPE (When scale === 1) ---
        if (event.touches.length === 1 && scale <= 1.05) {
            const t = event.touches[0];
            const dx = t.clientX - touchStartPosRef.current.x;
            const dy = t.clientY - touchStartPosRef.current.y;

            if (!isSwipeTrackingRef.current && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
                isSwipeTrackingRef.current = true;
                setIsSwipingState(true);
            }

            if (isSwipeTrackingRef.current) {
                let visualX = dx;
                if ((selectedIndex === 0 && dx > 0) || (selectedIndex === media.length - 1 && dx < 0)) {
                    visualX = dx * 0.35;
                }
                setSwipeOffset(visualX);
            }

            swipeEndXRef.current = t.clientX;
        }
    };

    const handleTouchEnd = (event) => {
        // If one finger remains after pinch, smoothly transition to 1-finger pan
        if (event.touches.length === 1) {
            const remaining = event.touches[0];
            pinchRef.current = null;
            if (scale > 1.05) {
                isPanningRef.current = true;
                panStartRef.current = {
                    x: remaining.clientX,
                    y: remaining.clientY,
                    initialTranslate: { ...translate },
                };
            }
            return;
        }

        const wasPinching = pinchRef.current !== null;
        pinchRef.current = null;
        isPanningRef.current = false;
        setIsInteractingZoom(false);

        // Snap back to 1x if scale dropped below 1.05
        if (scale < 1.05) {
            resetZoom();
        } else {
            const clamped = clampTranslate(translate.x, translate.y, scale);
            setTranslate(clamped);
        }

        // --- TAP / DOUBLE TAP HANDLING ---
        if (!hadMultiTouchRef.current && !wasPinching) {
            const endTouch = event.changedTouches && event.changedTouches[0];
            if (endTouch) {
                const movedX = Math.abs(endTouch.clientX - touchStartPosRef.current.x);
                const movedY = Math.abs(endTouch.clientY - touchStartPosRef.current.y);
                const TAP_MOVE_THRESHOLD = 12;

                if (movedX < TAP_MOVE_THRESHOLD && movedY < TAP_MOVE_THRESHOLD) {
                    const now = Date.now();
                    const DOUBLE_TAP_WINDOW = 300;

                    if (now - lastTapRef.current.time < DOUBLE_TAP_WINDOW) {
                        // DOUBLE TAP: Zoom into the tapped coordinate
                        if (tapTimer.current) clearTimeout(tapTimer.current);
                        lastTapRef.current = { time: 0, x: 0, y: 0 };

                        if (scale > 1.05) {
                            resetZoom();
                        } else {
                            zoomToCoordinate(DOUBLE_TAP_ZOOM, endTouch.clientX, endTouch.clientY);
                        }
                        return;
                    } else {
                        // SINGLE TAP: Toggle action buttons overlay
                        lastTapRef.current = {
                            time: now,
                            x: endTouch.clientX,
                            y: endTouch.clientY,
                        };

                        if (tapTimer.current) clearTimeout(tapTimer.current);
                        tapTimer.current = setTimeout(() => {
                            if (showControls) {
                                setShowControls(false);
                            } else {
                                showControlsTemporarily();
                            }
                        }, DOUBLE_TAP_WINDOW);
                    }
                }
            }
        }

        // --- SWIPE CAROUSEL RELEASE ---
        if (isSwipeTrackingRef.current && scale <= 1.05) {
            const deltaX = swipeStartXRef.current - swipeEndXRef.current;
            const SWIPE_THRESHOLD = 50;

            if (deltaX > SWIPE_THRESHOLD && selectedIndex < media.length - 1) {
                nextImage();
            } else if (deltaX < -SWIPE_THRESHOLD && selectedIndex > 0) {
                previousImage();
            }

            setSwipeOffset(0);
            isSwipeTrackingRef.current = false;
            setIsSwipingState(false);
        }
    };

    // ==========================================
    // MOUSE EVENT HANDLERS (Wheel Zoom to cursor & Drag to pan)
    // ==========================================
    const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const zoomFactor = Math.exp(-e.deltaY * 0.003);
        const newScale = Math.min(Math.max(scale * zoomFactor, MIN_SCALE), MAX_SCALE);

        if (newScale <= 1.02) {
            resetZoom();
            return;
        }

        const rect = getContainerRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const focalX = e.clientX - centerX;
        const focalY = e.clientY - centerY;

        const newTx = translate.x - focalX * (newScale - scale);
        const newTy = translate.y - focalY * (newScale - scale);

        const clamped = clampTranslate(newTx, newTy, newScale);
        setIsInteractingZoom(true);
        setScale(newScale);
        setTranslate(clamped);

        if (panStartRef.current.wheelTimer) clearTimeout(panStartRef.current.wheelTimer);
        panStartRef.current.wheelTimer = setTimeout(() => {
            setIsInteractingZoom(false);
        }, 150);
    };

    const handleMouseDown = (e) => {
        if (e.target.closest("button") || e.target.closest("input")) return;

        setIsMouseDownState(true);

        if (scale > 1.05) {
            isMouseDraggingRef.current = true;
            setIsInteractingZoom(true);
            mousePanStartRef.current = {
                x: e.clientX,
                y: e.clientY,
                initialTranslate: { ...translate },
            };
            return;
        }

        isSwipeTrackingRef.current = false;
        setIsSwipingState(false);
        mouseDragStartXRef.current = e.clientX;
        swipeStartXRef.current = e.clientX;
        swipeEndXRef.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isMouseDownState) return;

        if (scale > 1.05 && isMouseDraggingRef.current) {
            const dx = e.clientX - mousePanStartRef.current.x;
            const dy = e.clientY - mousePanStartRef.current.y;

            const targetTx = mousePanStartRef.current.initialTranslate.x + dx;
            const targetTy = mousePanStartRef.current.initialTranslate.y + dy;

            const { maxX, maxY } = getMaxTranslate(scale);
            let finalTx = targetTx;
            let finalTy = targetTy;

            if (targetTx > maxX) finalTx = maxX + (targetTx - maxX) * 0.35;
            else if (targetTx < -maxX) finalTx = -maxX + (targetTx + maxX) * 0.35;

            if (targetTy > maxY) finalTy = maxY + (targetTy - maxY) * 0.35;
            else if (targetTy < -maxY) finalTy = -maxY + (targetTy + maxY) * 0.35;

            setTranslate({ x: finalTx, y: finalTy });
            return;
        }

        if (scale <= 1.05) {
            const dx = e.clientX - mouseDragStartXRef.current;
            if (!isSwipeTrackingRef.current && Math.abs(dx) > 6) {
                isSwipeTrackingRef.current = true;
                setIsSwipingState(true);
            }

            if (isSwipeTrackingRef.current) {
                let visualX = dx;
                if ((selectedIndex === 0 && dx > 0) || (selectedIndex === media.length - 1 && dx < 0)) {
                    visualX = dx * 0.35;
                }
                setSwipeOffset(visualX);
            }
            swipeEndXRef.current = e.clientX;
        }
    };

    const handleMouseUp = () => {
        setIsMouseDownState(false);

        if (isMouseDraggingRef.current) {
            isMouseDraggingRef.current = false;
            setIsInteractingZoom(false);
            const clamped = clampTranslate(translate.x, translate.y, scale);
            setTranslate(clamped);
            return;
        }

        if (isSwipeTrackingRef.current && scale <= 1.05) {
            const deltaX = swipeStartXRef.current - swipeEndXRef.current;
            const DRAG_DISTANCE = 60;

            if (deltaX > DRAG_DISTANCE && selectedIndex < media.length - 1) {
                nextImage();
            } else if (deltaX < -DRAG_DISTANCE && selectedIndex > 0) {
                previousImage();
            }

            setSwipeOffset(0);
            isSwipeTrackingRef.current = false;
            setIsSwipingState(false);
        }
    };

    const handleDoubleClick = (e) => {
        if (e.target.closest("button") || e.target.closest("input")) return;

        if (scale > 1.05) {
            resetZoom();
        } else {
            zoomToCoordinate(DOUBLE_TAP_ZOOM, e.clientX, e.clientY);
        }
    };

    // ==========================================
    // UTILITY ACTIONS (Download, Fullscreen, Shortcuts)
    // ==========================================
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
                setShowControls(false); // Action buttons default to not visible in fullscreen
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
            const isNowFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isNowFullscreen);
            if (isNowFullscreen) {
                setShowControls(false); // Default hide controls upon entering fullscreen
            } else {
                setShowControls(true);
            }
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
                    if (scale <= 1.05 && selectedIndex < media.length - 1) nextImage();
                    break;

                case "ArrowLeft":
                    if (scale <= 1.05 && selectedIndex > 0) previousImage();
                    break;

                case "Escape":
                    if (scale > 1.05) {
                        resetZoom();
                    } else if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        onClose();
                    }
                    break;

                case "f":
                case "F":
                    toggleFullscreen();
                    break;

                case "+":
                case "=":
                    setScale((prev) => Math.min(prev * 1.3, MAX_SCALE));
                    break;

                case "-":
                case "_":
                    setScale((prev) => {
                        const next = Math.max(prev / 1.3, MIN_SCALE);
                        if (next <= 1.05) {
                            setTranslate({ x: 0, y: 0 });
                            return 1;
                        }
                        return next;
                    });
                    break;

                case "0":
                    resetZoom();
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
    }, [nextImage, previousImage, onClose, selectedIndex, media.length, scale, resetZoom]);

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

    // Reset zoom & translation when changing slide
    useEffect(() => {
        const timer = setTimeout(() => {
            resetZoom();
            setSwipeOffset(0);
            if (!isFullscreen) {
                setShowControls(true);
            }
        }, 0);

        const video = videoRef.current;
        if (video && isVideoItem(selectedMedia)) {
            video.currentTime = 0;
            video.muted = false;
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
    }, [selectedIndex, selectedMedia, resetZoom, isFullscreen]);

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
                bg-black
                flex
                flex-col
                outline-none
                select-none
                overflow-hidden
            "
        >
            {/* Floating Top Control Overlay (Positioned in Corners, Never Affects Media Flow) */}
            <div 
                className={`
                    absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6
                    flex justify-between items-center z-50 pointer-events-none
                    transition-all duration-300 ease-in-out
                    ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
                `}
            >
                {/* Left: Zoom State & Reset Pill */}
                <div className="flex items-center gap-2">
                    {scale > 1.05 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                resetZoom();
                            }}
                            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold border border-white/20 transition-all cursor-pointer active:scale-95 shadow-xl animate-in fade-in zoom-in-95 duration-200"
                            title="Reset zoom to 100%"
                        >
                            <RotateCcw size={12} className="text-cyan-400" />
                            <span>{Math.round(scale * 100)}%</span>
                            <span className="hidden sm:inline text-white/70">• Reset</span>
                        </button>
                    )}
                </div>

                {/* Right: Small Floating Action Buttons (Small, Non-Intrusive, Glassmorphic) */}
                <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-black/55 backdrop-blur-md rounded-full p-1 sm:p-1.5 border border-white/15 shadow-2xl">
                    {canDownload && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadMedia();
                                showControlsTemporarily();
                            }}
                            aria-label="Download media"
                            className="
                                text-white/85
                                hover:text-white
                                p-1.5 sm:p-2
                                rounded-full
                                cursor-pointer
                                hover:bg-white/15
                                active:scale-95
                                transition
                            "
                            title="Download"
                        >
                            <Download size={17} className="sm:w-5 sm:h-5" />
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
                            text-white/85
                            hover:text-white
                            p-1.5 sm:p-2
                            rounded-full
                            cursor-pointer
                            hover:bg-white/15
                            active:scale-95
                            transition
                        "
                        title={
                            isFullscreen
                                ? "Exit Fullscreen"
                                : "Fullscreen"
                        }
                    >
                        {isFullscreen ? (
                            <Minimize2 size={17} className="sm:w-5 sm:h-5" />
                        ) : (
                            <Maximize2 size={17} className="sm:w-5 sm:h-5" />
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
                            text-white/85
                            hover:text-white
                            p-1.5 sm:p-2
                            rounded-full
                            cursor-pointer
                            hover:bg-white/15
                            active:scale-95
                            transition
                        "
                        title="Close"
                    >
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Body (True Full-Screen Immersive Canvas) */}
            <div
                className="
                    relative
                    w-full
                    h-full
                    flex-1
                    flex
                    items-center
                    justify-center
                    touch-none
                    overflow-hidden
                "
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    className="
                        relative
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                    "
                >
                    {/* Desktop Thumbnail Rail (Hidden when in Fullscreen) */}
                    {!isFullscreen && (
                        <div
                            className={`
                                hidden
                                xl:flex
                                flex-col
                                items-center
                                pl-6
                                pr-4
                                py-2
                                h-[calc(100vh-80px)]
                                absolute left-0 z-40
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
                                    gap-4
                                    overflow-y-auto
                                    overflow-x-visible
                                    py-2
                                    px-2
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
                                            w-20
                                            h-20
                                            rounded-xl
                                            overflow-hidden
                                            cursor-pointer
                                            border-2
                                            transition-all
                                            duration-300
                                            bg-slate-900
                                            ${
                                                selectedIndex === index
                                                    ? "border-white opacity-100 scale-105 shadow-xl"
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
                                                            h-6
                                                            w-6
                                                            rounded-full
                                                            bg-white/90
                                                            flex
                                                            items-center
                                                            justify-center
                                                            shadow-md
                                                        "
                                                    >
                                                        <Play
                                                            size={12}
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
                                    pt-3
                                    text-[10px]
                                    text-center
                                    text-white/40
                                    select-none
                                "
                            >
                                Scroll • Pinch • Zoom
                            </div>
                        </div>
                    )}

                    {/* Main Media Viewport */}
                    <div
                        ref={activeMediaContainerRef}
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
                            if (showControls) {
                                setShowControls(false);
                            } else {
                                showControlsTemporarily();
                            }
                        }}
                        onDoubleClick={handleDoubleClick}
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

                        {/* Outer Carousel Track (Sliding between items) */}
                        <div
                            className="w-full h-full flex flex-row"
                            style={{
                                transform: `translateX(calc(-${selectedIndex * 100}% + ${swipeOffset}px))`,
                                transition: (isSwipingState || isInteractingZoom)
                                    ? "none"
                                    : "transform 0.33s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                touchAction: "none",
                            }}
                        >
                            {media.map((item, index) => {
                                const isRendered = Math.abs(index - selectedIndex) <= 1;
                                const isVideo = isVideoItem(item);
                                const isCurrent = index === selectedIndex;

                                return (
                                    <div
                                        key={index}
                                        className="w-full h-full shrink-0 flex items-center justify-center relative select-none"
                                    >
                                        {isRendered ? (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={isCurrent ? {
                                                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                                                    transformOrigin: "center center",
                                                    transition: isInteractingZoom
                                                        ? "none"
                                                        : "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                                    touchAction: "none",
                                                    cursor: scale > 1.05
                                                        ? (isMouseDownState ? "grabbing" : "grab")
                                                        : "default",
                                                } : {}}
                                            >
                                                {imageLoading && isCurrent && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                                                    </div>
                                                )}

                                                {!isVideo ? (
                                                    <img
                                                        src={item.url}
                                                        alt={memoryTitle ? `${memoryTitle} — photo ${index + 1}` : ""}
                                                        decoding="async"
                                                        onLoad={() => {
                                                            if (isCurrent) setImageLoading(false);
                                                        }}
                                                        onError={() => {
                                                            if (isCurrent) setImageLoading(false);
                                                        }}
                                                        draggable={false}
                                                        className={`
                                                            max-w-full
                                                            max-h-full
                                                            w-auto
                                                            h-auto
                                                            object-contain
                                                            transition-opacity
                                                            duration-300
                                                            select-none
                                                            ${imageLoading && isCurrent ? "opacity-0" : "opacity-100"}
                                                        `}
                                                    />
                                                ) : (
                                                    <div className="relative flex items-center justify-center max-w-full max-h-full w-full h-full">
                                                        <video
                                                            ref={isCurrent ? videoRef : null}
                                                            src={item.url}
                                                            playsInline
                                                            preload="metadata"
                                                            onLoadedData={() => {
                                                                if (isCurrent) setImageLoading(false);
                                                            }}
                                                            onWaiting={() => {
                                                                if (isCurrent) setImageLoading(true);
                                                            }}
                                                            onPlaying={() => {
                                                                if (isCurrent) setImageLoading(false);
                                                            }}
                                                            onError={() => {
                                                                if (isCurrent) setImageLoading(false);
                                                            }}
                                                            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                                                        />

                                                        {/* Custom Video Controls Overlay (Selected Item Only) */}
                                                        {isCurrent && (
                                                            <>
                                                                {/* Center Play/Pause Indicator Button */}
                                                                <div 
                                                                    className={`
                                                                        absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none transition-opacity duration-300
                                                                        ${showControls && scale <= 1.2 ? "opacity-100" : "opacity-0"}
                                                                    `}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            togglePlay();
                                                                            showControlsTemporarily();
                                                                        }}
                                                                        className="pointer-events-auto p-3.5 sm:p-4 rounded-full bg-black/60 text-white backdrop-blur-md hover:scale-110 active:scale-95 transition cursor-pointer border border-white/20 shadow-xl"
                                                                    >
                                                                        {isPlaying ? <Pause size={28} className="sm:w-8 sm:h-8" /> : <Play size={28} className="sm:w-8 sm:h-8 ml-0.5" />}
                                                                    </button>
                                                                </div>

                                                                {/* Bottom Custom Playback Bar */}
                                                                <div 
                                                                    className={`
                                                                        absolute bottom-6 sm:bottom-8 left-4 sm:left-12 right-4 sm:right-12 bg-black/70 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2 pointer-events-auto border border-white/15 shadow-2xl transition-all duration-300
                                                                        ${showControls && scale <= 1.2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
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
                                                                                showControlsTemporarily();
                                                                            }}
                                                                            className="flex-1 accent-white h-1 bg-white/25 rounded-lg appearance-none cursor-pointer"
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-white text-xs font-medium">
                                                                        <div className="flex items-center gap-3 sm:gap-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    togglePlay();
                                                                                    showControlsTemporarily();
                                                                                }}
                                                                                className="hover:opacity-80 transition cursor-pointer"
                                                                            >
                                                                                {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (videoRef.current) {
                                                                                        videoRef.current.muted = !videoRef.current.muted;
                                                                                    }
                                                                                    showControlsTemporarily();
                                                                                }}
                                                                                className="hover:opacity-80 transition cursor-pointer"
                                                                            >
                                                                                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                                                                            </button>
                                                                            <span className="text-[11px] sm:text-xs text-white/80">
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

                    {/* Floating Bottom Navigation & Counter (Non-Intrusive Overlay) */}
                    <div
                        className={`
                            absolute
                            bottom-4 sm:bottom-6
                            left-0
                            right-0
                            z-30
                            flex
                            flex-col
                            items-center
                            gap-2.5
                            pointer-events-none
                            transition-all duration-300 ease-in-out
                            ${showControls && scale <= 1.05 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
                        `}
                    >
                        {!isVideoItem(selectedMedia) && (
                            <div className="flex items-center justify-center gap-12 sm:gap-20 pointer-events-auto">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedIndex > 0) previousImage();
                                        showControlsTemporarily();
                                    }}
                                    disabled={selectedIndex === 0}
                                    aria-label="Previous media"
                                    className={`
                                        transition
                                        duration-200
                                        cursor-pointer
                                        bg-black/50
                                        p-2 sm:p-2.5
                                        rounded-full
                                        backdrop-blur-md
                                        border border-white/15
                                        shadow-xl
                                        ${
                                            selectedIndex === 0
                                                ? "opacity-20 cursor-not-allowed"
                                                : "text-white hover:text-white hover:bg-black/80 active:scale-95"
                                        }
                                    `}
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedIndex < media.length - 1) nextImage();
                                        showControlsTemporarily();
                                    }}
                                    disabled={selectedIndex === media.length - 1}
                                    aria-label="Next media"
                                    className={`
                                        transition
                                        duration-200
                                        cursor-pointer
                                        bg-black/50
                                        p-2 sm:p-2.5
                                        rounded-full
                                        backdrop-blur-md
                                        border border-white/15
                                        shadow-xl
                                        ${
                                            selectedIndex === media.length - 1
                                                ? "opacity-20 cursor-not-allowed"
                                                : "text-white hover:text-white hover:bg-black/80 active:scale-95"
                                        }
                                    `}
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        )}

                        <div
                            className="
                                rounded-full
                                border
                                border-white/20
                                bg-black/60
                                px-3.5
                                py-1
                                text-[11px] sm:text-xs
                                font-semibold
                                text-white
                                backdrop-blur-md
                                pointer-events-auto
                                shadow-lg
                            "
                        >
                            {selectedIndex + 1} / {media.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;
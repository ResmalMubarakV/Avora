import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, ZoomIn } from "lucide-react";

const CROP_SIZE = 288; // on-screen crop viewport, in px
const OUTPUT_SIZE = 512; // exported square image size, in px

const AvatarCropModal = ({ file, onCancel, onSave }) => {

    const imgRef = useRef(null);

    const [imageUrl, setImageUrl] = useState("");
    const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [saving, setSaving] = useState(false);

    const dragState = useRef({
        dragging: false,
        startX: 0,
        startY: 0,
        startOffsetX: 0,
        startOffsetY: 0,
    });

    // Load the selected file as an object URL for previewing

    useEffect(() => {

        const url = URL.createObjectURL(file);
        setImageUrl(url);

        return () => URL.revokeObjectURL(url);

    }, [file]);

    const baseScale =
        naturalSize.w && naturalSize.h
            ? Math.max(
                  CROP_SIZE / naturalSize.w,
                  CROP_SIZE / naturalSize.h
              )
            : 0;

    const displayScale = baseScale * zoom;

    const displayWidth = naturalSize.w * displayScale;
    const displayHeight = naturalSize.h * displayScale;

    // Keep the image covering the crop viewport at all times

    const clampOffset = useCallback(
        (x, y, width = displayWidth, height = displayHeight) => {

            const minX = CROP_SIZE - width;
            const minY = CROP_SIZE - height;

            return {
                x: Math.min(0, Math.max(minX, x)),
                y: Math.min(0, Math.max(minY, y)),
            };

        },
        [displayWidth, displayHeight]
    );

    const handleImageLoad = () => {

        const img = imgRef.current;
        if (!img) return;

        const w = img.naturalWidth;
        const h = img.naturalHeight;

        setNaturalSize({ w, h });

        const scale = Math.max(CROP_SIZE / w, CROP_SIZE / h);

        const dw = w * scale;
        const dh = h * scale;

        setOffset({
            x: (CROP_SIZE - dw) / 2,
            y: (CROP_SIZE - dh) / 2,
        });

        setZoom(1);

    };

    const handlePointerDown = (e) => {

        dragState.current = {
            dragging: true,
            startX: e.clientX,
            startY: e.clientY,
            startOffsetX: offset.x,
            startOffsetY: offset.y,
        };

        e.currentTarget.setPointerCapture?.(e.pointerId);

    };

    const handlePointerMove = (e) => {

        if (!dragState.current.dragging) return;

        const dx = e.clientX - dragState.current.startX;
        const dy = e.clientY - dragState.current.startY;

        setOffset(
            clampOffset(
                dragState.current.startOffsetX + dx,
                dragState.current.startOffsetY + dy
            )
        );

    };

    const handlePointerUp = () => {
        dragState.current.dragging = false;
    };

    const handleZoomChange = (e) => {

        const nextZoom = Number(e.target.value);

        const nextDisplayScale = baseScale * nextZoom;
        const nextWidth = naturalSize.w * nextDisplayScale;
        const nextHeight = naturalSize.h * nextDisplayScale;

        // Zoom toward the current crop center rather than the image corner

        const centerX = offset.x - (nextWidth - displayWidth) / 2;
        const centerY = offset.y - (nextHeight - displayHeight) / 2;

        setZoom(nextZoom);

        setOffset(
            clampOffset(centerX, centerY, nextWidth, nextHeight)
        );

    };

    const handleSave = () => {

        if (!imgRef.current || !naturalSize.w) return;

        setSaving(true);

        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;

        const ctx = canvas.getContext("2d");

        const sx = -offset.x / displayScale;
        const sy = -offset.y / displayScale;
        const sSize = CROP_SIZE / displayScale;

        ctx.drawImage(
            imgRef.current,
            sx,
            sy,
            sSize,
            sSize,
            0,
            0,
            OUTPUT_SIZE,
            OUTPUT_SIZE
        );

        canvas.toBlob(
            (blob) => {

                setSaving(false);

                if (!blob) return;

                const croppedFile = new File(
                    [blob],
                    "avatar.jpg",
                    { type: "image/jpeg" }
                );

                onSave(croppedFile);

            },
            "image/jpeg",
            0.92
        );

    };

    return (

        <div
            className="
                fixed
                inset-0
                z-[70]
                flex
                items-center
                justify-center
                bg-black/60
                backdrop-blur-sm
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-sm
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-2xl
                "
            >

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Adjust Photo
                    </h2>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        aria-label="Cancel crop"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <X size={18} />
                    </button>

                </div>

                <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                        width: CROP_SIZE,
                        height: CROP_SIZE,
                        touchAction: "none",
                    }}
                    className="
                        relative
                        mx-auto
                        overflow-hidden
                        rounded-2xl
                        bg-slate-100
                        cursor-grab
                        active:cursor-grabbing
                        select-none
                    "
                >

                    {imageUrl && (
                        <img
                            ref={imgRef}
                            src={imageUrl}
                            onLoad={handleImageLoad}
                            draggable={false}
                            alt="Crop preview"
                            style={{
                                position: "absolute",
                                left: offset.x,
                                top: offset.y,
                                width: displayWidth || "auto",
                                height: displayHeight || "auto",
                                maxWidth: "none",
                            }}
                        />
                    )}

                    {/* Circular crop guide — darkens everything outside the circle */}

                    <div
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{
                            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.45)",
                        }}
                    />

                    <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/80" />

                </div>

                <p className="mt-3 text-center text-xs text-slate-400">
                    Drag to reposition • Use the slider to zoom
                </p>

                <div className="mt-4 flex items-center gap-3">

                    <ZoomIn size={18} className="shrink-0 text-slate-400" />

                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.01"
                        value={zoom}
                        onChange={handleZoomChange}
                        className="
                            h-1.5
                            w-full
                            cursor-pointer
                            appearance-none
                            rounded-full
                            bg-slate-200
                            accent-[#3559D4]
                        "
                    />

                </div>

                <div className="mt-7 flex gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="
                            flex-1
                            rounded-xl
                            border
                            border-slate-200
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="
                            flex-1
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#3559D4]
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#1E3A8A]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <Check size={16} />
                        {saving ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default AvatarCropModal;
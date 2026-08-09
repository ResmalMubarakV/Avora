import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";

const VIEWPORT_WIDTH = 320;
const VIEWPORT_HEIGHT = 180; // 16:9 Aspect Ratio
const OUTPUT_WIDTH = 1280;
const OUTPUT_HEIGHT = 720;

// ==========================================
// COVER CROP MODAL COMPONENT
// ==========================================
const CoverCropModal = ({ file, onCancel, onSave }) => {
  const imgRef = useRef(null);

  const [imageUrl, setImageUrl] = useState("");
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale =
    naturalSize.w && naturalSize.h
      ? Math.max(
          VIEWPORT_WIDTH / naturalSize.w,
          VIEWPORT_HEIGHT / naturalSize.h
        )
      : 0;

  const displayScale = baseScale * zoom;
  const displayWidth = naturalSize.w * displayScale;
  const displayHeight = naturalSize.h * displayScale;

  const clampOffset = useCallback(
    (x, y, width = displayWidth, height = displayHeight) => {
      const minX = Math.min(0, VIEWPORT_WIDTH - width);
      const minY = Math.min(0, VIEWPORT_HEIGHT - height);
      const maxX = Math.max(0, VIEWPORT_WIDTH - width);
      const maxY = Math.max(0, VIEWPORT_HEIGHT - height);

      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
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

    const scaleFitW = VIEWPORT_WIDTH / w;
    const scaleFitH = VIEWPORT_HEIGHT / h;
    const initialZoom = Math.max(scaleFitW, scaleFitH) / Math.max(scaleFitW, scaleFitH); 
    const absoluteMinZoom = Math.min(scaleFitW / baseScale, scaleFitH / baseScale);

    setMinZoom(Math.max(0.5, absoluteMinZoom));
    setZoom(1);

    const dw = w * baseScale;
    const dh = h * baseScale;

    setOffset({
      x: (VIEWPORT_WIDTH - dw) / 2,
      y: (VIEWPORT_HEIGHT - dh) / 2,
    });
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

    const viewCenterX = VIEWPORT_WIDTH / 2;
    const viewCenterY = VIEWPORT_HEIGHT / 2;
    const nextX = viewCenterX - (viewCenterX - offset.x) * (nextWidth / displayWidth);
    const nextY = viewCenterY - (viewCenterY - offset.y) * (nextHeight / displayHeight);

    setZoom(nextZoom);
    setOffset(clampOffset(nextX, nextY, nextWidth, nextHeight));
  };

  const handleSave = () => {
    if (!imgRef.current || !naturalSize.w) return;
    setSaving(true);

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    const sx = -offset.x / displayScale;
    const sy = -offset.y / displayScale;
    const sWidth = VIEWPORT_WIDTH / displayScale;
    const sHeight = VIEWPORT_HEIGHT / displayScale;

    ctx.drawImage(
      imgRef.current,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      OUTPUT_WIDTH,
      OUTPUT_HEIGHT
    );

    canvas.toBlob(
      (blob) => {
        setSaving(false);
        if (!blob) return;
        const croppedFile = new File([blob], "cover.jpg", { type: "image/jpeg" });
        onSave(croppedFile);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Crop Cover Image</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
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
            width: VIEWPORT_WIDTH,
            height: VIEWPORT_HEIGHT,
            touchAction: "none",
          }}
          className="relative mx-auto overflow-hidden rounded-xl bg-slate-900 cursor-grab active:cursor-grabbing select-none shadow-inner"
        >
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              onLoad={handleImageLoad}
              draggable={false}
              alt="Cover crop preview"
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
          <div className="pointer-events-none absolute inset-0 border border-white/40" />
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Drag to frame your desired section • Use slider to zoom in & out
        </p>

        <div className="mt-4 flex items-center gap-3">
          <ZoomOut size={16} className="shrink-0 text-slate-400" />
          <input
            type="range"
            min={minZoom}
            max="3"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#3559D4]"
          />
          <ZoomIn size={16} className="shrink-0 text-slate-400" />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3559D4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E3A8A] cursor-pointer"
          >
            <Check size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverCropModal;
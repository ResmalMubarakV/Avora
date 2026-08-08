import { ImagePlus, Trash2, RefreshCw, ZoomIn, ZoomOut, Check, Move } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

// ==========================================
// COVER UPLOADER COMPONENT (EDIT PROFILE)
// ==========================================
/**
 * File upload, preview, and interactive adjustment component for profile cover images.
 * Features pixel-translate panning with automated boundary clamping and zoom capabilities,
 * matching the Create Memory cover uploader behavior (adjusting only when explicit edit/reposition is clicked).
 */
const CoverUploader = ({
  formData,
  setFormData,
}) => {
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // --- Adjustment States ---
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const scale = formData.coverScale || 1;
  const position = formData.coverPosition || { x: 0, y: 0 };

  // --- Helper to clamp position so image never exposes blank borders ---
  const clampPosition = (x, y, currentScale) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const maxX = (width * (currentScale - 1)) / 2;
    const maxY = (height * (currentScale - 1)) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const setScale = (newScaleOrUpdater) => {
    setFormData((prev) => {
      const current = prev.coverScale || 1;
      const rawUpdated = typeof newScaleOrUpdater === "function" ? newScaleOrUpdater(current) : newScaleOrUpdater;
      const updatedScale = Math.max(1, Math.min(3, rawUpdated));
      
      const clampedPos = clampPosition(prev.coverPosition?.x || 0, prev.coverPosition?.y || 0, updatedScale);

      return {
        ...prev,
        coverScale: updatedScale,
        coverPosition: clampedPos,
      };
    });
  };

  const setPosition = (newPosOrUpdater) => {
    setFormData((prev) => {
      const current = prev.coverPosition || { x: 0, y: 0 };
      const rawNewPos = typeof newPosOrUpdater === "function" ? newPosOrUpdater(current) : newPosOrUpdater;
      const currentScale = prev.coverScale || 1;

      const clamped = clampPosition(rawNewPos.x, rawNewPos.y, currentScale);

      return { ...prev, coverPosition: clamped };
    });
  };

  // --- Generate Preview URL from File or Existing Cover URL ---
  const rawPreview = useMemo(() => {
    if (formData.coverImage) {
      return URL.createObjectURL(formData.coverImage);
    }
    return formData.existingCoverImage || formData.existingCover || null;
  }, [
    formData.coverImage,
    formData.existingCoverImage,
    formData.existingCover,
  ]);

  // Reset scale and position when a new image file is explicitly selected
  useEffect(() => {
    if (formData.coverImage && formData.coverScale === undefined) {
      setFormData((prev) => ({
        ...prev,
        coverScale: 1,
        coverPosition: { x: 0, y: 0 },
      }));
    }
  }, [formData.coverImage, setFormData]);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      coverImage: file,
      coverScale: 1,
      coverPosition: { x: 0, y: 0 },
    }));
    setIsAdjusting(false); // Starts false, requires explicit edit/reposition click
  };

  const removeCover = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      existingCoverImage: "",
      existingCover: "",
      coverScale: 1,
      coverPosition: { x: 0, y: 0 },
    }));
    setIsAdjusting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Drag / Pan Handlers (Guarded by isAdjusting) ---
  const handleMouseDown = (e) => {
    if (!isAdjusting) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isAdjusting || !isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    if (!isAdjusting) return;
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!isAdjusting || !e.touches[0]) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isAdjusting || !isDragging || !e.touches[0]) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    if (!isAdjusting) return;
    setIsDragging(false);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
            {rawPreview ? (isAdjusting ? "Adjust Cover Image" : "Cover Photo") : "Cover Photo"}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            {rawPreview
              ? isAdjusting
                ? "Drag to reposition and use controls to zoom."
                : "Personalize your profile with a customized cover image."
              : "Choose a beautiful cover that represents your profile."}
          </p>
        </div>

        {rawPreview && !isAdjusting && (
          <button
            type="button"
            onClick={() => setIsAdjusting(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            <Move size={14} />
            <span>Reposition</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverChange}
        className="hidden"
      />

      {!rawPreview ? (
        <div
          onClick={handleBrowse}
          className="group flex min-h-[200px] sm:min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all duration-300 hover:border-[#3559D4] hover:bg-blue-50/30"
        >
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3559D4] transition-all duration-300 group-hover:scale-110">
            <ImagePlus size={28} className="sm:w-8 sm:h-8" />
          </div>

          <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900">
            Upload Cover Image
          </h3>

          <p className="mt-1 max-w-xs text-xs sm:text-sm text-slate-500 leading-relaxed">
            Drag & drop your cover image here or click to browse.
          </p>

          <span className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800">
            Choose Image
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interactive Preview / Adjustment Box */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-900 aspect-video w-full select-none ${
              isAdjusting ? "cursor-grab active:cursor-grabbing ring-2 ring-[#3559D4]" : "cursor-default"
            }`}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={rawPreview}
                alt="Cover Preview"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
                className="h-full w-full object-cover pointer-events-none origin-center absolute inset-0"
              />
            </div>

            {isAdjusting && (
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/60 m-3 rounded-lg flex items-start justify-between p-3">
                <span className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                  Drag to pan • Zoom below
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdjusting(false);
                  }}
                  className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 cursor-pointer"
                >
                  <Check size={14} className="text-[#3559D4]" />
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Zoom and Adjust Toolbar */}
          {isAdjusting && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Zoom:</span>
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.max(1, prev - 0.1))}
                  className="rounded-lg bg-white p-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-bold text-slate-700 w-10 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
                  className="rounded-lg bg-white p-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Reset Position
              </button>
            </div>
          )}

          {/* Standard Actions Toolbar */}
          {!isAdjusting && (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsAdjusting(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                <ZoomIn size={15} />
                <span>Zoom & Reposition</span>
              </button>

              <button
                type="button"
                onClick={handleBrowse}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={removeCover}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-100/60 cursor-pointer"
              >
                <Trash2 size={15} />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverUploader;
import { useMemo, useEffect } from "react";
import {
  MapPin,
  CalendarDays,
  Plane,
  Globe,
  Lock,
} from "lucide-react";

// ==========================================
// LIVE PREVIEW COMPONENT
// ==========================================
const LivePreview = ({ formData }) => {
  const coverPreview = useMemo(() => {
    if (formData.coverImage) {
      return URL.createObjectURL(formData.coverImage);
    }
    return formData.existingCoverImage || formData.existingCover || null;
  }, [
    formData.coverImage,
    formData.existingCoverImage,
    formData.existingCover,
  ]);

  const scale = formData.coverScale || 1;
  const position = formData.coverPosition || { x: 0, y: 0 };
  const previewRatio = 0.45;

  useEffect(() => {
    return () => {
      if (coverPreview && formData.coverImage) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview, formData.coverImage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-3 shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">Live Preview</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Your memory updates as you type.
        </p>
      </div>

      {/* Memory Preview Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm flex-1 flex flex-col justify-between">
        <div>
          {/* Cover Image Container */}
          <div className="aspect-video overflow-hidden bg-slate-100 relative">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover Preview"
                style={{
                  transform: `translate(${position.x * previewRatio}px, ${position.y * previewRatio}px) scale(${scale})`,
                }}
                className="h-full w-full object-cover origin-center absolute inset-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
                Cover Image
              </div>
            )}
          </div>

          {/* Card Body & Details */}
          <div className="space-y-3 p-4">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
              {formData.title || "Memory Title"}
            </h4>

            {/* Metadata List */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{formData.location || "Location"}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-slate-400 shrink-0" />
                <span>
                  {formData.startDate || "Start Date"}
                  {" • "}
                  {formData.endDate || "End Date"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Plane size={14} className="text-slate-400 shrink-0" />
                <span>{formData.modeOfTravel || "Mode of Travel"}</span>
              </div>
            </div>

            {/* Description Excerpt */}
            {formData.description && (
              <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
                {formData.description}
              </p>
            )}

            {/* Gallery Thumbnails Grid (Up to 4 files) */}
            {formData.gallery && formData.gallery.length > 0 && (
              <div>
                <h5 className="mb-2 text-xs font-semibold text-slate-700">Gallery</h5>
                <div className="grid grid-cols-4 gap-1.5">
                  {formData.gallery.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square overflow-hidden rounded-lg bg-slate-100"
                    >
                      {item.type.startsWith("image") ? (
                        <img
                          src={item.preview}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.preview}
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {formData.gallery.length > 4 && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    +{formData.gallery.length - 4} more files
                  </p>
                )}
              </div>
            )}

            {/* Visibility Badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                formData.isPublic
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {formData.isPublic ? (
                <>
                  <Globe size={12} />
                  Public Memory
                </>
              ) : (
                <>
                  <Lock size={12} />
                  Private Memory
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
import {
  Images,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import {
  useEffect,
  useRef,
} from "react";

// ==========================================
// GALLERY UPLOADER COMPONENT
// ==========================================
/**
 * Gallery media uploader and preview component supporting multiple images and videos.
 * Styled with responsive grids for mobile, tablet, and desktop screens.
 */
const GalleryUploader = ({
  formData,
  setFormData,
  onDeleteExistingMedia,
}) => {
  const fileInputRef = useRef(null);

  const existingGallery = formData.existingGallery || [];
  const gallery = formData.gallery || [];

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // --- Upload New Files Handler ---
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const uploadedFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      file, // Store the native File instance explicitly here
      preview: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        ...uploadedFiles,
      ],
    }));

    e.target.value = "";
  };

  // --- Remove Newly Uploaded Media Item ---
  const removeMedia = (id) => {
    setFormData((prev) => {
      const media = prev.gallery.find((item) => item.id === id);
      if (media?.preview) {
        URL.revokeObjectURL(media.preview);
      }

      return {
        ...prev,
        gallery: prev.gallery.filter((item) => item.id !== id),
      };
    });
  };

  // --- Cleanup Object URLs on Unmount ---
  useEffect(() => {
    return () => {
      gallery.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [gallery]);

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-6 lg:p-8 shadow-sm transition-colors">
      {/* Header & Add More Action */}
      <div className="mb-5 sm:mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Gallery</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload your travel photos and videos.
          </p>
        </div>

        {(existingGallery.length > 0 || gallery.length > 0) && (
          <button
            type="button"
            onClick={handleBrowse}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800 dark:shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0"
          >
            <Plus size={16} />
            <span>Add More</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleGalleryChange}
        className="hidden"
      />

      {existingGallery.length === 0 && gallery.length === 0 ? (
        <div
          onClick={handleBrowse}
          className="group flex min-h-[200px] sm:min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-6 text-center transition-all duration-300 hover:border-[#3559D4] dark:hover:border-indigo-500/60 hover:bg-blue-50/30 dark:hover:bg-indigo-950/20"
        >
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-indigo-950/80 text-[#3559D4] dark:text-indigo-400 border border-transparent dark:border-indigo-800/50 transition-all duration-300 group-hover:scale-110">
            <Images size={28} className="sm:w-8 sm:h-8" />
          </div>
          <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Upload Gallery
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose multiple photos and videos.
          </p>

          <button
            type="button"
            className="mt-4 rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white dark:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Choose Files
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="inline-flex rounded-full bg-blue-50 dark:bg-sky-950/80 border border-blue-100 dark:border-sky-800/50 px-3 py-1 text-xs font-semibold text-[#3559D4] dark:text-sky-300">
              {existingGallery.length + gallery.length} Files Selected
            </span>
          </div>

          {/* Existing Media Section */}
          {existingGallery.length > 0 && (
            <>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Existing Media
              </h3>
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {existingGallery.map((file) => {
                  const isImage = file.type === "image";
                  return (
                    <div
                      key={file.publicId}
                      className="group overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm"
                    >
                      <div className="relative aspect-square">
                        {isImage ? (
                          <img
                            src={file.url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={file.url}
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteExistingMedia(file)}
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 shadow"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* New Uploads Section */}
          {gallery.length > 0 && (
            <>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                New Uploads
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {gallery.map((item) => {
                  const isImage = item.type.startsWith("image");
                  return (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                        {isImage ? (
                          <img
                            src={item.preview}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.preview}
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => removeMedia(item.id)}
                          className="absolute top-2.5 right-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 shadow"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 p-2 sm:p-2.5 bg-slate-50/50 dark:bg-slate-800/80">
                        {isImage ? (
                          <ImageIcon size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                        ) : (
                          <Video size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                        )}
                        <p className="truncate text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryUploader;
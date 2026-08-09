import { ImagePlus, Trash2, RefreshCw, Crop } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import CoverCropModal from "../common/CoverCropModal"; // Adjust path if needed depending on file location

// ==========================================
// COVER UPLOADER COMPONENT (EDIT PROFILE)
// ==========================================
const CoverUploader = ({
  formData,
  setFormData,
}) => {
  const fileInputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);

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

  useEffect(() => {
    const currentPreview = rawPreview;
    return () => {
      if (currentPreview && formData.coverImage) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [rawPreview, formData.coverImage]);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCropFile(file);
    e.target.value = "";
  };

  const handleCropSave = (croppedFile) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: croppedFile,
      existingCoverImage: "",
      existingCover: "",
    }));
    setCropFile(null);
  };

  const handleRecrop = async () => {
    if (formData.coverImage) {
      setCropFile(formData.coverImage);
      return;
    }

    const currentUrl = formData.existingCoverImage || formData.existingCover;
    if (currentUrl) {
      try {
        const response = await fetch(currentUrl);
        const blob = await response.blob();
        const file = new File([blob], "cover.jpg", {
          type: blob.type || "image/jpeg",
        });
        setCropFile(file);
      } catch (error) {
        console.error("Unable to load profile cover for cropping", error);
      }
    }
  };

  const removeCover = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      existingCoverImage: "",
      existingCover: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
            Cover Photo
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            {rawPreview
              ? "Cover photo selected. Crop or replace anytime."
              : "Personalize your profile with a customized cover image."}
          </p>
        </div>

        {rawPreview && (
          <button
            type="button"
            onClick={handleRecrop}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            <Crop size={14} />
            <span>Crop</span>
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
            Click to browse your landscape or portrait photos.
          </p>

          <span className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800">
            Choose Image
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-900 aspect-video w-full">
            <img
              src={rawPreview}
              alt="Cover Preview"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleRecrop}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              <Crop size={15} />
              <span>Crop Image</span>
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
        </div>
      )}

      {cropFile && (
        <CoverCropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
};

export default CoverUploader;
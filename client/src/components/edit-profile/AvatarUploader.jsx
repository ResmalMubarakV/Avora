import { Camera, Crop, Trash2 } from "lucide-react";
import { useRef, useMemo, useState, useEffect } from "react";
import AvatarCropModal from "./AvatarCropModal";

// ==========================================
// AVATAR UPLOADER COMPONENT (COMPACT)
// ==========================================
/**
 * Renders a compact profile photo uploader with responsive single-row buttons.
 */
const AvatarUploader = ({
  formData,
  setFormData,
}) => {
  const inputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);

  // --- Generate or Retrieve Preview URL ---
  const preview = useMemo(() => {
    if (formData.profileImage) {
      return URL.createObjectURL(formData.profileImage);
    }
    return formData.existingProfileImage || "";
  }, [
    formData.profileImage,
    formData.existingProfileImage,
  ]);

  // --- Cleanup Object URL on unmount or preview change ---
  useEffect(() => {
    const currentPreview = preview;
    return () => {
      if (currentPreview && formData.profileImage) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [preview, formData.profileImage]);

  // --- Handle File Selection ---
  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCropFile(file);
    e.target.value = "";
  };

  // --- Save Cropped File ---
  const handleCropSave = (croppedFile) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: croppedFile,
    }));
    setCropFile(null);
  };

  // --- Re-crop Existing or Newly Selected Photo ---
  const handleRecrop = async () => {
    if (formData.profileImage) {
      setCropFile(formData.profileImage);
      return;
    }

    if (formData.existingProfileImage) {
      try {
        const response = await fetch(formData.existingProfileImage);
        const blob = await response.blob();
        const file = new File([blob], "avatar.jpg", {
          type: blob.type || "image/jpeg",
        });
        setCropFile(file);
      } catch (error) {
        console.error("Unable to load image for cropping", error);
      }
    }
  };

  // --- Remove Profile Image ---
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      existingProfileImage: "",
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">Profile Photo</h2>
        <p className="text-[11px] text-slate-500">
          Upload a clear profile photo for your public profile.
        </p>
      </div>

      {/* Avatar Container & Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-slate-200/80 bg-slate-100 shadow-inner">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Camera size={32} />
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />

        {/* Action Buttons in a Single Row */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-full">
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="rounded-xl bg-[#3559D4] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#1E3A8A] cursor-pointer"
          >
            {preview ? "Change Photo" : "Upload Photo"}
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRecrop}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              <Crop size={14} />
              Crop
            </button>
          )}

          {preview && (
            <button
              type="button"
              onClick={removeImage}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-100/60 cursor-pointer"
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Avatar Cropper Modal */}
      {cropFile && (
        <AvatarCropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
};

AvatarUploader.displayName = "AvatarUploader";
export default AvatarUploader;
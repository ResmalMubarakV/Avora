import { Camera, Crop, Trash2 } from "lucide-react";
import { useRef, useMemo, useState, useEffect } from "react";
import AvatarCropModal from "./AvatarCropModal";

// ==========================================
// AVATAR UPLOADER COMPONENT
// ==========================================
/**
 * Renders a profile photo uploader with preview support, object URL memory cleanup, 
 * cropping modal integration via AvatarCropModal, and photo removal actions.
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

  // --- Cleanup Object URL on unmount or preview change to prevent memory leaks ---
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

    // Open the cropper instead of using the raw file directly
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
    // Re-cropping a photo already selected this session
    if (formData.profileImage) {
      setCropFile(formData.profileImage);
      return;
    }

    // Re-cropping a previously uploaded avatar — fetch it back into a File
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
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900">Profile Photo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload a clear profile photo for your public profile.
        </p>
      </div>

      {/* Avatar Container & Controls */}
      <div className="flex flex-col items-center gap-6">
        <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100 shadow-inner">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Camera size={42} />
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

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="rounded-xl bg-[#3559D4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E3A8A]"
          >
            {preview ? "Change Photo" : "Upload Photo"}
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRecrop}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Crop size={16} />
              Crop
            </button>
          )}

          {preview && (
            <button
              type="button"
              onClick={removeImage}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
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

export default AvatarUploader;
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import {
  getMemoryById,
  updateMemory,
  deleteMedia,
} from "../../api/memoryApi";

import PageHeader from "../../components/create-memory/PageHeader";
import JourneyDetails from "../../components/create-memory/JourneyDetails";
import CoverUploader from "../../components/create-memory/CoverUploader";
import GalleryUploader from "../../components/create-memory/GalleryUploader";
import VisibilityCard from "../../components/create-memory/VisibilityCard";
import ActionButtons from "../../components/create-memory/ActionButtons";
import LivePreview from "../../components/create-memory/LivePreview";
import DiscardMemoryModal from "../../components/create-memory/DiscardMemoryModal";
import DeleteMediaModal from "../../components/edit-memory/DeleteMediaModal";
import PageTitle from "../../components/common/PageTitle";

const RETURN_KEY = "avora_edit_return_to";

const EditMemory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const returnToRef = useRef();
  if (returnToRef.current === undefined) {
    returnToRef.current =
      sessionStorage.getItem(RETURN_KEY) ||
      location.state?.from ||
      "/dashboard";
  }
  const returnTo = returnToRef.current;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    modeOfTravel: "",
    description: "",
    isPublic: true,
    coverImage: null,
    gallery: [],
    existingCover: "",
    existingGallery: [],
  });

  // Automatically scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // Fetch memory data on page load
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        const memory = await getMemoryById(id);

        setFormData({
          title: memory.title || "",
          location: memory.location || "",
          startDate: memory.startDate ? memory.startDate.split("T")[0] : "",
          endDate: memory.endDate ? memory.endDate.split("T")[0] : "",
          modeOfTravel: memory.modeOfTravel || "",
          description: memory.description || "",
          isPublic: memory.isPublic ?? true,
          coverImage: null,
          gallery: [],
          existingCover: memory.coverImage || "",
          existingGallery: memory.media || [],
        });
        setHasChanges(false);
      } catch (error) {
        console.error("Fetch memory error:", error);
        toast.error("Unable to load memory.");
        sessionStorage.removeItem(RETURN_KEY);
        navigate(returnTo, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Form Validation Handler
  const validateForm = () => {
    if (!formData.title || !formData.title.trim()) {
      toast.error("Please enter a memory title.");
      return false;
    }
    if (!formData.location || !formData.location.trim()) {
      toast.error("Please enter a location.");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Please select a start date.");
      return false;
    }
    if (!formData.endDate) {
      toast.error("Please select an end date.");
      return false;
    }
    if (!formData.modeOfTravel) {
      toast.error("Please select a mode of travel.");
      return false;
    }
    if (!formData.description || !formData.description.trim()) {
      toast.error("Please write your story.");
      return false;
    }
    if (!formData.coverImage && !formData.existingCover) {
      toast.error("Please upload a cover image.");
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      sessionStorage.removeItem(RETURN_KEY);
      navigate(returnTo, { replace: true });
    }
  };

  const discardMemory = () => {
    setShowDiscardModal(false);
    setHasChanges(false);
    sessionStorage.removeItem(RETURN_KEY);
    navigate(returnTo, { replace: true });
  };

  const handleDeleteExistingMedia = (media) => {
    setSelectedMedia(media);
    setHasChanges(true);
    setShowDeleteMediaModal(true);
  };

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;

    try {
      setDeleteLoading(true);
      await deleteMedia(id, selectedMedia.publicId);

      setFormData((prev) => ({
        ...prev,
        existingGallery: prev.existingGallery.filter(
          (item) => item.publicId !== selectedMedia.publicId
        ),
      }));
      setHasChanges(true);

      toast.success("Media deleted successfully.");
      setShowDeleteMediaModal(false);
      setSelectedMedia(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete media.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (saving) return; 
    if (!validateForm()) return;

    setSaving(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("modeOfTravel", formData.modeOfTravel);
      data.append("description", formData.description);
      data.append("isPublic", formData.isPublic);

      if (Array.isArray(formData.existingGallery)) {
        data.append(
          "existingGallery",
          JSON.stringify(
            formData.existingGallery.map((item) => item.publicId || item)
          )
        );
      }

      if (!formData.coverImage && !formData.existingCover) {
        data.append("removeCover", "true");
      }

      if (formData.coverImage instanceof File) {
        data.append("coverImage", formData.coverImage);
      }

      if (Array.isArray(formData.gallery)) {
        formData.gallery.forEach((item) => {
          const fileToAppend = item instanceof File ? item : item?.file;
          if (fileToAppend instanceof File) {
            data.append("media", fileToAppend);
          }
        });
      }

      await updateMemory(id, data);

      toast.success("Memory updated successfully!");
      setHasChanges(false);
      sessionStorage.removeItem(RETURN_KEY);

      navigate(returnTo, { replace: true });
    } catch (error) {
      console.error("Update memory error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to update memory. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 xl:h-[calc(100vh-5rem)] xl:flex xl:flex-col xl:overflow-hidden pb-4">
      <PageTitle title="Edit Memory" />
      <div>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <PageHeader
        title="Edit Memory"
        subtitle="Update your journey and keep your memories fresh."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-start xl:h-[calc(100vh-7.5rem)] xl:overflow-hidden">
        <div className="xl:col-span-2 xl:h-full xl:overflow-y-auto xl:pr-3 space-y-3.5 scrollbar-hide">
          <JourneyDetails
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
            handleChange={(e) => {
              setHasChanges(true);
              const { name, value } = e.target;
              setFormData((prev) => ({ ...prev, [name]: value }));
            }}
          />
          <CoverUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
            isEdit={true}
          />
          <GalleryUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
            isEdit={true}
            onDeleteExistingMedia={handleDeleteExistingMedia}
          />
          <VisibilityCard
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />

          {/* Mobile & Tablet Action Buttons */}
          <div className="xl:hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 mt-4">
            <ActionButtons
              loading={loading || saving}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              buttonText="Save Changes"
            />
          </div>
        </div>

        {/* Desktop Sidebar Action Buttons */}
        <div className="hidden xl:block xl:col-span-1 xl:h-full">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col xl:h-full">
            <div className="overflow-y-auto scrollbar-hide flex-1 pr-1 pb-2">
              <LivePreview formData={formData} />
            </div>

            <div className="pt-2 bg-white shrink-0">
              <ActionButtons
                loading={loading || saving}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                buttonText="Save Changes"
              />
            </div>
          </div>
        </div>
      </div>

      <DiscardMemoryModal
        open={showDiscardModal}
        loading={saving}
        onClose={() => setShowDiscardModal(false)}
        onDiscard={discardMemory}
        onPublish={handleSubmit}
      />

      <DeleteMediaModal
        open={showDeleteMediaModal}
        loading={deleteLoading}
        onClose={() => {
          setShowDeleteMediaModal(false);
          setSelectedMedia(null);
        }}
        onDelete={handleDeleteMedia}
      />
    </div>
  );
};

export default EditMemory;
import { useEffect, useState } from "react";
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

// ==========================================
// EDIT MEMORY PAGE COMPONENT
// ==========================================
const EditMemory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const returnTo = location.state?.from || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        const memory = await getMemoryById(id);

        setFormData({
          title: memory.title,
          location: memory.location,
          startDate: memory.startDate.split("T")[0],
          endDate: memory.endDate.split("T")[0],
          modeOfTravel: memory.modeOfTravel,
          description: memory.description,
          isPublic: memory.isPublic ?? true,
          coverImage: null,
          gallery: [],
          existingCover: memory.coverImage,
          existingGallery: memory.media,
        });
      } catch (error) {
        console.error(error);
        toast.error("Unable to load memory.");
        navigate(returnTo, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id, navigate, returnTo]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a memory title.");
      return false;
    }
    if (!formData.location.trim()) {
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
    if (!formData.description.trim()) {
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
    setShowDiscardModal(true);
  };

  const discardMemory = () => {
    setShowDiscardModal(false);
    navigate(returnTo);
  };

  const handleDeleteExistingMedia = (media) => {
    setSelectedMedia(media);
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
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();

      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("modeOfTravel", formData.modeOfTravel);
      data.append("description", formData.description);
      data.append("isPublic", formData.isPublic);

      data.append(
        "existingGallery",
        JSON.stringify(formData.existingGallery.map((item) => item.publicId))
      );

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

      const response = await updateMemory(id, data);
      setShowDiscardModal(false);
      toast.success("Memory updated successfully!");

      if (response?.slug && response?.user?.username) {
        navigate(`/u/${response.user.username}/${response.slug}`, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to update memory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
        <div className="xl:col-span-2 xl:h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-4 space-y-6 scrollbar-hide">
          <JourneyDetails
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
          <CoverUploader
            formData={formData}
            setFormData={setFormData}
            isEdit={true}
          />
          <GalleryUploader
            formData={formData}
            setFormData={setFormData}
            isEdit={true}
            onDeleteExistingMedia={handleDeleteExistingMedia}
          />
          <VisibilityCard
            formData={formData}
            setFormData={setFormData}
          />

          {/* Mobile & Tablet Action Buttons */}
          <div className="xl:hidden bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 mt-6">
            <ActionButtons
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              buttonText="Save Changes"
            />
          </div>
        </div>

        <div className="hidden xl:block xl:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-[calc(100vh-10rem)]">
            <div className="overflow-y-auto scrollbar-hide flex-1 pr-1 pb-4">
              <LivePreview formData={formData} />
            </div>

            <div className="pt-4 border-t border-slate-100 bg-white shrink-0">
              <ActionButtons
                loading={loading}
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
        loading={loading}
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
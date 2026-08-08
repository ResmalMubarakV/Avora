import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createMemory } from "../../api/memoryApi";

import PageHeader from "../../components/create-memory/PageHeader";
import JourneyDetails from "../../components/create-memory/JourneyDetails";
import CoverUploader from "../../components/create-memory/CoverUploader";
import GalleryUploader from "../../components/create-memory/GalleryUploader";
import VisibilityCard from "../../components/create-memory/VisibilityCard";
import ActionButtons from "../../components/create-memory/ActionButtons";
import LivePreview from "../../components/create-memory/LivePreview";
import DiscardMemoryModal from "../../components/create-memory/DiscardMemoryModal";
import PageTitle from "../../components/common/PageTitle";

const CreateMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // Intercept browser back button / swipe gestures
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (hasChanges) {
        window.history.pushState(null, "", window.location.href);
        setShowDiscardModal(true);
      } else {
        navigate(-1);
      }
    };

    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHasChanges(true);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  });

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
    if (!formData.coverImage) {
      toast.error("Please upload a cover image.");
      return false;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be earlier than the start date.");
      return false;
    }
    return true;
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

      await createMemory(data);
      setShowDiscardModal(false);
      setHasChanges(false);
      toast.success("Memory created successfully!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to create memory. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!hasChanges) {
      navigate("/dashboard");
      return;
    }
    setShowDiscardModal(true);
  };

  const discardMemory = () => {
    setShowDiscardModal(false);
    setHasChanges(false);
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageTitle title="Create New Memory" />
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

      <PageHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Form Inputs Container */}
        <div className="xl:col-span-2 xl:h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-4 space-y-6 scrollbar-hide">
          <JourneyDetails
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
            handleChange={handleChange}
          />
          <CoverUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />
          <GalleryUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />
          <VisibilityCard
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />

          {/* Mobile & Tablet Action Buttons */}
          <div className="xl:hidden bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 mt-6">
            <ActionButtons
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              buttonText="Publish Memory"
            />
          </div>
        </div>

        {/* Desktop Sidebar Preview & Buttons */}
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
                buttonText="Publish Memory"
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
    </div>
  );
};

export default CreateMemory;
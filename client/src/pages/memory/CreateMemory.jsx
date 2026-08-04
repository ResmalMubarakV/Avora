import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createMemory } from "../../api/memoryApi";

import PageHeader from "../../components/create-memory/PageHeader";
import JourneyDetails from "../../components/create-memory/JourneyDetails";
import CoverUploader from "../../components/create-memory/CoverUploader";
import GalleryUploader from "../../components/create-memory/GalleryUploader";
import VisibilityCard from "../../components/create-memory/VisibilityCard";
import ActionButtons from "../../components/create-memory/ActionButtons";
import LivePreview from "../../components/create-memory/LivePreview";
import DiscardMemoryModal from "../../components/create-memory/DiscardMemoryModal";

const CreateMemory = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        modeOfTravel: "",
        description: "",
        isPublic: false,

        coverImage: null,
        gallery: [],
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

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

            data.append("coverImage", formData.coverImage);

            formData.gallery.forEach((file) => {
                data.append("media", file);
            });

            await createMemory(data);

            toast.success("Memory created successfully!");

            setFormData({
                title: "",
                location: "",
                startDate: "",
                endDate: "",
                modeOfTravel: "",
                description: "",
                isPublic: false,
                coverImage: null,
                gallery: [],
            });

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to create memory."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = () => {

    const hasUnsavedChanges =
        formData.title ||
        formData.location ||
        formData.startDate ||
        formData.endDate ||
        formData.modeOfTravel ||
        formData.description ||
        formData.coverImage ||
        formData.gallery.length > 0;

    if (!hasUnsavedChanges) {
        navigate("/dashboard");
        return;
    }

    setShowDiscardModal(true);

    };

    const discardMemory = () => {

    setShowDiscardModal(false);

    navigate("/dashboard");

};

    return (

        <div className="space-y-8">

            <PageHeader />

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-8
                "
            >

                {/* Left */}

                <div
                    className="
                        xl:col-span-2
                        space-y-6
                    "
                >

                    <JourneyDetails
                        formData={formData}
                        handleChange={handleChange}
                    />

                    <CoverUploader
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <GalleryUploader
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <VisibilityCard
                        formData={formData}
                        setFormData={setFormData}
                    />

                </div>

                {/* Right */}

                <div className="hidden xl:block">

                    <div
                        className="
                            sticky
                            top-28
                            space-y-6
                        "
                    >

                        {/* Preview */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                shadow-sm
                            "
                        >

                            <LivePreview
                                formData={formData}
                            />

                        </div>

                        {/* Actions */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <ActionButtons
                                loading={loading}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* Mobile Actions */}

            <div className="xl:hidden">

                <ActionButtons
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>

            <DiscardMemoryModal
                open={showDiscardModal}
                onClose={() => setShowDiscardModal(false)}
                onDiscard={discardMemory}
            />

        </div>

    );

};

export default CreateMemory;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
    getMemoryById,
    updateMemory,
    deleteMedia
} from "../../api/memoryApi";

import {
    useLocation,
} from "react-router-dom";

import PageHeader from "../../components/create-memory/PageHeader";
import JourneyDetails from "../../components/create-memory/JourneyDetails";
import CoverUploader from "../../components/create-memory/CoverUploader";
import GalleryUploader from "../../components/create-memory/GalleryUploader";
import VisibilityCard from "../../components/create-memory/VisibilityCard";
import ActionButtons from "../../components/create-memory/ActionButtons";
import LivePreview from "../../components/create-memory/LivePreview";
import DiscardMemoryModal from "../../components/create-memory/DiscardMemoryModal";
import DeleteMediaModal from "../../components/edit-memory/DeleteMediaModal";

const EditMemory = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();

    const returnTo =
    location.state?.from ||
    "/dashboard";

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
        isPublic: false,

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
                    isPublic: memory.isPublic,

                    coverImage: null,
                    gallery: [],

                    existingCover: memory.coverImage,
                    existingGallery: memory.media,
                });

            } catch (error) {

                console.error(error);

                toast.error("Unable to load memory.");

                navigate(returnTo, {
                    replace: true,
                });

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

        if (
            !formData.coverImage &&
            !formData.existingCover
        ) {
            toast.error("Please upload a cover image.");
            return false;
        }

        if (
            new Date(formData.endDate) <
            new Date(formData.startDate)
        ) {
            toast.error("End date cannot be earlier than the start date.");
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

            await deleteMedia(
                id,
                selectedMedia.publicId
            );

            setFormData((prev) => ({
                ...prev,
                existingGallery:
                    prev.existingGallery.filter(
                        (item) =>
                            item.publicId !==
                            selectedMedia.publicId
                    ),
            }));

            toast.success(
                "Media deleted successfully."
            );

            setShowDeleteMediaModal(false);

            setSelectedMedia(null);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to delete media."
            );

        } finally {

            setDeleteLoading(false);

        }

    };

    const handleSubmit = async () => {

        if (!validateForm()) return;

        try {

            setLoading(true);

            const data = new FormData();

            // Basic Details

            data.append("title", formData.title);
            data.append("location", formData.location);
            data.append("startDate", formData.startDate);
            data.append("endDate", formData.endDate);
            data.append("modeOfTravel", formData.modeOfTravel);
            data.append("description", formData.description);
            data.append("isPublic", formData.isPublic);

            // Existing Gallery (keep these)

            data.append(
                "existingGallery",
                JSON.stringify(
                    formData.existingGallery.map(
                        (item) => item.publicId
                    )
                )
            );

            // Remove existing cover

            if (
                !formData.coverImage &&
                !formData.existingCover
            ) {

                data.append(
                    "removeCover",
                    "true"
                );

            }

            // Upload new cover

            if (formData.coverImage) {

                data.append(
                    "coverImage",
                    formData.coverImage
                );

            }

            // Upload newly added gallery files

            formData.gallery.forEach((file) => {

                data.append(
                    "media",
                    file
                );

            });

            await updateMemory(id, data);

            toast.success(
                "Memory updated successfully!"
            );

            navigate(returnTo, {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to update memory."
            );

        } finally {

            setLoading(false);

        }

    };

        return (

        <div className="space-y-8">

            <PageHeader
                title="Edit Memory"
                subtitle="Update your journey and keep your memories fresh."
            />

            <div
                className="
                    grid
                    grid-cols-1
                    gap-8
                    xl:grid-cols-3
                "
            >

                {/* Left */}

                <div
                    className="
                        space-y-6
                        xl:col-span-2
                    "
                >

                    <JourneyDetails
                        formData={formData}
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
                        onDeleteExistingMedia={
                            handleDeleteExistingMedia
                        }
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

                </div>

            </div>

            <ActionButtons
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                buttonText="Save Changes"
            />

            <DiscardMemoryModal
                open={showDiscardModal}
                onClose={() => setShowDiscardModal(false)}
                onDiscard={discardMemory}
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
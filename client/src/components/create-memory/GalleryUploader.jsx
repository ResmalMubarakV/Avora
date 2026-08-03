import {
    Images,
    Plus,
    Trash2,
    Image as ImageIcon,
    Video,
} from "lucide-react";
import { useRef } from "react";

const GalleryUploader = ({
    formData,
    setFormData,
    onDeleteExistingMedia,
}) => {

    const fileInputRef = useRef(null);

    const existingGallery = formData.existingGallery || [];
    const gallery = formData.gallery || [];

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleGalleryChange = (e) => {

        const files = Array.from(e.target.files);

        if (!files.length) return;

        setFormData((prev) => ({
            ...prev,
            gallery: [
                ...prev.gallery,
                ...files,
            ],
        }));

        e.target.value = "";

    };

    const removeMedia = (index) => {

        setFormData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter(
                (_, i) => i !== index
            ),
        }));

    };

    return (

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

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

            <div>

                <h2 className="text-xl font-semibold text-slate-900">
                    Gallery
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Upload your travel photos and videos.
                </p>

            </div>

            {(gallery.length > 0 ||
                existingGallery.length > 0) && (

                <button
                    type="button"
                    onClick={handleBrowse}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#3559D4]
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#1E3A8A]
                    "
                >

                    <Plus size={18} />

                    Add More

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

        {gallery.length === 0 &&
        existingGallery.length === 0 ? (

            <div
                onClick={handleBrowse}
                className="
                    group
                    flex
                    min-h-[240px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border-2
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    transition-all
                    duration-300
                    hover:border-[#3559D4]
                    hover:bg-blue-50
                "
            >

                <Images
                    size={44}
                    className="
                        text-[#3559D4]
                        transition
                        group-hover:scale-110
                    "
                />

                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                    Upload Gallery
                </h3>

                <p className="mt-2 text-center text-sm text-slate-500">
                    Select multiple photos and videos.
                </p>

                <span
                    className="
                        mt-6
                        rounded-xl
                        bg-[#3559D4]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        group-hover:bg-[#1E3A8A]
                    "
                >
                    Choose Files
                </span>

            </div>

        ) : (

            <>

                <div className="mb-6">

                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-[#3559D4]
                        "
                    >
                        {gallery.length +
                            existingGallery.length}{" "}
                        file
                        {gallery.length +
                            existingGallery.length >
                        1
                            ? "s"
                            : ""}{" "}
                        selected
                    </span>

                </div>

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        md:grid-cols-3
                        xl:grid-cols-4
                    "
                >

                    {[
                        ...formData.existingGallery,
                        ...formData.gallery,
                    ].map((file, index) => {

                        const isExisting = !!file.url;

                        const isImage = isExisting
                            ? file.type === "image"
                            : file.type.startsWith("image");

                        const preview = isExisting
                            ? file.url
                            : URL.createObjectURL(file);

                        return (

                            <div
                                key={
                                    isExisting
                                        ? file.publicId
                                        : index
                                }
                                className="
                                    group
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            >

                                <div
                                    className="
                                        relative
                                        aspect-square
                                        overflow-hidden
                                    "
                                >

                                    {isImage ? (

                                        <img
                                            src={preview}
                                            alt=""
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition
                                                duration-300
                                                group-hover:scale-105
                                            "
                                        />

                                    ) : (

                                        <video
                                            src={preview}
                                            controls
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />

                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            isExisting
                                                ? onDeleteExistingMedia(file)
                                                : removeMedia(
                                                    index -
                                                        formData
                                                            .existingGallery
                                                            .length
                                                )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-500
                                            text-white
                                            transition
                                            hover:bg-red-600
                                        "
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                                <div className="flex items-center gap-2 p-3">

                                    {isImage ? (

                                        <ImageIcon
                                            size={16}
                                            className="text-slate-400"
                                        />

                                    ) : (

                                        <Video
                                            size={16}
                                            className="text-slate-400"
                                        />

                                    )}

                                    <p
                                        className="
                                            truncate
                                            text-xs
                                            text-slate-600
                                        "
                                    >
                                        {isExisting
                                            ? `${file.type.toUpperCase()}`
                                            : file.name}
                                    </p>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </>

        )}

    </div>

);

};

export default GalleryUploader;
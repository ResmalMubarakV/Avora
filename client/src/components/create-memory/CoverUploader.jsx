import { ImagePlus, Trash2, RefreshCw } from "lucide-react";
import { useMemo, useRef } from "react";

const CoverUploader = ({
    formData,
    setFormData,
    isEdit = false,
}) => {

    const fileInputRef = useRef(null);

    const preview = useMemo(() => {

    if (formData.coverImage) {
        return URL.createObjectURL(formData.coverImage);
    }

    return formData.existingCover || null;

}, [
    formData.coverImage,
    formData.existingCover,
]);

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleCoverChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            coverImage: file,
        }));

    };

    const removeCover = () => {

    setFormData((prev) => ({
        ...prev,
        coverImage: null,
        existingCover: "",
    }));

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }

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

            <div className="mb-8">

                <h2 className="text-xl font-semibold text-slate-900">
                    {preview ? "Cover Ready" : "Cover Image"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {preview
                        ? "Looking good! Replace it anytime before saving."
                        : "Choose a beautiful cover that represents your journey."
                    }
                </p>

            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
            />

            {!preview ? (

                <div
                    onClick={handleBrowse}
                    className="
                        group
                        flex
                        min-h-[300px]
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

                    <div
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            transition-all
                            duration-300
                            group-hover:scale-110
                        "
                    >

                        <ImagePlus
                            size={34}
                            className="text-[#3559D4]"
                        />

                    </div>

                    <h3
                        className="
                            mt-6
                            text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        {preview
                            ? "Cover Ready"
                            : "Upload Cover Image"
                        }
                    </h3>

                    <p
                        className="
                            mt-2
                            max-w-sm
                            text-center
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        Drag & drop your cover image here or click to browse.
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
                        {preview
                            ? "Change Cover"
                            : "Choose Image"
                        }
                    </span>

                </div>

            ) : (

                <div className="space-y-6">

                    <div
                        className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                        "
                    >

                        <img
                            src={preview}
                            alt="Cover Preview"
                            className="
                                aspect-video
                                w-full
                                object-cover
                            "
                        />

                    </div>

                    <div className="flex justify-center gap-4">

                        <button
                            type="button"
                            onClick={handleBrowse}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                px-5
                                py-3
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-100
                            "
                        >

                            <RefreshCw size={18} />

                            Replace Image

                        </button>

                        <button
                            type="button"
                            onClick={removeCover}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-red-50
                                px-5
                                py-3
                                font-medium
                                text-red-600
                                transition
                                hover:bg-red-100
                            "
                        >

                            <Trash2 size={18} />

                            Remove

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};

export default CoverUploader;
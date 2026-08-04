import {
    Images,
    Plus,
    Trash2,
    Image as ImageIcon,
    Video,
} from "lucide-react";

import {
    useEffect,
    useRef,
} from "react";

const GalleryUploader = ({
    formData,
    setFormData,
    onDeleteExistingMedia,
}) => {

    const fileInputRef = useRef(null);

    const existingGallery =
        formData.existingGallery || [];

    const gallery =
        formData.gallery || [];

    const handleBrowse = () => {

        fileInputRef.current?.click();

    };

    // Upload New Files

    const handleGalleryChange = (e) => {

        const files = Array.from(e.target.files);

        if (!files.length) return;

        const uploadedFiles = files.map((file) => ({

            id:
                crypto.randomUUID(),

            file,

            preview:
                URL.createObjectURL(file),

            type:
                file.type,

            name:
                file.name,

        }));

        setFormData((prev) => ({

            ...prev,

            gallery: [

                ...prev.gallery,

                ...uploadedFiles,

            ],

        }));

        e.target.value = "";

    };

    // Remove New Upload

    const removeMedia = (id) => {

        setFormData((prev) => {

            const media =
                prev.gallery.find(
                    (item) => item.id === id
                );

            if (media?.preview) {

                URL.revokeObjectURL(
                    media.preview
                );

            }

            return {

                ...prev,

                gallery:
                    prev.gallery.filter(
                        (item) =>
                            item.id !== id
                    ),

            };

        });

    };

    // Cleanup

    useEffect(() => {

        return () => {

            gallery.forEach((item) => {

                if (item.preview) {

                    URL.revokeObjectURL(
                        item.preview
                    );

                }

            });

        };

    }, []);
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

        {(existingGallery.length > 0 ||
            gallery.length > 0) && (

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

    {existingGallery.length === 0 &&
    gallery.length === 0 ? (

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
                size={46}
                className="
                    text-[#3559D4]

                    transition-transform
                    duration-300

                    group-hover:scale-110
                "
            />

            <h3 className="mt-6 text-lg font-semibold">

                Upload Gallery

            </h3>

            <p className="mt-2 text-sm text-slate-500">

                Drag & drop or choose multiple files.

            </p>

            <button
                type="button"
                className="
                    mt-6

                    rounded-xl

                    bg-[#3559D4]

                    px-5
                    py-3

                    text-sm
                    font-semibold
                    text-white
                "
            >

                Choose Files

            </button>

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

                    {existingGallery.length + gallery.length} Files

                </span>

            </div>

            {/* Existing */}

            {existingGallery.length > 0 && (

                <>

                    <h3
                        className="
                            mb-4

                            text-sm
                            font-semibold
                            uppercase
                            tracking-wide

                            text-slate-500
                        "
                    >
                        Existing Media
                    </h3>

                    <div
                        className="
                            mb-8

                            grid
                            grid-cols-2
                            gap-4

                            md:grid-cols-3
                            xl:grid-cols-4
                        "
                    >

                        {existingGallery.map((file) => {

                            const isImage =
                                file.type === "image";

                            return (

                                <div
                                    key={file.publicId}
                                    className="
                                        group

                                        overflow-hidden

                                        rounded-2xl

                                        border
                                        border-slate-200
                                    "
                                >

                                    <div
                                        className="
                                            relative
                                            aspect-square
                                        "
                                    >

                                        {isImage ? (

                                            <img
                                                src={file.url}
                                                alt=""
                                                loading="lazy"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover

                                                    transition-transform
                                                    duration-500

                                                    group-hover:scale-105
                                                "
                                            />

                                        ) : (

                                            <video
                                                src={file.url}
                                                preload="metadata"
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
                                                onDeleteExistingMedia(file)
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

                                </div>

                            );

                        })}

                    </div>

                </>

            )}

            {/* New Uploads */}

            {gallery.length > 0 && (

                <>

                    <h3
                        className="
                            mb-4

                            text-sm
                            font-semibold
                            uppercase
                            tracking-wide

                            text-slate-500
                        "
                    >

                        New Uploads

                    </h3>

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4

                            md:grid-cols-3
                            xl:grid-cols-4
                        "
                    >

                        {gallery.map((item) => {

                            const isImage =
                                item.type.startsWith("image");

                            return (

                                <div
                                    key={item.id}
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
                                                src={item.preview}
                                                alt={item.name}
                                                loading="lazy"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-500
                                                    group-hover:scale-105
                                                "
                                            />

                                        ) : (

                                            <video
                                                src={item.preview}
                                                preload="metadata"
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
                                                removeMedia(item.id)
                                            }
                                            className="
                                                absolute
                                                top-3
                                                right-3

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

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            p-3
                                        "
                                    >

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
                                            {item.name}
                                        </p>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </>

            )}

        </>

    )}

</div>

);

};

export default GalleryUploader;
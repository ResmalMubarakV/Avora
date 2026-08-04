import {
    ImagePlus,
    Trash2,
    Camera,
} from "lucide-react";
import {
    useMemo,
    useRef,
} from "react";

const CoverUploader = ({
    formData,
    setFormData,
}) => {

    const inputRef = useRef(null);

    const preview = useMemo(() => {

        if (formData.coverImage) {
            return URL.createObjectURL(
                formData.coverImage
            );
        }

        return (
            formData.existingCoverImage || ""
        );

    }, [
        formData.coverImage,
        formData.existingCoverImage,
    ]);

    const openPicker = () => {

        inputRef.current?.click();

    };

    const handleChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        setFormData((prev) => ({

            ...prev,

            coverImage: file,

        }));

        e.target.value = "";

    };

    const removeCover = () => {

        setFormData((prev) => ({

            ...prev,

            coverImage: null,

            existingCoverImage: "",

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

            <div className="mb-8">

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-slate-900
                    "
                >

                    Cover Photo

                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >

                    Personalize your profile with
                    a beautiful cover image.

                </p>

            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                "
            >

                {preview ? (

                    <>

                        <img
                            src={preview}
                            alt="Cover"
                            className="
                                h-64
                                w-full
                                object-cover
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                bg-black/0
                                transition
                                hover:bg-black/20
                            "
                        />

                        <div
                            className="
                                absolute
                                right-4
                                top-4
                                flex
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={openPicker}
                                className="
                                    flex
                                    items-center
                                    gap-2

                                    rounded-xl

                                    bg-white

                                    px-4
                                    py-2

                                    text-sm
                                    font-medium

                                    shadow
                                "
                            >

                                <Camera size={16} />

                                Change

                            </button>

                            <button
                                type="button"
                                onClick={removeCover}
                                className="
                                    flex
                                    items-center
                                    gap-2

                                    rounded-xl

                                    bg-red-500

                                    px-4
                                    py-2

                                    text-sm
                                    font-medium
                                    text-white

                                    shadow
                                "
                            >

                                <Trash2 size={16} />

                                Remove

                            </button>

                        </div>

                    </>

                ) : (

                    <button
                        type="button"
                        onClick={openPicker}
                        className="
                            group

                            flex
                            h-64
                            w-full

                            flex-col
                            items-center
                            justify-center

                            gap-5

                            bg-gradient-to-r
                            from-[#3559D4]
                            via-[#5476E8]
                            to-[#8FA6FF]

                            transition
                        "
                    >

                        <div
                            className="
                                rounded-full
                                bg-white/20
                                p-5
                                backdrop-blur
                                transition
                                group-hover:scale-110
                            "
                        >

                            <ImagePlus
                                size={34}
                                className="text-white"
                            />

                        </div>

                        <div className="text-center">

                            <h3
                                className="
                                    text-xl
                                    font-semibold
                                    text-white
                                "
                            >

                                Upload Cover Photo

                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-white/80
                                "
                            >

                                Recommended:
                                1600 × 500 px

                            </p>

                        </div>

                    </button>

                )}

            </div>

        </div>

    );

};

export default CoverUploader;
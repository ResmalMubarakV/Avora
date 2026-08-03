import { useMemo } from "react";
import {
    MapPin,
    CalendarDays,
    Plane,
    Globe,
    Lock,
} from "lucide-react";

const LivePreview = ({ formData }) => {

    const coverPreview = formData.coverImage
    ? URL.createObjectURL(formData.coverImage)
    : formData.existingCover || null;

    return (

        <div className="space-y-5">

            {/* Header */}

            <div>

                <h3
                    className="
                        text-xl
                        font-semibold
                        text-slate-900
                    "
                >
                    Live Preview
                </h3>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Your memory updates as you type.
                </p>

            </div>

            {/* Preview Card */}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                "
            >

                {/* Cover */}

                <div
                    className="
                        aspect-video
                        overflow-hidden
                        bg-slate-100
                    "
                >

                    {coverPreview ? (

                        <img
                            src={coverPreview}
                            alt="Cover Preview"
                            className="
                                h-full
                                w-full
                                object-cover
                            "
                        />

                    ) : (

                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-slate-400
                            "
                        >

                            Cover Image

                        </div>

                    )}

                </div>

                {/* Content */}

                <div className="space-y-4 p-5">

                    <h4
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        {formData.title || "Memory Title"}
                    </h4>

                    <div className="space-y-2 text-sm text-slate-600">

                        <div className="flex items-center gap-2">

                            <MapPin size={16} />

                            {formData.location || "Location"}

                        </div>

                        <div className="flex items-center gap-2">

                            <CalendarDays size={16} />

                            {formData.startDate || "Start Date"}

                            {" • "}

                            {formData.endDate || "End Date"}

                        </div>

                        <div className="flex items-center gap-2">

                            <Plane size={16} />

                            {formData.modeOfTravel || "Mode of Travel"}

                        </div>

                    </div>

                    {formData.description && (

                        <p
                            className="
                                text-sm
                                leading-6
                                text-slate-500
                                line-clamp-4
                            "
                        >
                            {formData.description}
                        </p>

                    )}

                    {/* Gallery */}

                    {formData.gallery.length > 0 && (

                        <div>

                            <h5
                                className="
                                    mb-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Gallery
                            </h5>

                            <div
                                className="
                                    grid
                                    grid-cols-4
                                    gap-2
                                "
                            >

                                {formData.gallery
                                    .slice(0, 4)
                                    .map((file, index) => (

                                        <div
                                            key={index}
                                            className="
                                                aspect-square
                                                overflow-hidden
                                                rounded-lg
                                                bg-slate-100
                                            "
                                        >

                                            {file.type.startsWith("image") ? (

                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt=""
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                    "
                                                />

                                            )}

                                        </div>

                                    ))}

                            </div>

                            {formData.gallery.length > 4 && (

                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    +{formData.gallery.length - 4} more files
                                </p>

                            )}

                        </div>

                    )}

                    {/* Visibility */}

                    <div
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold

                            ${
                                formData.isPublic
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                            }
                        `}
                    >

                        {formData.isPublic ? (

                            <>
                                <Globe size={14} />
                                Public Memory
                            </>

                        ) : (

                            <>
                                <Lock size={14} />
                                Private Memory
                            </>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default LivePreview;
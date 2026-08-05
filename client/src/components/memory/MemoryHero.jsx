import MemoryInfo from "./MemoryInfo";
import CoverImage from "./CoverImage";
import MediaPreview from "./MediaPreview";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// ==========================================
// MEMORY HERO COMPONENT
// ==========================================
/**
 * Renders the top hero section for a specific travel memory view. 
 * Features a single outside navigation header with the Back button aligned to the left 
 * and the Edit button aligned to the right corresponding with the cover banner.
 */
const MemoryHero = ({
    username,
    memory,
    openGallery,
    isOwner,
    locationState,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = locationState?.from || `/${username}`;
    const label = locationState?.label || "Profile";

    return (
        <div className="flex flex-col gap-6">
            {/* Top Navigation Bar Outside the Cards (Back left, Edit right) */}
            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => navigate(from)}
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-xl
                        border
                        border-slate-200/80
                        bg-white
                        px-3.5
                        py-2
                        text-xs
                        sm:text-sm
                        font-medium
                        text-slate-700
                        shadow-sm
                        transition-all
                        duration-300
                        cursor-pointer
                        hover:bg-slate-50
                        hover:shadow-md
                    "
                >
                    <ArrowLeft size={16} />
                    <span>Back to {label}</span>
                </button>

                {isOwner && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/dashboard/edit-memory/${memory._id}`,
                                {
                                    state: {
                                        from: location.pathname,
                                    },
                                }
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-slate-200/80
                            bg-white/90
                            px-4
                            py-2
                            text-xs
                            sm:text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            backdrop-blur-md
                            transition-all
                            duration-300
                            cursor-pointer
                            hover:bg-white
                            hover:text-slate-900
                            hover:shadow-md
                        "
                    >
                        <Pencil size={15} />
                        <span className="hidden sm:inline">Edit Memory</span>
                        <span className="sm:hidden">Edit</span>
                    </button>
                )}
            </div>

            {/* Main Hero Grid */}
            <section
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-12
                    gap-8
                    xl:gap-14
                    items-start
                "
            >
                {/* Left Column: Memory Metadata & Info Card */}
                <div className="xl:col-span-5">
                    <div
                        className="
                            rounded-[32px]
                            border
                            border-slate-200/80
                            bg-white
                            shadow-xl
                            overflow-hidden
                        "
                    >
                        <div className="p-6 sm:p-8 lg:p-10">
                            <MemoryInfo
                                memory={memory}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Cover Banner & Media Thumbnails Preview */}
                <div className="xl:col-span-7">
                    <CoverImage
                        image={memory.coverImage}
                        onClick={() => openGallery(0)}
                    />

                    {memory.media && memory.media.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                            <MediaPreview
                                media={memory.media}
                                onOpenGallery={openGallery}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MemoryHero;
import MemoryInfo from "./MemoryInfo";
import CoverImage from "./CoverImage";
import MediaPreview from "./MediaPreview";
import { ArrowLeft, Pencil, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const RETURN_KEY = "avora_edit_return_to";

const MemoryHero = ({
    username,
    memory,
    openGallery,
    isOwner,
    isLoggedIn,
    locationState,
    onDownloadClick,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const incomingFrom = locationState?.from || location.state?.from || sessionStorage.getItem(RETURN_KEY);
    const from = incomingFrom || `/${username}`;
    const label = locationState?.label || (incomingFrom?.includes("/dashboard/memories") ? "Memories" : "Profile");

    // The Edit button should return here — to this exact memory page —
    // not to wherever the user originally came from (that's only for
    // the "Back to ..." button above). Keep the current URL, including
    // any query string (e.g. ?image=2), so we land back exactly here.
    const currentMemoryPath = location.pathname + location.search;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => navigate(from)}
                    className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-slate-200/80
                        bg-white
                        px-4
                        py-2.5
                        text-xs
                        sm:text-sm
                        font-bold
                        text-slate-700
                        shadow-sm
                        transition-all
                        duration-300
                        cursor-pointer
                        hover:bg-slate-50
                        hover:border-slate-300
                        active:scale-95
                    "
                >
                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    <span>Back to {label}</span>
                </button>

                {isOwner && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onDownloadClick}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-2xl
                                bg-slate-900
                                px-4
                                py-2.5
                                text-xs
                                sm:text-sm
                                font-bold
                                text-white
                                shadow-sm
                                transition-all
                                duration-300
                                cursor-pointer
                                hover:bg-slate-800
                                active:scale-95
                            "
                        >
                            <Download size={15} />
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // Capture THIS memory page as the return target, immediately,
                                // before navigating — so after saving, EditMemory sends the
                                // user back here rather than to the list they came from.
                                sessionStorage.setItem(RETURN_KEY, currentMemoryPath);
                                navigate(
                                    `/dashboard/edit-memory/${memory._id}`,
                                    {
                                        state: {
                                            from: currentMemoryPath,
                                            label: "Memory",
                                        },
                                    }
                                );
                            }}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-slate-200/80
                                bg-white/90
                                px-4
                                py-2.5
                                text-xs
                                sm:text-sm
                                font-bold
                                text-slate-700
                                shadow-sm
                                backdrop-blur-md
                                transition-all
                                duration-300
                                cursor-pointer
                                hover:bg-white
                                hover:text-slate-900
                                hover:border-slate-300
                                active:scale-95
                            "
                        >
                            <Pencil size={15} />
                            <span className="hidden sm:inline">Edit Memory</span>
                            <span className="sm:hidden">Edit</span>
                        </button>
                    </div>
                )}
            </div>

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
                <div className="xl:col-span-5">
                    <div className="rounded-[32px] border border-slate-200/80 bg-white shadow-xl shadow-sky-950/[0.03] overflow-hidden">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <MemoryInfo memory={memory} isOwner={isOwner} isLoggedIn={isLoggedIn} />
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-7">
                    <CoverImage image={memory.coverImage} onClick={() => openGallery(0)} />
                    {memory.media && memory.media.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                            <MediaPreview media={memory.media} onOpenGallery={openGallery} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MemoryHero;
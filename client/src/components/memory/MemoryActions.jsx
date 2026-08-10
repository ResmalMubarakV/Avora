import { useEffect, useRef, useState } from "react";
import {
    MoreVertical,
    Pencil,
    Share2,
    Trash2,
    Pin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import api from "../../api/axios";
import { deleteMemory } from "../../api/memoryApi";
import DeleteMemoryModal from "./DeleteMemoryModal";

const RETURN_KEY = "avora_edit_return_to";

// ==========================================
// MEMORY ACTIONS COMPONENT
// ==========================================
const MemoryActions = ({
    memory,
    redirect = true,
    redirectTo,
    onDeleted,
    onPinUpdated,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPinned, setIsPinned] = useState(memory.isPinned);

    useEffect(() => {
        setIsPinned(memory.isPinned);
    }, [memory.isPinned]);

    // --- Click Outside to Close Menu Listener ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // --- Handle Edit Navigation (Preserves exact pagination search parameters) ---
    const handleEdit = () => {
        setOpen(false);

        // Resolve path from prop, or fallback precisely to current path + query string (e.g. ?page=4)
        const originPath = typeof redirectTo === "object" ? redirectTo?.from : redirectTo;
        const finalFrom = originPath || location.pathname + location.search;

        // Persist immediately in sessionStorage so EditMemory can read it on mount,
        // even before the React Router navigation state is available.
        sessionStorage.setItem(RETURN_KEY, finalFrom);

        navigate(
            `/dashboard/edit-memory/${memory._id}`,
            {
                state: {
                    from: finalFrom,
                    label: finalFrom.includes("/dashboard") ? "Dashboard" : "Profile",
                },
            }
        );
    };

    // --- Handle Pin / Unpin Toggle ---
    const handleTogglePin = async () => {
        setOpen(false);
        try {
            const { data } = await api.patch(`/api/memories/${memory._id}/pin`);
            setIsPinned(data.isPinned);
            toast.success(data.isPinned ? "Memory pinned successfully." : "Memory unpinned.");
            if (onPinUpdated) {
                onPinUpdated(memory._id, data.isPinned);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update pin status."
            );
        }
    };

    // --- Handle Sharing ---
    const handleShare = async () => {
        setOpen(false);

        const url =
            `${window.location.origin}/${memory.user.username}/${memory.slug}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: memory.title,
                    text: memory.title,
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            toast.success("Memory link copied.");
        } catch {
            toast.error("Unable to share memory.");
        }
    };

    // --- Handle Delete Execution ---
    const handleDelete = async () => {
        try {
            setLoading(true);

            await deleteMemory(memory._id);

            toast.success("Memory deleted successfully.");
            setShowDeleteModal(false);

            if (onDeleted) {
                onDeleted(memory._id);
            }

            if (redirect) {
                const fallbackRedirect = typeof redirectTo === "object" ? redirectTo?.from : redirectTo;
                navigate(
                    fallbackRedirect || "/dashboard/memories",
                    {
                        replace: true,
                    }
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete memory."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                ref={menuRef}
                className="relative inline-block"
            >
                {/* Trigger Menu Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((prev) => !prev);
                    }}
                    aria-label="Memory options"
                    className="
                        flex
                        cursor-pointer
                        h-7
                        w-7
                        sm:h-9
                        sm:w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200/80
                        bg-white
                        text-slate-600
                        shadow-sm
                        transition-all
                        duration-200
                        hover:bg-slate-50
                        hover:text-slate-900
                        hover:shadow-md
                    "
                >
                    <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                </button>

                {/* Dropdown Menu Popup */}
                {open && (
                    <div
                        className="
                            absolute
                            bottom-full
                            right-0
                            mb-2
                            w-36
                            sm:w-44
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200/80
                            bg-white
                            shadow-xl
                            ring-1
                            ring-black/5
                            z-50
                        "
                    >
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-3
                                py-2
                                sm:px-3.5
                                sm:py-2
                                text-[11px]
                                sm:text-xs
                                font-medium
                                text-slate-700
                                transition
                                cursor-pointer
                                hover:bg-slate-50
                            "
                        >
                            <Pencil size={13} className="text-slate-500" />
                            Edit Memory
                        </button>

                        <button
                            type="button"
                            onClick={handleTogglePin}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-3
                                py-2
                                sm:px-3.5
                                sm:py-2
                                text-[11px]
                                sm:text-xs
                                font-medium
                                text-slate-700
                                transition
                                cursor-pointer
                                hover:bg-slate-50
                            "
                        >
                            <Pin size={13} className={`text-slate-500 ${isPinned ? "fill-slate-500" : ""}`} />
                            {isPinned ? "Unpin Memory" : "Pin Memory"}
                        </button>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-3
                                py-2
                                sm:px-3.5
                                sm:py-2
                                text-[11px]
                                sm:text-xs
                                font-medium
                                text-slate-700
                                transition
                                cursor-pointer
                                hover:bg-slate-50
                            "
                        >
                            <Share2 size={13} className="text-slate-500" />
                            Share Memory
                        </button>

                        <div className="border-t border-slate-100" />

                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setShowDeleteModal(true);
                            }}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-3
                                py-2
                                sm:px-3.5
                                sm:py-2
                                text-[11px]
                                sm:text-xs
                                font-medium
                                text-red-600
                                transition
                                cursor-pointer
                                hover:bg-red-50
                            "
                        >
                            <Trash2 size={13} className="text-red-500" />
                            Delete Memory
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal Portal Wrapper */}
            <div onClick={(e) => e.stopPropagation()}>
                <DeleteMemoryModal
                    open={showDeleteModal}
                    loading={loading}
                    onClose={() =>
                        setShowDeleteModal(false)
                    }
                    onDelete={handleDelete}
                />
            </div>
        </>
    );
};

export default MemoryActions;
import { useEffect, useRef, useState } from "react";
import {
    MoreVertical,
    Pencil,
    Share2,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteMemory } from "../../api/memoryApi";
import DeleteMemoryModal from "./DeleteMemoryModal";

// ==========================================
// MEMORY ACTIONS COMPONENT
// ==========================================
/**
 * Renders an interactive action dropdown menu for memory cards/details (Edit, Share, Delete), 
 * positioned above the trigger button and cleanly contained within the card bounds.
 */
const MemoryActions = ({
    memory,
    redirect = true,
    redirectTo = "/dashboard/memories",
    onDeleted,
}) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

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

    // --- Handle Edit Navigation ---
    const handleEdit = () => {
        setOpen(false);
        navigate(
            `/dashboard/edit-memory/${memory._id}`,
            {
                state: {
                    from: redirectTo,
                    label:
                        redirectTo === "/dashboard"
                            ? "Dashboard"
                            : "Profile",
                },
            }
        );
    };

    // --- Handle Sharing (Web Share API or Clipboard Fallback) ---
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
                navigate(
                    redirectTo,
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

                {/* Dropdown Menu Popup - Positioned strictly above the trigger button inside the card */}
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
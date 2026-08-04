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

const MemoryActions = ({
    memory,
    redirect = true,
    redirectTo = "/dashboard/memories",
    onDeleted,
}) => {

    const navigate = useNavigate();

    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [loading, setLoading] = useState(false);

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

            toast.success(
                "Memory link copied."
            );

        } catch {

            toast.error(
                "Unable to share memory."
            );

        }

    };

    const handleDelete = async () => {

        try {

            setLoading(true);

            await deleteMemory(memory._id);

            toast.success(
                "Memory deleted successfully."
            );

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
                className="inline-block"
            >

                <button
                    type="button"
                    onClick={(e) => {

                        e.stopPropagation();

                        setOpen((prev) => !prev);

                    }}
                    className="
                        flex
                        cursor-pointer
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full

                        border
                        border-slate-200

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

                    <MoreVertical size={18} />

                </button>

                {open && (

                    <div
                        className="
                            absolute
                            bottom-full
                            right-0
                            mb-3

                            w-56

                            overflow-hidden
                            rounded-2xl

                            border
                            border-slate-200

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
                                gap-3

                                px-5
                                py-3

                                text-sm
                                font-medium
                                text-slate-700

                                transition

                                hover:bg-slate-50
                            "
                        >

                            <Pencil size={17} />

                            Edit Memory

                        </button>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3

                                px-5
                                py-3

                                text-sm
                                font-medium
                                text-slate-700

                                transition

                                hover:bg-slate-50
                            "
                        >

                            <Share2 size={17} />

                            Share Memory

                        </button>

                        <div className="border-t border-slate-200" />

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
                                gap-3

                                px-5
                                py-3

                                text-sm
                                font-medium
                                text-red-600

                                transition

                                hover:bg-red-50
                            "
                        >

                            <Trash2 size={17} />

                            Delete Memory

                        </button>

                    </div>

                )}

            </div>

            <div
                onClick={(e) => e.stopPropagation()}
            >
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
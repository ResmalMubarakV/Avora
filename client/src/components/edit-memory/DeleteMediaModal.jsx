import { Trash2 } from "lucide-react";

// ==========================================
// DELETE MEDIA MODAL COMPONENT
// ==========================================
/**
 * Renders a confirmation dialog modal for deleting a specific media item 
 * (photo or video) from an existing travel memory. Supports loading states 
 * and backdrop blur.
 */
const DeleteMediaModal = ({
  open,
  loading,
  onClose,
  onDelete,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Warning Icon Badge */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800/50">
          <Trash2 size={30} className="text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Delete Media?
        </h2>

        {/* Description */}
        <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
          This media will be permanently deleted from this memory and cannot be
          recovered.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-3 font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMediaModal;
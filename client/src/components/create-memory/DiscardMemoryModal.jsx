import {
  AlertTriangle,
  X,
  CheckCircle2,
} from "lucide-react";

// ==========================================
// DISCARD MEMORY MODAL COMPONENT
// ==========================================
/**
 * Confirmation modal displayed when a user attempts to leave the memory creation/editing form 
 * with unsaved changes. Warns that all entered progress will be lost and provides 
 * options to continue editing, publish changes, or discard.
 */
const DiscardMemoryModal = ({
  open,
  onClose,
  onDiscard,
  onPublish,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/50">
              <AlertTriangle size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Unsaved Changes
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">You have modifications pending</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-6">
          <p className="leading-7 text-slate-600 dark:text-slate-300">
            You have unsaved changes that haven't been published yet. What would you like to do?
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 px-6 pb-6">
          {/* Discard Button */}
          <button
            onClick={onDiscard}
            disabled={loading}
            className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-100/60 dark:hover:bg-red-900/60 cursor-pointer disabled:opacity-50"
          >
            Discard
          </button>

          {/* Continue Editing Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
          >
            Continue Editing
          </button>

          {/* Publish / Save Button */}
          {onPublish && (
            <button
              onClick={onPublish}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] dark:from-indigo-600 dark:to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#1E3A8A]/20 dark:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{loading ? "Publishing..." : "Publish Now"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscardMemoryModal;
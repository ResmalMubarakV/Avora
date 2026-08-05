import {
  AlertTriangle,
  X,
} from "lucide-react";

// ==========================================
// DISCARD MEMORY MODAL COMPONENT
// ==========================================
/**
 * Confirmation modal displayed when a user attempts to leave the memory creation/editing form 
 * with unsaved changes. Warns that all entered progress will be lost and provides 
 * options to continue editing or discard changes.
 */
const DiscardMemoryModal = ({
  open,
  onClose,
  onDiscard,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <AlertTriangle size={22} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Discard Memory?
              </h2>
              <p className="text-sm text-slate-500">Unsaved changes detected</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-6">
          <p className="leading-7 text-slate-600">
            You have unsaved changes that haven't been published yet.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            If you leave now, everything you've entered will be permanently lost.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#3559D4] px-5 py-2.5 font-semibold text-white transition hover:bg-[#1E3A8A]"
          >
            Continue Editing
          </button>

          <button
            onClick={onDiscard}
            className="rounded-xl border border-red-200 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardMemoryModal;
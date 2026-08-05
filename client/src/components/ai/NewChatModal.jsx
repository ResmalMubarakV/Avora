import { AlertTriangle } from "lucide-react";

// ==========================================
// NEW CHAT MODAL COMPONENT
// ==========================================
/**
 * Confirmation modal displayed when a user attempts to start a new AI chat session.
 * Warns that the current conversation will be cleared and provides confirmation/cancellation actions.
 */
const NewChatModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Modal Card */}
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        {/* Warning Icon Header */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#3559D4]">
            <AlertTriangle size={30} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-center text-2xl font-bold text-slate-900">
          Start New Chat?
        </h2>

        {/* Description */}
        <p className="mt-3 text-center text-slate-500">
          Your current conversation will be cleared.
        </p>

        {/* Action Buttons Toolbar */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#3559D4] py-3 font-medium text-white transition hover:bg-[#2748BC]"
          >
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
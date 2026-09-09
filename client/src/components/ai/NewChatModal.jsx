import { useState, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

// ==========================================
// NEW CHAT MODAL COMPONENT (RESPONSIVE)
// ==========================================
/**
 * Confirmation modal displayed when a user attempts to start a new AI chat session.
 * Fully draggable anywhere on the screen by clicking and dragging the modal card.
 */
const NewChatModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  // --- Draggable State ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (moveEvent) => {
      if (!isDragging.current) return;
      setPosition({
        x: moveEvent.clientX - dragStart.current.x,
        y: moveEvent.clientY - dragStart.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (!e.touches[0] || e.target.closest("button")) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };

    const handleTouchMove = (moveEvent) => {
      if (!isDragging.current || !moveEvent.touches[0]) return;
      setPosition({
        x: moveEvent.touches[0].clientX - dragStart.current.x,
        y: moveEvent.touches[0].clientY - dragStart.current.y,
      });
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 select-none animate-in fade-in duration-200">
      {/* Modal Card with translate position and drag handlers */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-2xl relative cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out"
      >
        {/* Close Icon Top Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Drag Handle Bar Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-10 sm:w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Warning Icon Header */}
        <div className="flex justify-center mt-2 sm:mt-3">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-indigo-950/70 text-[#3559D4] dark:text-indigo-400 border border-blue-100 dark:border-indigo-900/50">
            <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-center text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white pointer-events-none">
          Start New Chat?
        </h2>

        {/* Description */}
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 pointer-events-none">
          Your current conversation and generated travel suggestions will be cleared.
        </p>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 flex gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-[#3559D4] to-blue-600 dark:from-indigo-600 dark:to-blue-600 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
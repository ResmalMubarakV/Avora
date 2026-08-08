import { useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";

// ==========================================
// NEW CHAT MODAL COMPONENT
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
    // Prevent drag trigger if clicking directly on buttons
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 select-none">
      {/* Modal Card with translate position and drag handlers */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl relative cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out"
      >
        {/* Drag Handle Bar Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-12 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Warning Icon Header */}
        <div className="flex justify-center mt-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#3559D4]">
            <AlertTriangle size={30} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-center text-2xl font-bold text-slate-900 pointer-events-none">
          Start New Chat?
        </h2>

        {/* Description */}
        <p className="mt-3 text-center text-slate-500 pointer-events-none">
          Your current conversation will be cleared.
        </p>

        {/* Action Buttons Toolbar */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#3559D4] py-3 font-medium text-white transition hover:bg-[#2748BC] cursor-pointer"
          >
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
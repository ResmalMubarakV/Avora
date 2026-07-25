import { LogOut, X } from "lucide-react";
import { useEffect } from "react";

const LogoutModal = ({ open, onClose, onConfirm }) => {
    
    useEffect(() => {
        if (!open) return;
        
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
            
            if (e.key === "Enter") {
                onConfirm();
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose, onConfirm]);
    
    if (!open) return null;

return (
    <div
        className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/60
            backdrop-blur-md
            p-4
        "
        onClick={onClose}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            className="
                w-full
                max-w-md
                overflow-hidden
                rounded-3xl
                border
                border-white/20
                bg-white/95
                shadow-[0_30px_80px_rgba(15,23,42,0.25)]
                backdrop-blur-xl
                animate-in
                fade-in
                zoom-in-95
                duration-200
            "
        >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-red-50
                            to-red-100
                            border
                            border-red-200
                        "
                    >
                        <LogOut
                            size={24}
                            className="text-red-600"
                        />
                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Sign out of Avora?
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your current session will be ended.
                        </p>

                    </div>

                </div>

                <button
                    onClick={onClose}
                    className="
                        rounded-xl
                        p-2
                        text-slate-500
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                    "
                >
                    <X size={18} />
                </button>

            </div>

            {/* Body */}

            <div className="px-6 py-6">

                <p className="text-[15px] leading-7 text-slate-600">

                    You'll need to sign in again to access your dashboard,
                    private memories, AI assistant, and account settings.

                </p>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-5">

                <button
                    onClick={onClose}
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        py-2.5
                        font-medium
                        text-slate-700
                        transition-all
                        duration-200
                        hover:border-slate-300
                        hover:bg-slate-100
                    "
                >
                    Cancel
                </button>

                <button
                    onClick={onConfirm}
                    className="
                        rounded-xl
                        bg-red-600
                        px-5
                        py-2.5
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-red-500/20
                        transition-all
                        duration-200
                        hover:bg-red-700
                        hover:shadow-xl
                        hover:shadow-red-500/30
                        active:scale-[0.98]
                    "
                >
                    Sign Out
                </button>

            </div>
        </div>
    </div>
);
};

export default LogoutModal;
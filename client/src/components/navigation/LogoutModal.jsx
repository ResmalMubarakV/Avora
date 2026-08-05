import { createPortal } from "react-dom";
import { LogOut, X, ShieldAlert } from "lucide-react";

// ==========================================
// ADMIN LOGOUT MODAL COMPONENT
// ==========================================
/**
 * Renders an elite, premium SaaS logout modal with contextual security warnings 
 * and precise viewport centering via React portals.
 */
const LogoutModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shadow-sm shrink-0">
                            <ShieldAlert size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                Terminate Session
                            </h3>
                            <p className="text-xs font-medium text-slate-500">
                                Avora Enterprise Control Center
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Modal"
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Description Body with Warning */}
                <div className="space-y-4 mb-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Are you sure you want to sign out of the <span className="font-bold text-slate-900">Avora Enterprise Control Center</span>? Your active session token will be securely cleared.
                    </p>

                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 shadow-inner">
                        <ShieldAlert size={16} className="shrink-0 text-amber-600 mt-0.5" />
                        <span className="leading-normal font-medium">
                            <strong className="font-bold">Security Notice:</strong> You will need to re-authenticate with your administrator credentials to regain access to management features.
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer active:scale-95 shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-red-600/25 transition hover:from-red-500 hover:to-rose-500 active:scale-95 cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { LogOut, ShieldAlert, X } from "lucide-react";

// ==========================================
// PORTAL-BASED UNIFORM CENTERED LOGOUT MODAL
// ==========================================
const LogoutModal = ({ isOpen, open, onClose, onConfirm, isAdmin = false, loading = false }) => {
    const isModalVisible = isOpen ?? open;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isModalVisible || !mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-3xl border bg-white shadow-2xl overflow-hidden ${
                isAdmin ? "border-red-200 shadow-[0_20px_60px_rgba(239,68,68,0.2)]" : "border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            }`}>
                
                {/* Conditional Accent Top Bar */}
                {isAdmin && <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />}

                <div className="p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className={`flex items-center gap-3 ${isAdmin ? "text-red-600" : "text-blue-600"}`}>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-inner ${
                                isAdmin ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
                            }`}>
                                {isAdmin ? <ShieldAlert size={22} /> : <LogOut size={22} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {isAdmin ? "Terminate Admin Session" : "Sign Out"}
                                </h3>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    {isAdmin ? "Avora Enterprise Control Center" : "Avora Travel Platform"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-700 mb-5 leading-relaxed font-medium">
                        {isAdmin ? (
                            <>
                                Are you sure you want to sign out of the <span className="font-extrabold text-slate-900">Avora Enterprise Control Center</span>? Your active administrative session will be securely cleared.
                            </>
                        ) : (
                            <>
                                Are you sure you want to sign out of your <span className="font-extrabold text-slate-900">Avora</span> account? You can log back in anytime to access your travel memories.
                            </>
                        )}
                    </p>

                    {/* Notice Box */}
                    {isAdmin ? (
                        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-xs text-red-900 space-y-1">
                            <div className="flex items-center gap-2 font-bold text-red-800">
                                <span>⚠</span>
                                <span>Security Notice</span>
                            </div>
                            <p className="text-red-700/90 font-medium">
                                You will need to re-authenticate with your administrator credentials to regain access to management features.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 space-y-1">
                            <div className="flex items-center gap-2 font-bold text-blue-800">
                                <span>ℹ</span>
                                <span>Session Info</span>
                            </div>
                            <p className="text-blue-700/90 font-medium">
                                Your local session data will be safely cleared. Public stories remain visible to visitors.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onConfirm) onConfirm();
                            }}
                            disabled={loading}
                            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-semibold text-white shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 ${
                                isAdmin 
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/20" 
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                            }`}
                        >
                            <LogOut size={15} />
                            <span>{isAdmin ? "Terminate Session" : "Sign Out"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
import { useState } from "react";
import { ShieldAlert, X, Loader2, Eye, EyeOff } from "lucide-react";

// ==========================================
// SECURE DELETION CONFIRMATION MODAL
// ==========================================
const DeleteMemoryModal = ({ selectedMemory, onClose, onConfirm, deleteLoading, deleteError }) => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!selectedMemory) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onConfirm(password);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !deleteLoading) {
            e.preventDefault();
            onConfirm(password);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-red-200/80 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(239,68,68,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* Thin Red Accent Top Border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shrink-0" />

                <div className="p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900/50 shadow-inner shrink-0">
                                <ShieldAlert size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">Confirm Story Deletion</h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleteLoading}
                            aria-label="Close Modal"
                            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition disabled:opacity-50 shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Warning Text */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                        This action cannot be undone. Permanently delete memory <span className="font-bold text-slate-900 dark:text-white">"{selectedMemory.title}"</span> and all associated assets?
                    </p>

                    {/* Warning Box */}
                    <div className="mb-4 rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/40 p-3.5 text-xs text-red-900 dark:text-red-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-300">
                            <span>⚠ Permanent Removal</span>
                        </div>
                        <p className="text-[11px] text-red-700/90 dark:text-red-300/90 font-medium">
                            Deleting will permanently remove cover photos, gallery media, and travel story records.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {deleteError && (
                        <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/60 p-3 text-xs font-semibold text-red-700 dark:text-red-300">
                            {deleteError}
                        </div>
                    )}

                    {/* Password Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                Admin Master Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter administrator password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    required
                                    autoFocus
                                    disabled={deleteLoading}
                                    className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3 pl-3.5 pr-11 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-red-500 dark:focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={deleteLoading}
                                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={deleteLoading || !password}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Confirm Delete</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteMemoryModal;
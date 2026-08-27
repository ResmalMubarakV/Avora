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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            {/* max-h-[90vh] and overflow-y-auto prevent vertical overflow on small or ultra-wide viewports */}
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(239,68,68,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Thin Red Accent Top Border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shrink-0" />

                <div className="p-5 sm:p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900/50 shadow-inner shrink-0">
                                <ShieldAlert size={22} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">Confirm Deletion</h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleteLoading}
                            aria-label="Close Modal"
                            className="rounded-xl p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition disabled:opacity-50 shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Strong Warning Text */}
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-5 leading-relaxed font-medium">
                        This action cannot be undone. Permanently delete <span className="font-extrabold text-slate-900 dark:text-white">"{selectedMemory.title}"</span> and all associated photos, videos, and metadata?
                    </p>

                    {/* Professional Warning Box */}
                    <div className="mb-5 rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/40 p-4 text-xs text-red-900 dark:text-red-200 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300">
                            <span className="text-red-600 dark:text-red-400">⚠</span>
                            <span>Permanent Action</span>
                        </div>
                        <p className="text-red-700/90 dark:text-red-300/90 font-medium">Deleting this memory will permanently remove:</p>
                        <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-300 font-semibold pl-1">
                            <li>Cover image</li>
                            <li>Gallery media</li>
                            <li>Travel story</li>
                            <li>Associated Cloudinary files</li>
                        </ul>
                        <p className="pt-1 text-[11px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wide border-t border-red-200/60 dark:border-red-900/50 mt-2">
                            This action cannot be reversed.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {deleteError && (
                        <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/60 p-3.5 text-xs font-semibold text-red-700 dark:text-red-300">
                            {deleteError}
                        </div>
                    )}

                    {/* Password Form with Show/Hide & Enter Key Support */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                Admin Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your administrator password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    required
                                    autoFocus
                                    disabled={deleteLoading}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-3.5 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-red-500 dark:focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/50 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={deleteLoading}
                                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={deleteLoading || !password}
                                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
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
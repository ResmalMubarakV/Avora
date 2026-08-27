import { useState } from "react";
import { ShieldAlert, X, Loader2, Eye, EyeOff } from "lucide-react";

// ==========================================
// SECURE USER DELETION CONFIRMATION MODAL
// ==========================================
const DeleteUserModal = ({ selectedUser, onClose, onConfirm, deleteLoading, deleteError }) => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!selectedUser) return null;

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
            <div className="w-full max-w-md rounded-3xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(239,68,68,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* Thin Red Accent Top Border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

                <div className="p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900/50 shadow-inner">
                                <ShieldAlert size={22} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm User Deletion</h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleteLoading}
                            className="rounded-xl p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Strong Warning Text */}
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-5 leading-relaxed font-medium">
                        This action cannot be undone. Permanently delete user <span className="font-extrabold text-slate-900 dark:text-white">"{selectedUser.name || selectedUser.username}"</span> (@{selectedUser.username}) and all associated records?
                    </p>

                    {/* Error Banner */}
                    {deleteError && (
                        <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/60 p-3.5 text-xs font-semibold text-red-700 dark:text-red-300">
                            {deleteError}
                        </div>
                    )}

                    {/* Password Form */}
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

export default DeleteUserModal;
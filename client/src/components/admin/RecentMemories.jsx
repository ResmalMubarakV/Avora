import { Eye, Trash2, ArrowUpRight, Globe, Lock } from "lucide-react";

// ==========================================
// RECENT MEMORIES COMPONENT
// ==========================================
/**
 * Renders the recent travel stories list with clear status badges, 
 * interactive thumbnail previews, and tooltipped action buttons.
 */
const RecentMemories = ({ memories = [], onView, onDelete }) => {
    return (
        /* w-full ensures it fits container bounds cleanly across all screen sizes */
        <div className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-7 2xl:p-8 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Recent Memories
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        Latest travel stories published across the platform
                    </p>
                </div>
            </div>

            {/* List or Empty State */}
            {memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        No recent memories found
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {memories.map((memory) => {
                        const isPublic = memory.visibility === "public" || memory.isPublic;
                        return (
                            <div
                                key={memory._id}
                                className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <img
                                        src={memory.coverImage || memory.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80"}
                                        alt={memory.title}
                                        className="h-12 w-12 rounded-xl object-cover shadow-xs shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition">
                                            {memory.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                                @{memory.user?.username || "unknown"}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isPublic 
                                                    ? "bg-blue-50 dark:bg-sky-950/80 text-blue-600 dark:text-sky-300 border border-blue-100 dark:border-sky-800/50" 
                                                    : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700"
                                            }`}>
                                                {isPublic ? <Globe size={10} /> : <Lock size={10} />}
                                                {isPublic ? "Public" : "Private"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons with Tooltips */}
                                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                                    {/* Show View button only if the memory is public */}
                                    {isPublic && (
                                        <button
                                            type="button"
                                            onClick={() => onView(memory)}
                                            title="Preview Story"
                                            aria-label="Preview Story"
                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-indigo-300 cursor-pointer shadow-xs transition active:scale-95"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onDelete(memory._id)}
                                        title="Delete Memory"
                                        aria-label="Delete Memory"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-200 dark:hover:border-red-800 cursor-pointer shadow-xs transition active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentMemories;
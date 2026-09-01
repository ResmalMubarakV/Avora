import { Eye, Trash2, Globe, Lock, Images, MapPin } from "lucide-react";

// ==========================================
// RECENT MEMORIES COMPONENT
// ==========================================
const RecentMemories = ({ memories = [], onView, onDelete }) => {
    return (
        <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-xs transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Images size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                            Recent Travel Memories
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Latest published travel stories across the community
                        </p>
                    </div>
                </div>
            </div>

            {/* List or Empty State */}
            {memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200/80 dark:border-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2">
                        <Images size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        No Memories Yet
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        No memories have been published on the platform.
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {memories.map((memory) => {
                        const isPublic = memory.visibility === "public" || memory.isPublic;
                        return (
                            <div
                                key={memory._id}
                                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xs transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={memory.coverImage || memory.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80"}
                                        alt={memory.title}
                                        className="h-11 w-14 rounded-xl object-cover border border-slate-200/60 dark:border-slate-700 shadow-2xs shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition">
                                            {memory.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                                @{memory.user?.username || "traveler"}
                                            </span>
                                            {memory.location && (
                                                <>
                                                    <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate flex items-center gap-0.5">
                                                        <MapPin size={10} className="shrink-0" />
                                                        {memory.location}
                                                    </span>
                                                </>
                                            )}
                                            <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                                                isPublic 
                                                    ? "bg-blue-50 dark:bg-sky-950/80 text-blue-600 dark:text-sky-300 border border-blue-100 dark:border-sky-800/50" 
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                            }`}>
                                                {isPublic ? <Globe size={9} /> : <Lock size={9} />}
                                                {isPublic ? "Public" : "Private"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                    {isPublic && (
                                        <button
                                            type="button"
                                            onClick={() => onView(memory)}
                                            title="Preview Story"
                                            aria-label="Preview Story"
                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-indigo-300 cursor-pointer shadow-2xs transition active:scale-95"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onDelete(memory._id)}
                                        title="Delete Memory"
                                        aria-label="Delete Memory"
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-red-200/80 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-800 cursor-pointer shadow-2xs transition active:scale-95"
                                    >
                                        <Trash2 size={14} />
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
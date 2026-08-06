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
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Recent Memories
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                        Latest travel stories published across the platform
                    </p>
                </div>
            </div>

            {/* List or Empty State */}
            {memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <img
                                        src={memory.coverImage || memory.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80"}
                                        alt={memory.title}
                                        className="h-12 w-12 rounded-xl object-cover shadow-xs shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                                            {memory.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500 font-medium truncate">
                                                @{memory.user?.username || "unknown"}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isPublic 
                                                    ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                                    : "bg-slate-200/70 text-slate-600 border border-slate-300/60"
                                            }`}>
                                                {isPublic ? <Globe size={10} /> : <Lock size={10} />}
                                                {isPublic ? "Public" : "Private"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons with Tooltips */}
                                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                                    {isPublic && (
                                        <button
                                            type="button"
                                            onClick={() => onView(memory)}
                                            title="Preview Story"
                                            aria-label="Preview Story"
                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 cursor-pointer shadow-xs transition active:scale-95"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onDelete(memory._id)}
                                        title="Delete Memory"
                                        aria-label="Delete Memory"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer shadow-xs transition active:scale-95"
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
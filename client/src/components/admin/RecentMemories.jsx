import { Eye, Trash2, Globe, Lock, Images, MapPin, Sparkles } from "lucide-react";

// ==========================================
// RECENT MEMORIES COMPONENT
// ==========================================
const RecentMemories = ({
    memories = [],
    onView = () => {},
    onDelete = () => {},
}) => {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col h-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Recent Memories
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Recently published travel stories across the platform.
                    </p>
                </div>
                <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Sparkles size={16} />
                </div>
            </div>

            {/* Empty State */}
            {memories.length === 0 ? (
                <div className="flex flex-1 h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
                        <Images size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                        No Memories Found
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                        There are no travel memories published in the system yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 flex-1">
                    {memories.map((memory) => (
                        <div
                            key={memory._id}
                            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <img
                                    src={
                                        memory.coverImage ||
                                        "https://placehold.co/120x80/e2e8f0/475569?text=Memory"
                                    }
                                    alt={memory.title}
                                    className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-xl object-cover border border-slate-200 shadow-sm"
                                    draggable={false}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 truncate text-sm">
                                            {memory.title}
                                        </h3>
                                        {memory.isPublic ? (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                                <Globe size={11} /> Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                                <Lock size={11} /> Private
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                                        <MapPin size={12} className="shrink-0 text-slate-400" />
                                        <span className="truncate">{memory.location || "No location specified"}</span>
                                    </p>
                                    <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                                        By {memory.user?.name || "Unknown"} <span className="text-[#3559D4]">@{memory.user?.username || "unknown"}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onView(memory)}
                                    aria-label="View Memory"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Eye size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(memory._id)}
                                    aria-label="Delete Memory"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 hover:border-red-300 cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentMemories;
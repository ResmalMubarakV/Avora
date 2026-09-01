import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Eye, Trash2, Globe, Lock, Images, ArrowLeft, ArrowUpDown, X, MapPin } from "lucide-react";
import { getMemories, deleteMemory } from "../../api/adminApi";
import DeleteMemoryModal from "../../components/admin/DeleteMemoryModal";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// ADMIN MEMORIES PAGE
// ==========================================
const AdminMemories = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const currentVisibility = searchParams.get("visibility") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                setLoading(true);
                const data = await getMemories();
                setMemories(data || []);
            } catch (error) {
                console.error("Fetch Memories Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();
    }, []);

    const handleViewMemory = (memory) => {
        const username = memory.user?.username;
        const slug = memory.slug || memory._id;
        if (username) {
            window.open(`/${username}/${slug}`, "_blank", "noopener,noreferrer");
        } else {
            console.error("Author username missing for redirection.");
        }
    };

    const confirmAndDeleteMemory = async (password) => {
        if (!password) {
            setDeleteError("Password is required to confirm deletion.");
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError("");

            await deleteMemory(selectedMemory._id);
            setMemories((prev) => prev.filter((m) => m._id !== selectedMemory._id));
            setSelectedMemory(null);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Deletion failed. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVisibilityChange = (visibility) => {
        const newParams = new URLSearchParams(searchParams);
        if (visibility === "all") newParams.delete("visibility");
        else newParams.set("visibility", visibility);
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort", e.target.value);
        setSearchParams(newParams);
    };

    const filteredMemories = memories.filter((memory) => {
        const isPublic = memory.isPublic || memory.visibility === "public";
        if (currentVisibility === "public" && !isPublic) return false;
        if (currentVisibility === "private" && isPublic) return false;

        return (
            memory.title?.toLowerCase().includes(search.toLowerCase()) ||
            memory.location?.toLowerCase().includes(search.toLowerCase()) ||
            memory.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            memory.user?.username?.toLowerCase().includes(search.toLowerCase())
        );
    }).sort((a, b) => {
        if (currentSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (currentSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (currentSort === "title") return (a.title || "").localeCompare(b.title || "");
        return 0;
    });

    return (
        <div className="space-y-6 pb-16 w-full animate-in fade-in duration-300">
            <PageTitle title="Memories Moderation" />
            
            {/* Top Navigation & Title Header */}
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition w-fit cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Memories Moderation
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                {filteredMemories.length} Stories
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Oversee and moderate travel stories published across the community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Unified Control Toolbar (Search + Visibility Tabs + Sort Dropdown) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                {/* Search input */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search stories by title, location, or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-9 pr-9 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Visibility Filter Tabs & Sort Dropdown */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
                        {[
                            { label: "All", value: "all" },
                            { label: "Public", value: "public" },
                            { label: "Private", value: "private" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleVisibilityChange(tab.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                    currentVisibility === tab.value
                                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl group cursor-pointer shrink-0" title="Sort Order">
                        <ArrowUpDown size={14} className="text-slate-500 dark:text-slate-400 mr-1.5 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
                            {currentSort === "newest" ? "Newest" : currentSort === "oldest" ? "Oldest" : "Title A-Z"}
                        </span>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            aria-label="Sort memories by"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stories Table / List Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden w-full backdrop-blur-md">
                {loading ? (
                    <div className="flex h-56 flex-col items-center justify-center gap-2">
                        <p className="text-xs font-bold text-slate-400 animate-pulse">Loading memories...</p>
                    </div>
                ) : filteredMemories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                            <Images size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No memories found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Try adjusting your search terms or filter selection.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                                    <th className="py-3 px-5 font-bold">Story</th>
                                    <th className="py-3 px-4 font-bold">Location</th>
                                    <th className="py-3 px-4 font-bold">Author</th>
                                    <th className="py-3 px-4 font-bold text-center">Visibility</th>
                                    <th className="py-3 px-4 font-bold">Created</th>
                                    <th className="py-3 px-5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                {filteredMemories.map((memory) => {
                                    const isPublic = memory.isPublic || memory.visibility === "public";
                                    return (
                                        <tr key={memory._id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                            {/* Story Thumbnail + Title */}
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3 min-w-[200px]">
                                                    <img
                                                        src={memory.coverImage || memory.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80"}
                                                        alt={memory.title}
                                                        className="h-11 w-14 rounded-xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                                                            {memory.title}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Location */}
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px]">
                                                {memory.location ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin size={12} className="text-slate-400 shrink-0" />
                                                        <span className="truncate">{memory.location}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">No location</span>
                                                )}
                                            </td>

                                            {/* Author */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    @{memory.user?.username || "unknown"}
                                                </p>
                                                {memory.user?.name && (
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                                        {memory.user.name}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Visibility Badge */}
                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                {isPublic ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 dark:text-sky-300 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-sky-800/50">
                                                        <Globe size={10} /> Public
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                                        <Lock size={10} /> Private
                                                    </span>
                                                )}
                                            </td>

                                            {/* Created Date */}
                                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {memory.createdAt
                                                    ? new Date(memory.createdAt).toLocaleDateString(undefined, {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "N/A"}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-5 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {isPublic && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewMemory(memory)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                            title="Preview Story"
                                                            aria-label="Preview Story"
                                                        >
                                                            <Eye size={12} />
                                                            <span className="hidden sm:inline">Preview</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedMemory(memory)}
                                                        className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                        title="Delete Memory"
                                                        aria-label="Delete Memory"
                                                    >
                                                        <Trash2 size={12} />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Secure Delete Memory Modal */}
            <DeleteMemoryModal
                selectedMemory={selectedMemory}
                onClose={() => { setSelectedMemory(null); setDeleteError(""); }}
                onConfirm={confirmAndDeleteMemory}
                deleteLoading={deleteLoading}
                deleteError={deleteError}
            />
        </div>
    );
};

export default AdminMemories;
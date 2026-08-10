import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Eye, Trash2, Globe, Lock, Images, ArrowLeft, ArrowUpDown, X } from "lucide-react";
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
                setMemories(data);
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
        <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 animate-in fade-in duration-300">
            <PageTitle title="Memories Moderation" />
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition w-fit cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Memories Moderation</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Oversee and moderate published platform travel stories.</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
                        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 p-1 rounded-xl">
                            {[
                                { label: "All", value: "all" },
                                { label: "Public", value: "public" },
                                { label: "Private", value: "private" },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleVisibilityChange(tab.value)}
                                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                                        currentVisibility === tab.value
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex items-center bg-slate-100/80 p-2.5 sm:px-3.5 sm:py-2 rounded-xl group cursor-pointer shrink-0" title="Sort Order">
                            <ArrowUpDown size={16} className="text-slate-500 group-hover:text-slate-900 transition sm:mr-1.5" />
                            <span className="hidden sm:inline text-xs sm:text-sm font-bold text-slate-700 capitalize">
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
            </div>

            <div className="relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by title, location, or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="flex h-48 items-center justify-center">
                        <p className="text-xs sm:text-sm font-bold text-slate-400 animate-pulse">Loading memories...</p>
                    </div>
                ) : filteredMemories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Images size={24} className="text-slate-300 mb-2" />
                        <h3 className="text-sm font-bold text-slate-800">No memories found</h3>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredMemories.map((memory) => {
                            const isPublic = memory.isPublic || memory.visibility === "public";
                            return (
                                <div key={memory._id} className="relative flex flex-col md:grid md:grid-cols-[auto_1fr_160px_140px_100px] items-center p-3.5 sm:p-4 lg:p-5 gap-3.5 md:gap-6 hover:bg-slate-50/60 transition">
                                    {/* Absolute Delete Button for Mobile on Top Right */}
                                    <div className="absolute top-3.5 right-3.5 md:hidden">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMemory(memory)}
                                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 bg-red-50 transition cursor-pointer"
                                            title="Delete Memory"
                                            aria-label="Delete Memory"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>

                                    {/* Column 1: Thumbnail Image */}
                                    <div className="shrink-0 w-full md:w-auto">
                                        <img
                                            src={memory.coverImage || "https://placehold.co/300x200"}
                                            alt={memory.title}
                                            className="h-24 w-full md:h-12 md:w-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                                        />
                                    </div>

                                    {/* Column 2: Memory Title & Location */}
                                    <div className="min-w-0 space-y-0.5 w-full">
                                        <h3 className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 truncate pr-8 md:pr-0">{memory.title}</h3>
                                        <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 font-medium truncate">
                                            {memory.location || "No location"}
                                        </p>
                                    </div>

                                    {/* Column 3: Username (With status inline on mobile) */}
                                    <div className="min-w-0 w-full md:w-auto text-left md:text-center flex items-center justify-between md:block">
                                        <p className="text-[11px] sm:text-xs lg:text-sm font-bold text-slate-600 truncate">
                                            @{memory.user?.username || "unknown"}
                                        </p>
                                        {/* Mobile status inline with username */}
                                        <div className="md:hidden">
                                            {isPublic ? (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                                                    <Globe size={10} /> Public
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                                                    <Lock size={10} /> Private
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 4: Status Badge (Hidden on mobile since it's inline with username, centered on desktop) */}
                                    <div className="hidden md:flex items-center justify-center w-full">
                                        {isPublic ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                                                <Globe size={11} /> Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                                                <Lock size={11} /> Private
                                            </span>
                                        )}
                                    </div>

                                    {/* Column 5: Desktop Action Buttons */}
                                    <div className="hidden md:flex items-center justify-end shrink-0 gap-2">
                                        {isPublic ? (
                                            <button
                                                type="button"
                                                onClick={() => handleViewMemory(memory)}
                                                className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 bg-slate-50 transition cursor-pointer"
                                                title="View Memory"
                                                aria-label="View Memory"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        ) : (
                                            <div className="w-[38px]" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMemory(memory)}
                                            className="p-2 sm:p-2.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 bg-red-50 transition cursor-pointer"
                                            title="Delete Memory"
                                            aria-label="Delete Memory"
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
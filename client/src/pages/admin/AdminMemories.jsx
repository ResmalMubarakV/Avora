import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, Globe, Lock, Images, ShieldAlert, Loader2, X, ArrowLeft, MapPin, User, Calendar } from "lucide-react";
import { getMemories, deleteMemory } from "../../api/adminApi";
import api from "../../api/axios";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// ADMIN MEMORIES PAGE
// ==========================================
const AdminMemories = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [password, setPassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

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
            window.open(`/u/${username}/${slug}`, "_blank");
        } else {
            console.error("Author username missing for redirection.");
        }
    };

    const confirmAndDelete = async (e) => {
        e.preventDefault();
        if (!password) {
            setDeleteError("Password is required to confirm deletion.");
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError("");

            await api.post("/api/auth/login", {
                email: "admin@avora.com",
                password: password,
            });

            await deleteMemory(selectedMemory._id);
            setMemories((prev) => prev.filter((m) => m._id !== selectedMemory._id));
            
            setSelectedMemory(null);
            setPassword("");
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Incorrect password or authentication failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredMemories = memories.filter((memory) => {
        return (
            memory.title?.toLowerCase().includes(search.toLowerCase()) ||
            memory.location?.toLowerCase().includes(search.toLowerCase()) ||
            memory.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            memory.user?.username?.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="space-y-8 pb-16 relative animate-in fade-in duration-300">
            <PageTitle title="Memories Moderation" />

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Dashboard</span>
                </button>

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Memories Moderation
                    </h1>
                    <p className="mt-1 text-sm sm:text-base text-slate-500">
                        Oversee, inspect, and moderate published travel stories across the platform.
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search memories by title, location, or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading memories...</p>
                    </div>
                ) : filteredMemories.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
                        <Images size={32} className="text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-800">No Memories Found</h3>
                        <p className="text-xs text-slate-500 mt-1">There are no matching memories matching your filter.</p>
                    </div>
                ) : (
                    <div className="hidden lg:block overflow-x-hidden">
                        <table className="min-w-full text-left border-collapse">
                            <thead className="bg-slate-50/75 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Memory Story</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Author Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Visibility</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Published</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredMemories.map((memory) => (
                                    <tr key={memory._id} className="transition-colors hover:bg-slate-50/80">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={memory.coverImage || "https://placehold.co/300x200"}
                                                    alt={memory.title}
                                                    className="h-14 w-20 shrink-0 rounded-xl object-cover border border-slate-200 shadow-sm"
                                                />
                                                <div className="min-w-0 max-w-[220px]">
                                                    <h3 className="font-bold text-slate-900 truncate">{memory.title}</h3>
                                                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                                        <MapPin size={11} /> {memory.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[180px]">
                                            <div>
                                                <h3 className="font-bold text-slate-800 truncate">{memory.user?.name || "Unknown"}</h3>
                                                <p className="text-xs font-semibold text-[#3559D4] truncate">@{memory.user?.username || "unknown"}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {memory.isPublic ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    <Globe size={13} /> Public
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    <Lock size={13} /> Private
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                            {memory.createdAt ? new Date(memory.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {memory.isPublic && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewMemory(memory)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-sm active:scale-95"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedMemory(memory)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 cursor-pointer shadow-sm active:scale-95"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedMemory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3 text-red-600">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 border border-red-100">
                                    <ShieldAlert size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedMemory(null);
                                    setPassword("");
                                    setDeleteError("");
                                }}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                            You are about to permanently delete <span className="font-bold text-slate-900">"{selectedMemory.title}"</span>. Please enter your administrator password to confirm.
                        </p>

                        {deleteError && (
                            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                                {deleteError}
                            </div>
                        )}

                        <form onSubmit={confirmAndDelete} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Admin Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedMemory(null);
                                        setPassword("");
                                        setDeleteError("");
                                    }}
                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteLoading}
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
            )}
        </div>
    );
};

export default AdminMemories;
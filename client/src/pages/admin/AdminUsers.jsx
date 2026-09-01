import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getUsers, approveUser, suspendUser, deleteUser } from "../../api/adminApi";
import { getMyProfile } from "../../api/userApi";
import { Search, Loader2, UserCheck, ShieldAlert, Trash2, X, ExternalLink, ArrowLeft, ArrowUpDown, Users, Shield } from "lucide-react";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// ADMIN USERS PAGE
// ==========================================
const AdminUsers = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [currentAdminId, setCurrentAdminId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const urlSearchQuery = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(urlSearchQuery);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const currentStatus = searchParams.get("status") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        const fetchCurrentAdmin = async () => {
            try {
                const profile = await getMyProfile();
                if (profile?._id) setCurrentAdminId(profile._id);
            } catch (err) {
                console.error("Failed to fetch current admin profile", err);
            }
        };
        fetchCurrentAdmin();
    }, []);

    const fetchUsers = useCallback(async (searchQuery = "", statusFilter = "all", sortBy = "newest") => {
        try {
            setLoading(true);
            const response = await getUsers({ search: searchQuery, status: statusFilter });
            let userArray = response?.users || response?.data || response || [];
            
            userArray.sort((a, b) => {
                if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
                if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
                if (sortBy === "name") return (a.name || a.username || "").localeCompare(b.name || b.username || "");
                return 0;
            });

            setUsers(Array.isArray(userArray) ? userArray : []);
        } catch (error) {
            console.error("Fetch Users Error:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(urlSearchQuery, currentStatus, currentSort);
    }, [urlSearchQuery, currentStatus, currentSort, fetchUsers]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== urlSearchQuery) {
                fetchUsers(searchTerm, currentStatus, currentSort);
                const newParams = new URLSearchParams(searchParams);
                if (searchTerm.trim()) newParams.set("search", searchTerm);
                else newParams.delete("search");
                setSearchParams(newParams, { replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentStatus, currentSort, urlSearchQuery, fetchUsers, searchParams, setSearchParams]);

    const handleFilterChange = (status) => {
        const newParams = new URLSearchParams(searchParams);
        if (status === "all") newParams.delete("status");
        else newParams.set("status", status);
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort", e.target.value);
        setSearchParams(newParams);
    };

    const handleApprove = async (id) => {
        try { 
            await approveUser(id); 
            fetchUsers(searchTerm, currentStatus, currentSort); 
        } catch (e) { 
            console.error(e); 
        }
    };

    const handleSuspend = async (id) => {
        try { 
            await suspendUser(id); 
            fetchUsers(searchTerm, currentStatus, currentSort); 
        } catch (e) { 
            console.error(e); 
        }
    };

    const confirmAndDeleteUser = async (password) => {
        if (!password) { setDeleteError("Password is required."); return; }
        if (selectedUser._id === currentAdminId) { setDeleteError("Cannot delete your own admin account."); return; }

        try {
            setDeleteLoading(true);
            setDeleteError("");
            await deleteUser(selectedUser._id);
            setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
            setSelectedUser(null);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Deletion failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-16 w-full animate-in fade-in duration-300">
            <PageTitle title="User Management" />
            
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
                                User Management
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 text-[#3559D4] dark:text-indigo-400 text-xs font-bold">
                                {users.length} Users
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor, verify, and moderate traveler accounts across Avora.
                        </p>
                    </div>
                </div>
            </div>

            {/* Unified Control Toolbar (Search + Status Tabs + Sort Dropdown) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                {/* Search input */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name, @username, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2.5 pl-9 pr-9 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/50"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(""); setSearchParams({}, { replace: true }); }}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Status Filter Tabs & Sort Dropdown */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
                        {[
                            { label: "All", value: "all" },
                            { label: "Pending", value: "pending" },
                            { label: "Approved", value: "approved" },
                            { label: "Suspended", value: "suspended" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleFilterChange(tab.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                    currentStatus === tab.value
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
                            {currentSort === "newest" ? "Newest" : currentSort === "oldest" ? "Oldest" : "Name A-Z"}
                        </span>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            aria-label="Sort users by"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table / List Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden w-full backdrop-blur-md">
                {loading ? (
                    <div className="flex h-56 flex-col items-center justify-center gap-2">
                        <Loader2 size={28} className="animate-spin text-[#3559D4]" />
                        <p className="text-xs font-bold text-slate-400">Loading user directory...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                            <Users size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No users found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Try adjusting your search terms or filter selection.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                                    <th className="py-3 px-5 font-bold">User Details</th>
                                    <th className="py-3 px-4 font-bold">Email</th>
                                    <th className="py-3 px-4 font-bold text-center">Status</th>
                                    <th className="py-3 px-4 font-bold text-center">Role</th>
                                    <th className="py-3 px-4 font-bold">Joined</th>
                                    <th className="py-3 px-5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                {users.map((user) => {
                                    const status = user.status?.toLowerCase();
                                    const isApproved = status === "approved";
                                    const isSuspended = status === "suspended";
                                    const isAdmin = user.role === "admin";
                                    const isSelf = user._id === currentAdminId;

                                    return (
                                        <tr key={user._id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                            {/* User Details */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3 min-w-[180px]">
                                                    {user.profileImage ? (
                                                        <img 
                                                            src={user.profileImage} 
                                                            alt="" 
                                                            className="h-10 w-10 rounded-xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0" 
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white font-bold text-xs shadow-2xs shrink-0">
                                                            {user.username?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-bold text-slate-900 dark:text-white leading-tight truncate">
                                                                {user.name || user.username}
                                                            </p>
                                                            {isSelf && (
                                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded-md border border-blue-100 dark:border-blue-800/40">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] font-semibold text-[#3559D4] dark:text-indigo-400 truncate">
                                                            @{user.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">
                                                {user.email}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                    isApproved 
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50" 
                                                        : isSuspended 
                                                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/50" 
                                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50"
                                                }`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {user.status || "Pending"}
                                                </span>
                                            </td>

                                            {/* Role */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                {isAdmin ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/50">
                                                        <Shield size={10} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                                        User
                                                    </span>
                                                )}
                                            </td>

                                            {/* Joined */}
                                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "N/A"}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(`/${user.username}`, "_blank", "noopener,noreferrer")}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                        title="View Profile"
                                                    >
                                                        <ExternalLink size={12} />
                                                        <span className="hidden sm:inline">Profile</span>
                                                    </button>

                                                    {!isApproved ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApprove(user._id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                            title="Approve User"
                                                        >
                                                            <UserCheck size={12} />
                                                            <span>Approve</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSuspend(user._id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                            title="Suspend User"
                                                        >
                                                            <ShieldAlert size={12} />
                                                            <span>Suspend</span>
                                                        </button>
                                                    )}

                                                    {!isSelf && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedUser(user)}
                                                            className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer active:scale-95 text-[11px] font-bold"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={12} />
                                                            <span className="hidden sm:inline">Delete</span>
                                                        </button>
                                                    )}
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

            <DeleteUserModal
                selectedUser={selectedUser}
                onClose={() => { setSelectedUser(null); setDeleteError(""); }}
                onConfirm={confirmAndDeleteUser}
                deleteLoading={deleteLoading}
                deleteError={deleteError}
            />
        </div>
    );
};

export default AdminUsers;
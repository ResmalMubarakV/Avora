import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getUsers, approveUser, suspendUser, deleteUser } from "../../api/adminApi";
import { getMyProfile } from "../../api/userApi";
import { Search, Loader2, UserCheck, ShieldAlert, Trash2, Shield, X, Filter, ExternalLink, ArrowLeft, ArrowUpDown } from "lucide-react";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

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
    const [isSearching, setIsSearching] = useState(false);
    
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
            setIsSearching(true);
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
            setIsSearching(false);
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
        try { await approveUser(id); fetchUsers(searchTerm, currentStatus, currentSort); } catch (e) { console.error(e); }
    };

    const handleSuspend = async (id) => {
        try { await suspendUser(id); fetchUsers(searchTerm, currentStatus, currentSort); } catch (e) { console.error(e); }
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
        <div className="space-y-6 pb-16 animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition w-fit cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Dashboard</span>
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900">User Management</h1>
                        <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-0.5">Monitor and moderate registered platform accounts.</p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-2.5 w-full lg:w-auto">
                        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 p-1 rounded-xl">
                            {[
                                { label: "All", value: "all" },
                                { label: "Pending", value: "pending" },
                                { label: "Approved", value: "approved" },
                                { label: "Suspended", value: "suspended" },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleFilterChange(tab.value)}
                                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg text-[11px] sm:text-xs lg:text-sm font-bold transition cursor-pointer shrink-0 ${
                                        currentStatus === tab.value
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex items-center bg-slate-100/80 p-2 sm:px-3 sm:py-1.5 lg:px-3.5 lg:py-2 rounded-xl group cursor-pointer shrink-0" title="Sort Order">
                            <ArrowUpDown size={14} className="text-slate-500 group-hover:text-slate-900 transition sm:mr-1.5" />
                            <span className="hidden sm:inline text-[11px] sm:text-xs lg:text-sm font-bold text-slate-700 capitalize">
                                {currentSort === "newest" ? "Newest" : currentSort === "oldest" ? "Oldest" : "A-Z"}
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
            </div>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-[11px] sm:text-xs lg:text-sm font-medium text-slate-800 outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
                {searchTerm && (
                    <button
                        onClick={() => { setSearchTerm(""); setSearchParams({}, { replace: true }); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex h-48 items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-200/80">
                    <Filter size={24} className="text-slate-300 mb-2" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">No users found</h3>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                    {users.map((user) => {
                        const status = user.status?.toLowerCase();
                        const isApproved = status === "approved";
                        const isSuspended = status === "suspended";
                        const isAdmin = user.role === "admin";
                        const isSelf = user._id === currentAdminId;

                        return (
                            <div key={user._id} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto] items-center p-3.5 sm:p-4 lg:p-5 gap-3.5 md:gap-6 hover:bg-slate-50/60 transition">
                                {/* Column 1: Avatar */}
                                <div className="shrink-0 hidden md:block">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="" className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-2xl object-cover border border-slate-200 shadow-xs" />
                                    ) : (
                                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-xs sm:text-sm border border-blue-100 shadow-xs">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Column 2: User Info */}
                                <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                                    <div className="shrink-0 md:hidden">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover border border-slate-200 shadow-xs" />
                                        ) : (
                                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-[11px] sm:text-xs border border-blue-100 shadow-xs">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 space-y-0.5 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 truncate">
                                                {user.name || user.username} {isSelf && <span className="text-slate-400 font-normal text-[10px] sm:text-xs">(You)</span>}
                                            </p>
                                            {isAdmin && <span className="text-[9px] sm:text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-100">Admin</span>}
                                        </div>
                                        <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 font-medium truncate">@{user.username} • {user.email}</p>
                                    </div>
                                </div>

                                {/* Column 3: Spacer for equal layout formatting on desktop */}
                                <div className="hidden md:block" />

                                {/* Column 4: Status Badge */}
                                <div className="flex items-center justify-between md:justify-center w-full md:w-auto pt-2 md:pt-0 border-t border-slate-100 md:border-t-0">
                                    <div className="flex justify-start md:justify-center w-full md:w-auto">
                                        <span className={`text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider ${
                                            isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : isSuspended ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                        }`}>
                                            {user.status || "Pending"}
                                        </span>
                                    </div>

                                    {/* Mobile inline action buttons (Icon only) */}
                                    <div className="flex md:hidden items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => window.open(`/${user.username}`, "_blank", "noopener,noreferrer")}
                                            className="p-1.5 sm:p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                                            title="View Profile"
                                            aria-label="View Profile"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                        {!isApproved ? (
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="p-1.5 sm:p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                                                title="Approve User"
                                                aria-label="Approve User"
                                            >
                                                <UserCheck size={14} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleSuspend(user._id)}
                                                className="p-1.5 sm:p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                                                title="Suspend User"
                                                aria-label="Suspend User"
                                            >
                                                <ShieldAlert size={14} />
                                            </button>
                                        )}
                                        {!isSelf && (
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-1.5 sm:p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                                                title="Delete User"
                                                aria-label="Delete User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Column 5: Tablet & Desktop Action Buttons */}
                                <div className="hidden md:flex items-center justify-end shrink-0 gap-1.5 sm:gap-2">
                                    <button
                                        onClick={() => window.open(`/${user.username}`, "_blank", "noopener,noreferrer")}
                                        className="inline-flex items-center justify-center gap-1 p-1.5 sm:p-2 lg:px-3 lg:py-1.5 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] sm:text-xs font-bold cursor-pointer"
                                        title="View Profile"
                                    >
                                        <ExternalLink size={14} />
                                        <span className="hidden lg:inline">Profile</span>
                                    </button>

                                    {!isApproved ? (
                                        <button
                                            onClick={() => handleApprove(user._id)}
                                            className="inline-flex items-center justify-center gap-1 p-1.5 sm:p-2 lg:px-3 lg:py-1.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] sm:text-xs font-bold cursor-pointer"
                                            title="Approve User"
                                        >
                                            <UserCheck size={14} />
                                            <span className="hidden lg:inline">Approve</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSuspend(user._id)}
                                            className="inline-flex items-center justify-center gap-1 p-1.5 sm:p-2 lg:px-3 lg:py-1.5 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] sm:text-xs font-bold cursor-pointer"
                                            title="Suspend User"
                                        >
                                            <ShieldAlert size={14} />
                                            <span className="hidden lg:inline">Suspend</span>
                                        </button>
                                    )}

                                    {!isSelf && (
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="inline-flex items-center justify-center gap-1 p-1.5 sm:p-2 lg:px-3 lg:py-1.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 text-[11px] sm:text-xs font-bold cursor-pointer"
                                            title="Delete User"
                                        >
                                            <Trash2 size={14} />
                                            <span className="hidden lg:inline">Delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
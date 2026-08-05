import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getUsers, approveUser, suspendUser, deleteUser } from "../../api/adminApi";
import { Search, Loader2, UserCheck, ShieldAlert, Trash2, Mail, Calendar, Shield, X, Filter } from "lucide-react";

// ==========================================
// ADMIN USERS PAGE
// ==========================================
const AdminUsers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    const currentStatus = searchParams.get("status") || "all";

    const fetchUsers = useCallback(async (searchQuery = "", statusFilter = "all") => {
        try {
            setIsSearching(true);
            const response = await getUsers({ search: searchQuery, status: statusFilter });
            
            // Safely parse users response array
            const userArray = response?.users || response?.data || response || [];
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
        const timer = setTimeout(() => {
            fetchUsers(searchTerm, currentStatus);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentStatus, fetchUsers]);

    const handleFilterChange = (status) => {
        if (status === "all") {
            searchParams.delete("status");
        } else {
            searchParams.set("status", status);
        }
        setSearchParams(searchParams);
    };

    const handleApprove = async (id) => {
        try {
            await approveUser(id);
            fetchUsers(searchTerm, currentStatus);
        } catch (error) {
            console.error("Approve User Error:", error);
        }
    };

    const handleSuspend = async (id) => {
        try {
            await suspendUser(id);
            fetchUsers(searchTerm, currentStatus);
        } catch (error) {
            console.error("Suspend User Error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user permanently?")) {
            try {
                await deleteUser(id);
                fetchUsers(searchTerm, currentStatus);
            } catch (error) {
                console.error("Delete User Error:", error);
            }
        }
    };

    return (
        <div className="space-y-6 pb-16 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen p-4 sm:p-8 rounded-3xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        User Management
                    </h1>
                    <p className="text-xs font-medium text-slate-500">
                        Monitor registered accounts, approve verifications, and manage system access
                    </p>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                    {[
                        { label: "All Users", value: "all" },
                        { label: "Pending", value: "pending" },
                        { label: "Approved", value: "approved" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleFilterChange(tab.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                                currentStatus === tab.value
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search users by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-24 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#3559D4] focus:ring-4 focus:ring-blue-100 shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 gap-2">
                    {isSearching ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 animate-pulse">
                            <Loader2 size={14} className="animate-spin" />
                            <span>Searching...</span>
                        </div>
                    ) : searchTerm ? (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition"
                        >
                            <X size={16} />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Main Content View */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-3">
                        <Filter size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">No users found</h3>
                    <p className="text-xs text-slate-500">Try adjusting your search criteria or filter tabs.</p>
                </div>
            ) : (
                <>
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-6">
                                    <th className="py-4 px-6">User Profile</th>
                                    <th className="py-4 px-4">Email</th>
                                    <th className="py-4 px-4">Role & Status</th>
                                    <th className="py-4 px-4">Joined Date</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {users.map((user) => {
                                    const isApproved = user.status === "approved";
                                    const isAdmin = user.role === "admin";
                                    return (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold shrink-0 shadow-xs">
                                                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">
                                                            {user.name || user.username}
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-medium">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-xs font-medium text-slate-600">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    {isAdmin && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                                            <Shield size={10} /> Admin
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                                                        isApproved 
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                                            : "bg-amber-50 text-amber-700 border border-amber-100"
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                        {user.status || "Pending"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-xs font-medium text-slate-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    {!isApproved ? (
                                                        <button
                                                            onClick={() => handleApprove(user._id)}
                                                            title="Approve User"
                                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-xs"
                                                        >
                                                            <UserCheck size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSuspend(user._id)}
                                                            title="Suspend Access"
                                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition cursor-pointer shadow-xs"
                                                        >
                                                            <ShieldAlert size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        title="Delete User"
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition cursor-pointer shadow-xs"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {users.map((user) => {
                            const isApproved = user.status === "approved";
                            const isAdmin = user.role === "admin";
                            return (
                                <div key={user._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold shadow-xs">
                                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">{user.name || user.username}</h3>
                                                <p className="text-xs text-slate-500 font-medium">@{user.username}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {isAdmin && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                                    Admin
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                                                isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                            }`}>
                                                {user.status || "Pending"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2 truncate">
                                            <Mail size={14} className="text-slate-400 shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400 shrink-0" />
                                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                                        {!isApproved ? (
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-xs font-bold text-emerald-700 active:scale-95 cursor-pointer"
                                            >
                                                <UserCheck size={14} /> Approve
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleSuspend(user._id)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 py-2.5 text-xs font-bold text-amber-700 active:scale-95 cursor-pointer"
                                            >
                                                <ShieldAlert size={14} /> Suspend
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 active:scale-95 cursor-pointer"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUsers;
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getUsers, approveUser, suspendUser, deleteUser } from "../../api/adminApi";
import api from "../../api/axios";
import { Search, Loader2, UserCheck, ShieldAlert, Trash2, Mail, Calendar, Shield, X, Filter } from "lucide-react";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// ADMIN USERS PAGE
// ==========================================
const AdminUsers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    
    const currentStatus = searchParams.get("status") || "all";

    const fetchUsers = useCallback(async (searchQuery = "", statusFilter = "all") => {
        try {
            setIsSearching(true);
            const response = await getUsers({ search: searchQuery, status: statusFilter });
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

            await deleteUser(selectedUserForDelete._id);
            fetchUsers(searchTerm, currentStatus);
            
            setSelectedUserForDelete(null);
            setPassword("");
            setShowPassword(false);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Incorrect password or authentication failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-16 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen p-4 sm:p-8 rounded-3xl">
            <PageTitle title="User Management" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        User Management
                    </h1>
                    <p className="text-xs font-medium text-slate-500">
                        Monitor registered accounts, approve verifications, and manage system access
                    </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                    {[
                        { label: "All Users", value: "all" },
                        { label: "Pending", value: "pending" },
                        { label: "Approved", value: "approved" },
                        { label: "Suspended", value: "suspended" },
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
            </div>

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
                <div className="hidden md:flex flex-col gap-3">
                    {users.map((user) => {
                        const isApproved = user.status === "approved";
                        const isSuspended = user.status === "suspended";
                        const isAdmin = user.role === "admin";
                        
                        return (
                            <div
                                key={user._id}
                                className="grid grid-cols-12 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition hover:shadow-md hover:border-slate-300"
                            >
                                <div className="col-span-3 flex items-center gap-3.5 min-w-0">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold shrink-0">
                                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate leading-tight">
                                            {user.name || user.username}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">@{user.username}</p>
                                    </div>
                                </div>

                                <div className="col-span-3 flex items-center gap-2 text-xs font-medium text-slate-600 truncate">
                                    <Mail size={13} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>

                                <div className="col-span-2 flex items-center gap-2">
                                    {isAdmin && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                            <Shield size={9} /> Admin
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border bg-slate-50 text-slate-700">
                                        {user.status || "Pending"}
                                    </span>
                                </div>

                                <div className="col-span-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                                    <Calendar size={13} className="text-slate-400 shrink-0" />
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="col-span-3 flex items-center justify-end gap-2">
                                    <div className="w-[88px] flex justify-center">
                                        {!isApproved && (
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-2xs transition hover:bg-emerald-100 cursor-pointer active:scale-95"
                                            >
                                                <UserCheck size={13} /> Approve
                                            </button>
                                        )}
                                    </div>

                                    <div className="w-[88px] flex justify-center">
                                        {!isSuspended && (
                                            <button
                                                onClick={() => handleSuspend(user._id)}
                                                className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-2xs transition hover:bg-amber-100 cursor-pointer active:scale-95"
                                            >
                                                <ShieldAlert size={13} /> Suspend
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedUserForDelete(user)}
                                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-100 cursor-pointer active:scale-95"
                                    >
                                        <Trash2 size={13} /> Delete
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

export default AdminUsers;
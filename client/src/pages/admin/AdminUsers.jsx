import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, UserCheck, UserX, Clock3, ArrowLeft, Mail, Calendar } from "lucide-react";
import { getUsers, approveUser, suspendUser } from "../../api/adminApi";

const tabs = ["All", "Pending", "Approved", "Suspended"];

// ==========================================
// ADMIN USERS PAGE
// ==========================================
const AdminUsers = () => {
    const navigate = useNavigate();
    const [searchParams, setsearchParams] = useSearchParams();
    const statusParam = searchParams.get("status");

    const getInitialTab = () => {
        if (!statusParam) return "All";
        const formatted = statusParam.charAt(0).toUpperCase() + statusParam.slice(1).toLowerCase();
        return tabs.includes(formatted) ? formatted : "All";
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (statusParam) {
            const formatted = statusParam.charAt(0).toUpperCase() + statusParam.slice(1).toLowerCase();
            if (tabs.includes(formatted)) {
                setActiveTab(formatted);
            }
        } else {
            setActiveTab("All");
        }
    }, [statusParam]);

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            const data = await getUsers(activeTab === "All" ? "" : activeTab.toLowerCase());
            setUsers(data.filter((u) => u.role !== "admin"));
        } catch (error) {
            console.error("Fetch Users Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "All") {
            setsearchParams({});
        } else {
            setsearchParams({ status: tab.toLowerCase() });
        }
    };

    const approve = async (id) => {
        try {
            await approveUser(id);
            await fetchUsersData();
        } catch (error) {
            console.error("Approve User Error:", error);
        }
    };

    const suspend = async (id) => {
        try {
            await suspendUser(id);
            await fetchUsersData();
        } catch (error) {
            console.error("Suspend User Error:", error);
        }
    };

    const filteredUsers = users.filter((user) => {
        return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="space-y-8 pb-16 animate-in fade-in duration-300">
            {/* Header Section */}
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
                        Users Directory
                    </h1>
                    <p className="mt-1 text-sm sm:text-base text-slate-500">
                        Seamlessly review, approve, and moderate registered platform accounts.
                    </p>
                </div>
            </div>

            {/* Search Bar & Tabs Filter Toolbar */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => handleTabChange(tab)}
                            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Container Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading directory...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
                        <Clock3 size={32} className="text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-800">No users found</h3>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter category.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile/Tablet Card Layout (< 1024px) */}
                        <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                            {filteredUsers.map((user) => {
                                const status = user.status?.toLowerCase();
                                const badgeStyles =
                                    status === "approved"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                        : status === "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                        : "bg-red-50 text-red-700 border-red-200/60";

                                return (
                                    <div key={user._id} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <img
                                                    src={user.profileImage || "https://placehold.co/80x80"}
                                                    alt={user.name}
                                                    className="h-12 w-12 shrink-0 rounded-full object-cover border border-slate-200 shadow-sm"
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate">{user.name}</h3>
                                                    <p className="text-xs font-semibold text-[#3559D4]">@{user.username}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${badgeStyles}`}>
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {user.status}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-slate-600">
                                            <div className="flex items-center gap-2 truncate">
                                                <Mail size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400 shrink-0" />
                                                <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                                            {user.status !== "approved" && (
                                                <button
                                                    type="button"
                                                    onClick={() => approve(user._id)}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer active:scale-95"
                                                >
                                                    <UserCheck size={15} />
                                                    <span>Approve</span>
                                                </button>
                                            )}
                                            {user.status !== "suspended" && (
                                                <button
                                                    type="button"
                                                    onClick={() => suspend(user._id)}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 cursor-pointer active:scale-95"
                                                >
                                                    <UserX size={15} />
                                                    <span>Suspend</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table Layout (>= 1024px) */}
                        <div className="hidden lg:block overflow-x-hidden">
                            <table className="min-w-full text-left border-collapse">
                                <thead className="bg-slate-50/75 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User Profile</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Joined Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredUsers.map((user) => {
                                        const status = user.status?.toLowerCase();
                                        const badgeStyles =
                                            status === "approved"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                                : status === "pending"
                                                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                                : "bg-red-50 text-red-700 border-red-200/60";

                                        return (
                                            <tr key={user._id} className="transition-colors hover:bg-slate-50/80">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <img
                                                            src={user.profileImage || "https://placehold.co/80x80"}
                                                            alt={user.name}
                                                            className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-200 shadow-sm"
                                                        />
                                                        <div className="min-w-0 max-w-[240px]">
                                                            <h3 className="font-bold text-slate-900 truncate">{user.name}</h3>
                                                            <p className="text-xs font-semibold text-[#3559D4] truncate">@{user.username}</p>
                                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${badgeStyles}`}>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {user.status !== "approved" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => approve(user._id)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
                                                            >
                                                                <UserCheck size={15} />
                                                                <span>Approve</span>
                                                            </button>
                                                        )}
                                                        {user.status !== "suspended" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => suspend(user._id)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 active:scale-95 cursor-pointer"
                                                            >
                                                                <UserX size={15} />
                                                                <span>Suspend</span>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
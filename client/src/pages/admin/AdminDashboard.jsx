import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, approveUser, suspendUser, deleteMemory } from "../../api/adminApi";
import DashboardStats from "../../components/admin/DashboardStats";
import PendingUsers from "../../components/admin/PendingUsers";
import RecentUsers from "../../components/admin/RecentUsers";
import RecentMemories from "../../components/admin/RecentMemories";
import PageTitle from "../../components/common/PageTitle";
import { ShieldAlert, Loader2, X, Sparkles, Activity, Users, Images, Clock, Eye, EyeOff } from "lucide-react";

// ==========================================
// ADMIN DASHBOARD PAGE
// ==========================================
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    const [coreStatusIndex, setCoreStatusIndex] = useState(0);
    const coreStatuses = [
        { label: "Operational Online", color: "text-emerald-300", dot: "bg-emerald-400" },
        { label: "Syncing DB Shards", color: "text-cyan-300", dot: "bg-cyan-400" },
        { label: "Indexing Memories", color: "text-blue-300", dot: "bg-blue-400" },
        { label: "Verifying Sessions", color: "text-indigo-300", dot: "bg-indigo-400" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCoreStatusIndex((prev) => (prev + 1) % coreStatuses.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [coreStatuses.length]);

    const fetchDashboardData = async () => {
        try {
            const data = await getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error("Fetch Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCardClick = (key) => {
        if (key === "all-users") navigate("/admin/users");
        else if (key === "pending") navigate("/admin/users?status=pending");
        else if (key === "approved") navigate("/admin/users?status=approved");
        else if (key === "memories") navigate("/admin/memories");
    };

    const handleApprove = async (id) => {
        try { await approveUser(id); await fetchDashboardData(); } catch (e) { console.error(e); }
    };

    const handleSuspend = async (id) => {
        try { await suspendUser(id); await fetchDashboardData(); } catch (e) { console.error(e); }
    };

    const handleViewMemory = (memory) => {
        const username = memory.user?.username;
        const slug = memory.slug || memory._id;
        if (username) window.open(`/${username}/${slug}`, "_blank");
    };

    const confirmAndDeleteMemory = async (e) => {
        e.preventDefault();
        if (!password) { setDeleteError("Password is required."); return; }

        try {
            setDeleteLoading(true);
            setDeleteError("");
            await deleteMemory(selectedMemory._id);
            await fetchDashboardData();
            setSelectedMemory(null);
            setPassword("");
            setShowPassword(false);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Deletion failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center bg-slate-50">
                <PageTitle title="Loading Admin Dashboard" />
                <Loader2 size={28} className="animate-spin text-[#3559D4]" />
            </div>
        );
    }

    const currentCore = coreStatuses[coreStatusIndex];
    const totalUsers = dashboard?.stats?.totalUsers || 0;
    const totalMemories = dashboard?.stats?.totalMemories || 0;
    const pendingReviews = dashboard?.stats?.pendingUsers || 0;

    return (
        <div className="space-y-4 sm:space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 overflow-x-hidden">
            <PageTitle title="Avora - Admin Dashboard" />
            
            {/* Streamlined Mobile-Friendly Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] p-5 sm:p-8 text-white shadow-md">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md mb-2 border border-white/10">
                            <Sparkles size={11} className="text-blue-200 shrink-0" />
                            <span>Enterprise Control Center</span>
                        </div>
                        <h1 className="text-xl sm:text-3xl font-black tracking-tight truncate">
                            {greeting}, Administrator
                        </h1>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-blue-100/90 font-medium">
                            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                                <Users size={12} className="text-blue-200" />
                                <strong>{totalUsers}</strong> Users
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                                <Images size={12} className="text-blue-200" />
                                <strong>{totalMemories}</strong> Memories
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                                <Clock size={12} className="text-amber-300" />
                                <strong>{pendingReviews}</strong> Pending
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-3 py-2 backdrop-blur-md self-start md:self-auto shrink-0">
                        <Activity size={16} className="animate-pulse text-blue-200 shrink-0" />
                        <div className="min-w-0">
                            <p className={`text-[11px] font-bold ${currentCore.color} flex items-center gap-1.5 truncate`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${currentCore.dot} animate-ping shrink-0`} />
                                <span className="truncate">{currentCore.label}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Metric Stats Cards */}
            <DashboardStats
                totalUsers={totalUsers}
                pendingUsers={pendingReviews}
                approvedUsers={dashboard?.stats?.approvedUsers || 0}
                totalMemories={totalMemories}
                onCardClick={handleCardClick}
            />

            {/* Pending Approvals Queue */}
            <div className="w-full overflow-x-hidden">
                <PendingUsers
                    users={dashboard?.pendingUsers || []}
                    onApprove={handleApprove}
                    onSuspend={handleSuspend}
                />
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                <div className="min-w-0 overflow-x-hidden">
                    <RecentUsers
                        users={dashboard?.recentUsers || []}
                        onView={(user) => window.open(`/${user.username}`, "_blank")}
                    />
                </div>
                <div className="min-w-0 overflow-x-hidden">
                    <RecentMemories
                        memories={dashboard?.recentMemories || []}
                        onView={handleViewMemory}
                        onDelete={(id) => {
                            const memoryToDelete = dashboard.recentMemories.find((m) => m._id === id);
                            setSelectedMemory(memoryToDelete);
                        }}
                    />
                </div>
            </div>

            {/* Secure Password Confirmation Modal */}
            {selectedMemory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white shadow-xl overflow-hidden">
                        <div className="h-1 w-full bg-red-600" />
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5 text-red-600 min-w-0">
                                    <ShieldAlert size={20} />
                                    <h3 className="text-base font-bold text-slate-900 truncate">Confirm Deletion</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedMemory(null); setPassword(""); setShowPassword(false); setDeleteError(""); }}
                                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-600 mb-4 font-medium">
                                Permanently delete <span className="font-bold text-slate-900">"{selectedMemory.title}"</span>?
                            </p>

                            {deleteError && (
                                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
                                    {deleteError}
                                </div>
                            )}

                            <form onSubmit={confirmAndDeleteMemory} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Admin password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                        disabled={deleteLoading}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-3 pr-10 text-xs text-slate-800 outline-none focus:border-red-500 focus:bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedMemory(null); setPassword(""); setShowPassword(false); setDeleteError(""); }}
                                        disabled={deleteLoading}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={deleteLoading || !password}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <span>Delete</span>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, approveUser, suspendUser, deleteMemory } from "../../api/adminApi";
import DashboardStats from "../../components/admin/DashboardStats";
import PendingUsers from "../../components/admin/PendingUsers";
import RecentUsers from "../../components/admin/RecentUsers";
import RecentMemories from "../../components/admin/RecentMemories";
import PageTitle from "../../components/common/PageTitle";
import DeleteMemoryModal from "../../components/admin/DeleteMemoryModal";
import {
    Loader2,
    Users,
    Images,
    KeyRound,
    ArrowRight,
    Shield,
    Sparkles,
} from "lucide-react";

// ==========================================
// ADMIN DASHBOARD PAGE
// ==========================================
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 17) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

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
        try { 
            await approveUser(id); 
            await fetchDashboardData(); 
        } catch (e) { 
            console.error(e); 
        }
    };

    const handleSuspend = async (id) => {
        try { 
            await suspendUser(id); 
            await fetchDashboardData(); 
        } catch (e) { 
            console.error(e); 
        }
    };

    const handleViewMemory = (memory) => {
        const username = memory.user?.username;
        const slug = memory.slug || memory._id;
        if (username) window.open(`/${username}/${slug}`, "_blank", "noopener,noreferrer");
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
            await fetchDashboardData();
            setSelectedMemory(null);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Deletion failed. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3 w-full">
                <PageTitle title="Loading Admin Dashboard" />
                <Loader2 size={32} className="animate-spin text-[#3559D4]" />
                <p className="text-xs font-semibold text-slate-400">Loading control center...</p>
            </div>
        );
    }

    const totalUsers = dashboard?.stats?.totalUsers || 0;
    const totalMemories = dashboard?.stats?.totalMemories || 0;
    const pendingReviews = dashboard?.stats?.pendingUsers || 0;
    const approvedUsers = dashboard?.stats?.approvedUsers || 0;

    return (
        <div className="space-y-6 sm:space-y-8 pb-16 w-full animate-in fade-in duration-300">
            <PageTitle title="Admin Dashboard" />
            
            {/* Clean Avora Executive Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#3559D4] dark:text-indigo-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/40">
                            <Sparkles size={10} /> Enterprise Command
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {greeting}, Administrator 👋
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        Platform metrics, user approvals, and memory moderation overview.
                    </p>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/users")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900 px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                    >
                        <Users size={14} />
                        <span>Manage Users</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/memories")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 dark:hover:from-indigo-500 dark:hover:to-blue-500 active:scale-95 cursor-pointer"
                    >
                        <Images size={14} />
                        <span>Moderate Stories</span>
                    </button>
                </div>
            </div>

            {/* KPI Metric Strip */}
            <DashboardStats
                totalUsers={totalUsers}
                pendingUsers={pendingReviews}
                approvedUsers={approvedUsers}
                totalMemories={totalMemories}
                onCardClick={handleCardClick}
            />

            {/* Split Command Grid: Primary Moderation Stream (Left) + Activity & Quick Nav (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                
                {/* Left Column: Primary Moderation Queues (7 cols on lg, 8 cols on xl) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6 w-full">
                    {/* 1. Pending Approvals Queue */}
                    <PendingUsers
                        users={dashboard?.pendingUsers || []}
                        onApprove={handleApprove}
                        onSuspend={handleSuspend}
                    />

                    {/* 2. Recent Travel Memories Feed */}
                    <RecentMemories
                        memories={dashboard?.recentMemories || []}
                        onView={handleViewMemory}
                        onDelete={(id) => {
                            const memoryToDelete = dashboard?.recentMemories?.find((m) => m._id === id);
                            setSelectedMemory(memoryToDelete);
                        }}
                    />
                </div>

                {/* Right Column: Recent Users & Platform Quick Actions (5 cols on lg, 4 cols on xl) */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6 w-full">
                    {/* 1. Recent Signups Feed */}
                    <RecentUsers
                        users={dashboard?.recentUsers || []}
                    />

                    {/* 2. Quick Navigation & Security Overview Card */}
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 shrink-0">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Admin Security Hub
                                </h3>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    Quick administrative shortcuts
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/users?status=pending")}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span>Pending User Approvals</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                                    {pendingReviews}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/memories")}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer group"
                            >
                                <div className="flex items-center gap-2">
                                    <Images size={14} className="text-slate-400 dark:text-slate-500" />
                                    <span>All Community Stories</span>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/settings")}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer group"
                            >
                                <div className="flex items-center gap-2">
                                    <KeyRound size={14} className="text-slate-400 dark:text-slate-500" />
                                    <span>Update Master Password</span>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
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

export default AdminDashboard;
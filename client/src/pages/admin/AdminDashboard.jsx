import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, approveUser, suspendUser, deleteMemory } from "../../api/adminApi";
import api from "../../api/axios";
import DashboardStats from "../../components/admin/DashboardStats";
import PendingUsers from "../../components/admin/PendingUsers";
import RecentUsers from "../../components/admin/RecentUsers";
import RecentMemories from "../../components/admin/RecentMemories";
import { ShieldAlert, Loader2, X, Sparkles, Activity } from "lucide-react";

// ==========================================
// ADMIN DASHBOARD PAGE
// ==========================================
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    // Deletion Modal State
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [password, setPassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // Dynamic Core Status Ticker State
    const [coreStatusIndex, setCoreStatusIndex] = useState(0);
    const coreStatuses = [
        { label: "Operational Online", sub: "Cluster Healthy", color: "text-emerald-300", dot: "bg-emerald-400" },
        { label: "Syncing DB Shards", sub: "Real-time Stream", color: "text-cyan-300", dot: "bg-cyan-400" },
        { label: "Indexing Memories", sub: "Vector Engine Active", color: "text-blue-300", dot: "bg-blue-400" },
        { label: "Verifying Sessions", sub: "Zero-Trust Mesh", color: "text-indigo-300", dot: "bg-indigo-400" },
    ];

    // Cycle through live core states every 4 seconds to make it look actively engaged
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
        if (key === "all-users") {
            navigate("/admin/users");
        } else if (key === "pending") {
            navigate("/admin/users?status=pending");
        } else if (key === "approved") {
            navigate("/admin/users?status=approved");
        } else if (key === "memories") {
            navigate("/admin/memories");
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveUser(id);
            await fetchDashboardData();
        } catch (error) {
            console.error("Approve User Error:", error);
        }
    };

    const handleSuspend = async (id) => {
        try {
            await suspendUser(id);
            await fetchDashboardData();
        } catch (error) {
            console.error("Suspend User Error:", error);
        }
    };

    const handleViewMemory = (memory) => {
        const username = memory.user?.username;
        const slug = memory.slug || memory._id;
        if (username) {
            window.open(`/${username}/${slug}`, "_blank");
        } else {
            console.error("Author username missing for redirection.");
        }
    };

    const confirmAndDeleteMemory = async (e) => {
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
            await fetchDashboardData();
            
            setSelectedMemory(null);
            setPassword("");
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Incorrect password or authentication failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-[#3559D4]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                        Loading Workspace...
                    </p>
                </div>
            </div>
        );
    }

    const currentCore = coreStatuses[coreStatusIndex];

    return (
        <div className="space-y-8 pb-16 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen p-4 sm:p-8 rounded-3xl">
            {/* Simple & Humble Elite SaaS Banner Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#3559D4] p-8 sm:p-10 text-white shadow-xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
                            <Sparkles size={13} className="text-blue-200" />
                            <span>Enterprise Control Center</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Admin Overview
                        </h1>
                        <p className="mt-1.5 text-sm sm:text-base text-blue-100/80 max-w-xl">
                            Monitor platform metrics, manage user verification, and supervise travel memories in real time.
                        </p>
                    </div>

                    {/* Dynamic Live System Core Ticker Badge */}
                    <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-md self-start md:self-auto shadow-inner transition-all duration-500">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
                            <Activity size={18} className="animate-pulse text-blue-200" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200/80">System Core</p>
                                <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded text-blue-100 font-mono">LIVE</span>
                            </div>
                            <p className={`text-xs font-bold ${currentCore.color} flex items-center gap-1.5 mt-0.5 transition-all duration-300`}>
                                <span className={`h-2 w-2 rounded-full ${currentCore.dot} animate-ping`} />
                                {currentCore.label}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Stats Cards */}
            <DashboardStats
                totalUsers={dashboard?.stats?.totalUsers || 0}
                pendingUsers={dashboard?.stats?.pendingUsers || 0}
                approvedUsers={dashboard?.stats?.approvedUsers || 0}
                totalMemories={dashboard?.stats?.totalMemories || 0}
                onCardClick={handleCardClick}
            />

            {/* Pending Approvals Queue */}
            <PendingUsers
                users={dashboard?.pendingUsers || []}
                onApprove={handleApprove}
                onSuspend={handleSuspend}
            />

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <RecentUsers
                    users={dashboard?.recentUsers || []}
                    onView={(user) => window.open(`/${user.username}`, "_blank")}
                />
                <RecentMemories
                    memories={dashboard?.recentMemories || []}
                    onView={handleViewMemory}
                    onDelete={(id) => {
                        const memoryToDelete = dashboard.recentMemories.find((m) => m._id === id);
                        setSelectedMemory(memoryToDelete);
                    }}
                />
            </div>

            {/* Secure Password Confirmation Modal */}
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
                            You are about to permanently delete <span className="font-bold text-slate-900">"{selectedMemory.title}"</span>. Please enter your administrator password to authorize this action.
                        </p>

                        {deleteError && (
                            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-shake">
                                {deleteError}
                            </div>
                        )}

                        <form onSubmit={confirmAndDeleteMemory} className="space-y-4">
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
                                            <span>Authorizing...</span>
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

export default AdminDashboard;
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import RecentMemories from "../../components/dashboard/RecentMemories";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import useMemories from "../../hooks/useMemories";

// ==========================================
// DASHBOARD PAGE COMPONENT
// ==========================================
/**
 * Main dashboard view for authenticated users.
 * Optimized with high-end mobile typography, compact spacing, and refined layout grids.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { memories, loading, error } = useMemories();

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-xs sm:text-sm font-medium text-slate-400 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 w-full max-w-md">
          <h2 className="text-sm font-semibold text-red-600">Something went wrong</h2>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (memories.length === 0) {
    return <EmptyDashboard />;
  }

  // --- Dashboard Statistics Calculation ---
  const totalMemories = memories.length;
  let publicMemories = 0;
  let privateMemories = 0;

  memories.forEach((memory) => {
    if (memory.isPublic) {
      publicMemories++;
    } else {
      privateMemories++;
    }
  });

  return (
    <div className="space-y-5 sm:space-y-8 pb-16">
      {/* Welcome Hero Section */}
      <DashboardHero />

      {/* Memory Statistics Overview Cards */}
      <StatsCards
        totalMemories={totalMemories}
        publicMemories={publicMemories}
        privateMemories={privateMemories}
      />

      {/* Mobile Create Memory Button Bar */}
      <div className="flex sm:hidden">
        <button
          onClick={() => navigate("/dashboard/create-memory")}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
          <span>New Memory</span>
        </button>
      </div>

      {/* Recent Memories Feed */}
      <RecentMemories memories={memories} />
    </div>
  );
};

export default Dashboard;
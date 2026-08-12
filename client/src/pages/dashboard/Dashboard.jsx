import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { getDashboardMemories } from "../../api/memoryApi";
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import RecentMemories from "../../components/dashboard/RecentMemories";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// DASHBOARD PAGE COMPONENT
// ==========================================
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMemories();
        const memoriesArray = Array.isArray(data) ? data : (data?.memories || []);
        setMemories(memoriesArray);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
        toast.error("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.pathname]);

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // Instant local state mutator for like toggles (Instagram-like, zero refresh)
  const handleLikeToggle = (memoryId, newStatus) => {
    setMemories((prevMemories) =>
      prevMemories.map((m) =>
        m._id === memoryId ? { ...m, isLiked: newStatus } : m
      )
    );
  };

  if (loading && memories.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <PageTitle title="Dashboard" />
        <Loader2 className="h-9 w-9 animate-spin text-[#3559D4]" />
        <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <PageTitle title="Dashboard" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 w-full max-w-md">
          <h2 className="text-sm font-semibold text-red-600">Something went wrong</h2>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="space-y-4">
        <PageTitle title="Dashboard" />
        <DashboardHero />
        <EmptyDashboard />
      </div>
    );
  }

  const totalMemories = memories.length;
  let publicMemories = 0;
  let privateMemories = 0;
  let likedMemories = 0;

  memories.forEach((memory) => {
    if (memory.isPublic) {
      publicMemories++;
    } else {
      privateMemories++;
    }
    if (memory.isLiked) {
      likedMemories++;
    }
  });

  return (
    <div className="space-y-5 sm:space-y-8 pb-16">
      <PageTitle title="Dashboard" />

      <DashboardHero />

      <StatsCards
        totalMemories={totalMemories}
        publicMemories={publicMemories}
        privateMemories={privateMemories}
        likedMemories={likedMemories}
      />

      <RecentMemories memories={memories} onLikeToggle={handleLikeToggle} />
    </div>
  );
};

export default Dashboard;
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import RecentMemories from "../../components/dashboard/RecentMemories";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import useMemories from "../../hooks/useMemories";

const Dashboard = () => {
    const {
        memories,
        loading,
        error,
    } = useMemories();

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-slate-500">
                    Loading memories...
                </p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6">

                    <h2 className="text-lg font-semibold text-red-600">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-red-500">
                        {error}
                    </p>

                </div>
            </div>
        );
    }

    // Empty Dashboard
    if (memories.length === 0) {
        return <EmptyDashboard />;
    }

    // Dashboard Statistics

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
        <div className="space-y-8 lg:space-y-10">

            <DashboardHero />

            <StatsCards
                totalMemories={totalMemories}
                publicMemories={publicMemories}
                privateMemories={privateMemories}
            />

            <RecentMemories memories={memories} />

        </div>
    );
};

export default Dashboard;
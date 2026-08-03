import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import RecentMemories from "../../components/dashboard/RecentMemories";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";

import useMemories from "../../hooks/useMemories";

const Dashboard = () => {
    const navigate = useNavigate();

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
              {/* Mobile Create Memory Button */}

              <div className="flex justify-center md:hidden">

                  <button
                      onClick={() => navigate("/dashboard/create-memory")}
                      className="
                          group
                          inline-flex
                          items-center
                          justify-center
                          gap-2

                          min-w-[190px]

                          rounded-xl

                          bg-gradient-to-r
                          from-[#1E3A8A]
                          to-[#3559D4]

                          px-5
                          py-3

                          text-sm
                          font-semibold
                          text-white
                          shadow-lg
                          shadow-[#1E3A8A]/20

                          transition-all
                          duration-300

                          hover:-translate-y-0.5
                          hover:shadow-xl

                          active:scale-[0.98]
                      "
                  >

                      <Plus
                          size={18}
                          className="
                              transition-transform
                              duration-300
                              group-hover:rotate-90
                          "
                      />

                      <span>

                          New Memory

                      </span>

                  </button>

              </div>

            <RecentMemories memories={memories} />

        </div>

    );
};

export default Dashboard;
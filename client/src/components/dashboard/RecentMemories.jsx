import { useNavigate } from "react-router-dom";
import MemoryCard from "../cards/MemoryCard";

const RecentMemories = ({ memories }) => {

    const navigate = useNavigate();

    return (

        <section>

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold text-slate-900">

                        Recent Memories

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Your latest travel stories.

                    </p>

                </div>

                <button
                    onClick={() => navigate("/dashboard/memories")}
                    className="
                        text-sm
                        font-semibold
                        text-[#1E3A8A]
                        transition
                        hover:underline
                    "
                >

                    View All

                </button>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {memories.slice(0, 8).map((memory, index) => (
                    <div
                        key={memory._id}
                        className={`
                            ${
                                index >= 4 && index < 6
                                    ? "hidden md:block"
                                    : ""
                            }
                            ${
                                index >= 6
                                    ? "hidden xl:block"
                                    : ""
                            }
                        `}
                    >
                        <MemoryCard
                            key={memory._id}
                            memory={memory}
                            openFrom="/dashboard"
                            openLabel="Dashboard"
                            redirectTo="/dashboard"
                        />
                    </div>
                ))}
            </div>

        </section>

    );

};

export default RecentMemories;
import MemoryCard from "../../memory/MemoryCard";

const MemoriesSection = ({ memories, username }) => {
    return (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-slate-900">
                    Recent Memories
                </h2>

                <p className="mt-2 text-slate-500">
                    Explore journeys shared by this traveler.
                </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {memories.map((memory) => (
                    <MemoryCard
                        key={memory._id}
                        memory={memory}
                        username={username}
                    />
                ))}

            </div>

        </section>
    );
};

export default MemoriesSection;
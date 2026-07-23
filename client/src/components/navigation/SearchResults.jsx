import { Link } from "react-router-dom";

const SearchResults = ({ open, query, results, loading }) => {
    if (!open || !query.trim()) return null;

    const users = results.users || [];
    const memories = results.memories || [];
    const places = results.places || [];

    const hasResults =
        users.length > 0 ||
        memories.length > 0 ||
        places.length > 0;

    if (loading) {
        return (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <p className="text-center text-slate-500">
                    Searching...
                </p>
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900">
                    No results found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Try searching for another traveler, memory or place.
                </p>
            </div>
        );
    }

    return (
        <div
            className="
                absolute
                left-0
                right-0
                top-14
                z-50
                max-h-[480px]
                overflow-y-auto
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-2xl
            "
        >

            {/* Travelers */}

            {users.length > 0 && (
                <div className="border-b border-slate-100 p-4">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Travelers
                    </p>

                    <div className="space-y-1">

                        {users.map((user) => (

                            <Link
                                key={user._id}
                                to={`/${user.username}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-50"
                            >

                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
                                        {user.name.charAt(0)}
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {user.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        @{user.username}
                                    </p>
                                </div>

                            </Link>

                        ))}

                    </div>

                </div>
            )}

            {/* Memories */}

            {memories.length > 0 && (

                <div className={`${places.length ? "border-b" : ""} border-slate-100 p-4`}>

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Memories
                    </p>

                    <div className="space-y-1">

                        {memories.map((memory) => (

                            <Link
                                key={memory._id}
                                to={`/${memory.user.username}/${memory.slug}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-50"
                            >

                                <img
                                    src={memory.coverImage}
                                    alt={memory.title}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />

                                <div className="min-w-0">

                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {memory.title}
                                    </p>

                                    <p className="truncate text-xs text-slate-500">
                                        📍 {memory.location}
                                    </p>

                                </div>

                            </Link>

                        ))}

                    </div>

                </div>
            )}

            {/* Places */}

            {places.length > 0 && (

                <div className="p-4">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Places
                    </p>

                    <div className="space-y-1">

                        {places.map((place) => (

                            <button
                                key={place}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                            >
                                <span>📍</span>

                                <p className="text-sm text-slate-800">
                                    {place}
                                </p>

                            </button>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
};

export default SearchResults;
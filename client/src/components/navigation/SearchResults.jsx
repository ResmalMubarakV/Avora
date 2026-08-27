import { Link } from "react-router-dom";

// ==========================================
// SEARCH RESULTS COMPONENT
// ==========================================
const SearchResults = ({ open, query, results, loading }) => {
    if (!open || !query.trim()) return null;

    const users = results.users || [];
    const memories = results.memories || [];
    const places = results.places || [];

    const hasResults = users.length > 0 || memories.length > 0 || places.length > 0;

    if (loading) {
        return (
            <div className="absolute left-0 right-0 top-full mt-3 z-50 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl transition-colors duration-300">
                <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">Searching...</p>
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className="absolute left-0 right-0 top-full mt-3 z-50 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-2xl transition-colors duration-300">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No results found</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try searching for another traveler, memory or place.</p>
            </div>
        );
    }

    return (
        <div className="absolute left-0 right-0 top-full mt-3 z-50 max-h-[480px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-colors duration-300">
            {users.length > 0 && (
                <div className="border-b border-slate-100 dark:border-slate-800/80 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Travelers</p>
                    <div className="space-y-1">
                        {users.map((user) => (
                            <Link
                                key={user._id}
                                to={`/${user.username}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/90 group"
                            >
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="h-10 w-10 rounded-full object-cover shadow-sm shrink-0" />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 shadow-sm shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {memories.length > 0 && (
                <div className={`${places.length ? "border-b" : ""} border-slate-100 dark:border-slate-800/80 p-4`}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Memories</p>
                    <div className="space-y-1">
                        {memories.map((memory) => (
                            <Link
                                key={memory._id}
                                to={`/${memory.user.username}/${memory.slug}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/90 group"
                            >
                                <img src={memory.coverImage} alt={memory.title} className="h-12 w-12 rounded-lg object-cover shadow-sm shrink-0" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors">{memory.title}</p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">📍 {memory.location}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {places.length > 0 && (
                <div className="p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Places</p>
                    <div className="space-y-1">
                        {places.map((place) => (
                            <a
                                key={place}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/90 cursor-pointer group"
                            >
                                <span className="text-sm">📍</span>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#3559D4] dark:group-hover:text-indigo-400 transition-colors">{place}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
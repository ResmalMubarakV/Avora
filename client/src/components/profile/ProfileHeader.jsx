// ==========================================
// PROFILE HEADER COMPONENT
// ==========================================
/**
 * Renders the traveler profile banner and header section, featuring a cover photo banner, 
 * overlapping profile avatar, name, handle, bio, location, and total memory count.
 */
const ProfileHeader = ({ user, memoryCount }) => {
    return (
        <div>
            {/* Profile Cover Image Banner */}
            <div className="h-56 w-full bg-slate-200 overflow-hidden">
                {user.coverImage && (
                    <img
                        src={user.coverImage}
                        alt="Profile Cover"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Profile Details Section */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="-mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-5">
                    {/* Overlapping Profile Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 dark:ring-2 dark:ring-blue-500/30 bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 shadow-md dark:shadow-[0_0_22px_rgba(53,89,212,0.25)] transition-all duration-300">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-sky-600 font-bold text-white text-3xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* User Metadata & Information */}
                    <div className="pb-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {user.name}
                        </h1>

                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            @{user.username}
                        </p>

                        {user.bio && (
                            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl">
                                {user.bio}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                            {user.location && (
                                <span className="flex items-center gap-1">
                                    📍 {user.location}
                                </span>
                            )}

                            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                🗓 {memoryCount} {memoryCount === 1 ? "Memory" : "Memories"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
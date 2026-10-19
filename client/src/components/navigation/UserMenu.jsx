import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// USER MENU COMPONENT
// ==========================================
const UserMenu = () => {
    const { user, loading } = useCurrentUser();

    if (loading || !user) {
        return (
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="hidden md:block space-y-2">
                    <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <Link
            to={`/${user.username}`}
            className="group flex items-center gap-3 rounded-2xl px-2.5 py-1.5 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 active:scale-95"
            title="View Profile"
        >
            {user.profileImage ? (
                <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-[#3559D4]/40 dark:group-hover:ring-indigo-400/40 group-hover:scale-105 shadow-sm"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-gradient-to-br dark:from-indigo-600 dark:to-blue-600 font-semibold text-white ring-2 ring-transparent transition-all duration-300 group-hover:ring-[#3559D4]/40 dark:group-hover:ring-indigo-400/40 group-hover:scale-105 shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-[#3559D4] dark:group-hover:text-indigo-400">
                    {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    @{user.username}
                </p>
            </div>
        </Link>
    );
};

export default UserMenu;
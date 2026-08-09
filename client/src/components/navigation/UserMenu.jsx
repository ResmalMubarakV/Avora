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
                <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="hidden md:block space-y-2">
                    <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <Link
            to={`/${user.username}`}
            className="group flex items-center gap-3 rounded-2xl px-2 py-1 transition-all duration-300 hover:bg-slate-100"
        >
            {user.profileImage ? (
                <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-sky-400/40 group-hover:scale-105 shadow-sm"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-semibold text-white ring-2 ring-transparent transition-all duration-300 group-hover:ring-sky-400/40 group-hover:scale-105 shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-sky-600">
                    {user.name}
                </p>
                <p className="text-xs text-slate-500">
                    @{user.username}
                </p>
            </div>
        </Link>
    );
};

export default UserMenu;
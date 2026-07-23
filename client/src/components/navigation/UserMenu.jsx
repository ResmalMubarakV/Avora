import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserMenu = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);

    // Temporary user (replace with context later)
    const user = {
        name: "Resmal",
        username: "resmal._",
        profileImage: "",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div
            ref={menuRef}
            className="relative ml-4"
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-slate-100"
            >
                {user.profileImage ? (
                    <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold text-slate-800">
                        {user.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        @{user.username}
                    </p>
                </div>

                <svg
                    className={`hidden h-4 w-4 text-slate-500 transition md:block ${
                        open ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <p className="font-semibold text-slate-900">
                            {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                            @{user.username}
                        </p>
                    </div>

                    <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                        👤 My Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
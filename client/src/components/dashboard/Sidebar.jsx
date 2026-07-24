import {
  LayoutDashboard,
  Images,
  PlusCircle,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "My Memories",
    icon: Images,
    path: "/dashboard/memories",
  },
  {
    title: "Create Memory",
    icon: PlusCircle,
    path: "/dashboard/create-memory",
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
    path: "/dashboard/ai",
  },
  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
}) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>

      {/* Mobile Backdrop */}

      {isMobile && sidebarOpen && (

        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />

      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          bg-white
          shadow-[0_10px_35px_rgba(30,58,138,0.08)]
          transition-all
          duration-300
          ease-in-out
          flex
          flex-col

          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0 w-72"
                : "-translate-x-full w-72"
              : sidebarOpen
                ? "w-72"
                : "w-20"
          }
        `}
      >

        {/* Background */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white
              via-[#FAFBFD]
              to-[#1E3A8A]/10
            "
          />

          <div
            className="
              absolute
              -right-24
              top-20
              h-72
              w-72
              rounded-full
              bg-[#1E3A8A]/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -left-20
              bottom-0
              h-56
              w-56
              rounded-full
              bg-[#1E3A8A]/5
              blur-3xl
            "
          />

        </div>

        {/* Content */}

        <div className="relative z-10 flex h-full flex-col">

          {/* Toggle */}

          <div className="h-20 flex items-center justify-center px-3">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                h-12
                rounded-2xl
                transition-all
                duration-300
                hover:bg-[#1E3A8A]/5
                hover:text-[#1E3A8A]
                flex
                items-center

                ${
                  sidebarOpen
                    ? "w-full justify-between px-4"
                    : "w-12 justify-center"
                }
              `}
            >

              {sidebarOpen ? (

                <>

                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">

                    Menu

                  </span>

                  <X
                    size={20}
                    className="text-slate-500"
                  />

                </>

              ) : (

                <Menu
                  size={22}
                  className="text-slate-600"
                />

              )}

            </button>

          </div>

          {/* Navigation */}

          <nav className="flex-1 px-3 pt-8 space-y-3 overflow-y-auto">

            {menus.map((menu) => {

              const Icon = menu.icon;

              return (

                <NavLink
                  key={menu.title}
                  to={menu.path}
                  title={!sidebarOpen ? menu.title : ""}
                  onClick={() => {

                    if (isMobile) {
                      setSidebarOpen(false);
                    }

                  }}
                  className={({ isActive }) => `
                    flex
                    items-center
                    h-14
                    rounded-2xl
                    transition-all
                    duration-300

                    ${
                      sidebarOpen
                        ? "justify-start gap-4 px-4"
                        : "justify-center"
                    }

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-[#1E3A8A]
                          to-[#3559D4]
                          text-white
                          shadow-lg
                          shadow-[#1E3A8A]/20
                        `
                        : `
                          text-slate-600
                          hover:bg-[#1E3A8A]/5
                          hover:text-[#1E3A8A]
                        `
                    }
                  `}
                >

                  <Icon
                    size={22}
                    className="shrink-0"
                  />

                  <span
                    className={`
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-300

                      ${
                        sidebarOpen
                          ? "opacity-100 w-auto"
                          : "opacity-0 w-0"
                      }
                    `}
                  >

                    {menu.title}

                  </span>

                </NavLink>

              );

            })}

          </nav>

                    {/* Logout */}

          <div className="p-3 border-t border-slate-200/70">

            <button
              onClick={handleLogout}
              className={`
                w-full
                h-14
                rounded-2xl
                transition-all
                duration-300
                flex
                items-center

                ${
                  sidebarOpen
                    ? "justify-start gap-4 px-4"
                    : "justify-center"
                }

                text-red-600
                hover:bg-red-200
                hover:text-red-700
              `}
            >

              <LogOut
                size={22}
                className="shrink-0"
              />

              <span
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  transition-all
                  duration-300

                  ${
                    sidebarOpen
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0"
                  }
                `}
              >
                Logout
              </span>

            </button>

          </div>

        </div>

      </aside>

    </>
  );
};

export default Sidebar;
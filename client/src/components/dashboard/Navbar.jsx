import { Menu } from "lucide-react";
import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">

      <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-4">

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                hover:bg-slate-100
                transition
              "
            >
              <Menu size={22} />
            </button>
          )}

          <Logo
            to="/dashboard"
            size="sm"
          />

        </div>

        {/* Desktop Search */}

        <div className="hidden lg:flex flex-1 justify-center px-10">

          <div className="w-full max-w-xl">
            <SearchBar />
          </div>

        </div>

        {/* User */}

        <UserMenu />

      </div>

      {/* Mobile Search */}

      <div className="lg:hidden px-4 sm:px-6 pb-4">

        <SearchBar />

      </div>

    </header>
  );
};

export default Navbar;
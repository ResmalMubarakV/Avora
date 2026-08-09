import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Shield } from "lucide-react";

import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import AppHeader from "../../components/navigation/AppHeader";
import Navbar from "../../components/dashboard/Navbar";
import ProfileHero from "../../components/public/profile/ProfileHero";
import MemoriesSection from "../../components/public/profile/MemoriesSection";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// PUBLIC PROFILE PAGE COMPONENT
// ==========================================
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileUsername = username || currentUser?.username;
  const isOwner = currentUser?.username === profileUsername;
  const isAdminViewer = currentUser?.role === "admin";

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const fetchedUser = await getMyProfile();
        setCurrentUser(fetchedUser);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!profileUsername) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/public/${profileUsername}`);
        setUser(data.user);
        setMemories(data.memories);
      } catch (error) {
        if (error.response?.status === 403) {
          navigate("/403", { replace: true });
          return;
        }
        if (error.response?.status === 404) {
          navigate("/404", { replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUsername, location.key, navigate]);

  const handleBack = () => {
    if (isAdminViewer) {
      navigate("/admin", { replace: true });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <PageTitle title="Loading Profile" />
        <p className="text-lg font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const isLockedForViewer = user?.isLocked && !isOwner;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PageTitle title={user ? `${user.name} (@${user.username})` : "Travel Profile"} />

      {/* Navigation Header Management */}
      {isAdminViewer ? (
        // Professional Minimalist Admin Inspection Header Bar
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-3.5 backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={15} />
            <span>Back to Admin Panel</span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 shadow-xs">
            <Shield size={13} />
            <span>Admin Inspection Mode</span>
          </div>
        </header>
      ) : currentUser ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={false} />
      )}

      <div className="relative">
        {/* Render floating back button only if the user is not an admin viewer */}
        {!isAdminViewer && (
          isOwner ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-2.5 py-1 text-[11px] sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
            >
              <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span>Back to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-2.5 py-1 text-[11px] sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
            >
              <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span>Back</span>
            </button>
          )
        )}

        <ProfileHero
          user={user}
          isOwner={isOwner}
          memories={memories}
        />
      </div>

      {/* If profile is locked for viewer, show ONLY the locked alert card and hide all memories sections completely */}
      {isLockedForViewer ? (
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pt-10 pb-24">
          <div className="mx-auto max-w-xl text-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3559D4] border border-blue-100">
              <Lock size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">This Profile is Locked</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              @{user.username} has locked their account. You can view their basic profile details and bio, but their individual travel journey stories are hidden.
            </p>
          </div>
        </div>
      ) : (
        <MemoriesSection
          memories={memories}
          username={profileUsername}
          isOwner={isOwner}
        />
      )}
    </main>
  );
};

export default Profile;
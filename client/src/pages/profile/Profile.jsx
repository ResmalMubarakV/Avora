import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import { ArrowLeft, Lock, Shield, Loader2 } from "lucide-react";

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

  const reservedWords = ["login", "register", "forgot-password", "reset-password", "dashboard", "admin", "pending-approval", "suspended"];
  if (username && reservedWords.includes(username.toLowerCase())) {
    return <Navigate to={`/${username.toLowerCase()}`} replace />;
  }

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, public: 0, private: 0 });
  const [loading, setLoading] = useState(true);

  const profileUsername = username || currentUser?.username;
  const isOwner = currentUser?.username === profileUsername;
  const isAdminViewer = currentUser?.role === "admin";

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

    let isMounted = true;
    const fetchProfileUser = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/public/${profileUsername}`);
        if (isMounted) {
          setUser(data.user || data);
          setStats({
            total: data.totalMemories || 0,
            public: data.publicCount || 0,
            private: data.privateCount || 0,
          });
        }
      } catch (error) {
        if (!isMounted) return;
        if (error.response?.status === 403) {
          navigate("/403", { replace: true });
          return;
        }
        if (error.response?.status === 404) {
          navigate("/404", { replace: true });
          return;
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileUser();

    return () => {
      isMounted = false;
    };
  }, [profileUsername, navigate]);

  const handleBack = () => {
    if (isAdminViewer) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  if (loading && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-3">
        <PageTitle title="Loading Profile" />
        <Loader2 className="h-9 w-9 animate-spin text-[#3559D4]" />
        <p className="text-sm font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const isLockedForViewer = user?.isLocked && !isOwner;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PageTitle title={user ? `${user.name} (@${user.username})` : "Travel Profile"} />

      {isAdminViewer ? (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-3 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-md shadow-xs gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft size={14} className="sm:w-[15px] sm:h-[15px]" />
            <span>Back</span>
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-purple-700 shadow-xs truncate">
            <Shield size={12} className="sm:w-[13px] sm:h-[13px] shrink-0" />
            <span className="truncate">Admin Inspection Mode</span>
          </div>
        </header>
      ) : currentUser ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={false} />
      )}

      <div className="relative">
        {!isAdminViewer && isOwner && (
          <button
            onClick={handleBack}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-2.5 py-1 text-[11px] sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          >
            <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="inline sm:hidden">Back</span>
          </button>
        )}

        <ProfileHero
          user={user}
          isOwner={isOwner}
          stats={stats}
        />
      </div>

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
          username={profileUsername}
          isOwner={isOwner}
        />
      )}
    </main>
  );
};

export default Profile;
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <PageTitle title="Loading Profile" />
        <p className="text-lg font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PageTitle title={user ? `${user.name} (@${user.username})` : "Travel Profile"} />

      {isOwner ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={!!currentUser} />
      )}

      <div className="relative">
        {isOwner && (
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-2.5 py-1 text-[11px] sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          >
            <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span>Back to Dashboard</span>
          </button>
        )}

        <ProfileHero
          user={user}
          isOwner={isOwner}
          memories={memories}
        />
      </div>

      <MemoriesSection
        memories={memories}
        username={profileUsername}
        isOwner={isOwner}
      />
    </main>
  );
};

export default Profile;
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import AppHeader from "../../components/navigation/AppHeader";
import Navbar from "../../components/dashboard/Navbar";
import ProfileHero from "../../components/public/profile/ProfileHero";
import MemoriesSection from "../../components/public/profile/MemoriesSection";

// ==========================================
// PUBLIC PROFILE PAGE COMPONENT
// ==========================================
/**
 * Renders a user's profile page along with their published travel memories.
 * Renders the updated Navbar (without hamburger) for the owner and AppHeader for guests.
 */
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // --- State Variables ---
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine profile username (URL param or authenticated user's profile)
  const profileUsername = username || currentUser?.username;
  const isOwner = currentUser?.username === profileUsername;

  // --- Fetch Authenticated User on Mount ---
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

  // --- Fetch Target Profile and Memories ---
  // Re-fetches automatically whenever profileUsername or navigation route (location.key) changes
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

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUsername, location.key, navigate]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      {isOwner ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={!!currentUser} />
      )}

      {/* Hero Section with Conditional Back to Dashboard Button */}
      <div className="relative">
        {isOwner && (
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-2.5 py-1 text-[11px] sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
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

      {/* Published Memories Section */}
      <MemoriesSection
        memories={memories}
        username={profileUsername}
        isOwner={isOwner}
      />
    </main>
  );
};

export default Profile;
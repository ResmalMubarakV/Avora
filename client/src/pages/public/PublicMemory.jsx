import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import Navbar from "../../components/dashboard/Navbar";
import AppHeader from "../../components/navigation/AppHeader";
import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";
import PageTitle from "../../components/common/PageTitle";
import { Compass } from "lucide-react";

// ==========================================
// PUBLIC MEMORY PAGE COMPONENT
// ==========================================
/**
 * Renders a specific published travel memory detail view.
 * Integrates the responsive navigation header, synchronizes lightbox gallery viewing states 
 * with URL query parameters (?image=index), verifies viewer ownership privileges, and handles security redirects.
 */
const PublicMemory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State Variables ---
  const [currentUser, setCurrentUser] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Lightbox & Gallery State ---
  const imageParam = searchParams.get("image");
  const [isOpen, setIsOpen] = useState(imageParam !== null);
  const [selectedIndex, setSelectedIndex] = useState(
    imageParam ? Number(imageParam) : 0
  );

  // --- Gallery Navigation Handlers ---
  const openGallery = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    setSearchParams({ image: index.toString() }, { replace: false });
  };

  const goToImage = (index) => {
    setSelectedIndex(index);
    setSearchParams({ image: index.toString() }, { replace: false });
  };

  const nextImage = () => {
    setSelectedIndex((prev) => {
      if (!memory || prev >= memory.media.length - 1) return prev;
      const next = prev + 1;
      setSearchParams({ image: next.toString() }, { replace: false });
      return next;
    });
  };

  const previousImage = () => {
    setSelectedIndex((prev) => {
      if (prev <= 0) return prev;
      const previous = prev - 1;
      setSearchParams({ image: previous.toString() }, { replace: false });
      return previous;
    });
  };

  // --- Fetch Current User Profile on Mount ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getMyProfile();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  // --- Fetch Target Memory Data ---
  useEffect(() => {
    if (!username || !slug) return;

    const fetchMemory = async () => {
      try {
        const response = await api.get(`/api/public/${username}/${slug}`);
        setMemory(response.data);
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

    fetchMemory();
  }, [username, slug, navigate]);

  // Robust ownership check (supports string ID or populated user object)
  const memoryUserId = typeof memory?.user === "object" ? memory?.user?._id : memory?.user;
  const isOwner = Boolean(currentUser?._id && memoryUserId && currentUser._id === memoryUserId);

  // --- Sync Lightbox State with URL Search Params ---
  useEffect(() => {
    if (!memory) return;

    const image = searchParams.get("image");

    if (image === null) {
      setIsOpen(false);
      return;
    }

    const index = Number(image);
    if (Number.isNaN(index) || index < 0 || index >= memory.media.length) {
      setSearchParams({}, { replace: true });
      return;
    }

    setSelectedIndex(index);
    setIsOpen(true);
  }, [memory, searchParams, setSearchParams]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <PageTitle title="Loading Memory" />
        <p className="text-lg font-medium text-slate-500">Loading memory...</p>
      </div>
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PageTitle title={memory.title} />

      {/* Navigation Header: Unified Navbar for authenticated owner, AppHeader for public viewers/guests */}
      {isOwner ? (
        <Navbar />
      ) : (
        <AppHeader isOwner={false} isLoggedIn={!!currentUser} />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Soft Decorative Background Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent" />
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-[120px]" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-[150px]" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pt-8 lg:pt-12 pb-12">
          <MemoryHero
            memory={memory}
            username={username}
            openGallery={openGallery}
            isOwner={isOwner}
            locationState={location.state}
          />
        </div>
      </section>

      {/* Story Description Section with Refined Elegant Background */}
      <section className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-14 pb-24">
        {/* Subtle Background Glow behind the card */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-72 bg-gradient-to-r from-sky-200/20 via-blue-200/10 to-indigo-200/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-white shadow-xl shadow-sky-950/[0.03]">
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            {/* Heading */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-[#1E3A8A] text-white shadow-lg shadow-blue-500/20 overflow-hidden group">
                {/* Subtle pulse background animation */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-25 pointer-events-none" />
                
                {/* Smooth Slow Rotating Compass Icon */}
                <Compass size={24} className="transition-transform duration-700 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#3559D4]">
                  Travel Journal
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Journey Story
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-slate-100" />

            {/* Story Content */}
            <div className="w-full text-base sm:text-[17px] leading-8 sm:leading-9 text-slate-600 whitespace-pre-line font-medium">
              {memory.description}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Media Modal */}
      {isOpen && (
        <Lightbox
          media={memory.media}
          selectedIndex={selectedIndex}
          nextImage={nextImage}
          previousImage={previousImage}
          goToImage={goToImage}
          canDownload={isOwner}
          memoryTitle={memory.title}
          onClose={() => {
            setIsOpen(false);
            setSearchParams({}, { replace: false });
          }}
        />
      )}
    </main>
  );
};

export default PublicMemory;
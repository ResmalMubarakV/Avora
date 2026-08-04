import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import AppHeader from "../../components/navigation/AppHeader";
import Navbar from "../../components/dashboard/Navbar";
import ProfileHero from "../../components/public/profile/ProfileHero";
import MemoriesSection from "../../components/public/profile/MemoriesSection";

const Profile = () => {
    const { username } = useParams();

    const profileUsername = username
    ? username
    : currentUser?.username;
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sidebarOpen, setSidebarOpen] = useState(false);

const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
);

    const isOwner =
    currentUser?.username === profileUsername;

    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const user = await getMyProfile();

                setCurrentUser(user);

            } catch {

                // Visitor is not logged in
                setCurrentUser(null);

            }

        };

        fetchCurrentUser();

    }, []);

    useEffect(() => {

    if (!profileUsername) return;

    const fetchProfile = async () => {

        try {

            const { data } = await api.get(
                `/api/public/${profileUsername}`
            );

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

}, [profileUsername, navigate]);

useEffect(() => {

    const handleResize = () => {

        const mobile = window.innerWidth < 768;

        setIsMobile(mobile);

        if (mobile) {
            setSidebarOpen(false);
        }

    };

    window.addEventListener(
        "resize",
        handleResize
    );

    return () =>
        window.removeEventListener(
            "resize",
            handleResize
        );

}, []);

    if (loading) {
        return (
            <h1 className="text-center mt-20 text-lg">
                Loading...
            </h1>
        );
    }

return (
    <main className="min-h-screen bg-slate-50">

        {isOwner ? (

    <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
    />

) : (

    <AppHeader
        isOwner={false}
        isLoggedIn={false}
    />

)}

        <div className="relative">

            {isOwner && (

                <button
                    onClick={() => navigate("/dashboard")}
                    className="
                        absolute
                        top-6
                        left-6
                        z-20

                        inline-flex
                        items-center
                        gap-2

                        rounded-full
                        border
                        border-white/20

                        bg-white/10
                        backdrop-blur-xl

                        px-4
                        py-2.5

                        text-sm
                        font-medium
                        text-white

                        shadow-lg
                        shadow-black/20

                        transition-all
                        duration-300

                        hover:scale-105
                        hover:bg-white/20
                        hover:border-white/40
                    "
                >
                    <ArrowLeft size={18} />

                    Back to Dashboard

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
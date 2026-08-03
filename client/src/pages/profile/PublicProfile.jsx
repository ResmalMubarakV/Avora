import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";

import AppHeader from "../../components/navigation/AppHeader";
import ProfileHero from "../../components/public/profile/ProfileHero";
import MemoriesSection from "../../components/public/profile/MemoriesSection";

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwner =
        currentUser?.username === username;

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

        const fetchProfile = async () => {

            try {

                const { data } = await api.get(
                    `/api/public/${username}`
                );

                setUser(data.user);
                setMemories(data.memories);

            } catch (error) {

                if (error.response?.status === 403) {
                    navigate("/403", {
                        replace: true,
                    });
                    return;
                }

                if (error.response?.status === 404) {
                    navigate("/404", {
                        replace: true,
                    });
                    return;
                }

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, [username, navigate]);

    if (loading) {
        return (
            <h1 className="text-center mt-20 text-lg">
                Loading...
            </h1>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">

            <AppHeader />

            <ProfileHero user={user} />

            <MemoriesSection
                memories={memories}
                username={user.username}
                isOwner={isOwner}
            />

        </main>
    );
};

export default PublicProfile;